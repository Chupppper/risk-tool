import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';

class RiskAssessmentTool extends LitElement {
  static properties = {
    responses: { type: Array },
    riskCategories: { type: Array },
    results: { type: Object },
    submitted: { type: Boolean },
  };

  constructor() {
    super();
    this.responses = Array(25).fill(0);
    this.riskCategories = [
      "Infrastructure Risk",
      "Application Risk",
      "Vendor Risk",
      "Cybersecurity Risk",
      "Operational Risk"
    ];
    this.questions = [/* [Same 25 questions here, omitted for brevity] */];
    this.results = {};
    this.submitted = false;
  }

  handleResponse(index, value) {
    this.responses[index] = parseInt(value);
  }

  handleSubmit() {
    this.calculateResults();
    this.submitted = true;
  }

  calculateResults() {
    const scores = [0, 0, 0, 0, 0];
    for (let i = 0; i < this.responses.length; i++) {
      const category = Math.floor(i / 5);
      scores[category] += this.responses[i];
    }
    const maxScore = Math.max(...scores);
    const highestRiskIndex = scores.indexOf(maxScore);
    this.results = {
      scores,
      riskiestCategory: this.riskCategories[highestRiskIndex],
      categoryBreakdown: this.riskCategories.map((cat, i) => ({
        category: cat,
        score: scores[i]
      }))
    };
  }

  renderPieChart() {
    const total = this.results.scores.reduce((a, b) => a + b, 0);
    let angleStart = 0;

    return html`<svg width="300" height="300" viewBox="0 0 32 32">
      ${this.results.categoryBreakdown.map((item, i) => {
        const value = item.score / total;
        const angleEnd = angleStart + value * 360;
        const largeArc = value > 0.5 ? 1 : 0;
        const x1 = 16 + 16 * Math.cos((angleStart - 90) * Math.PI / 180);
        const y1 = 16 + 16 * Math.sin((angleStart - 90) * Math.PI / 180);
        const x2 = 16 + 16 * Math.cos((angleEnd - 90) * Math.PI / 180);
        const y2 = 16 + 16 * Math.sin((angleEnd - 90) * Math.PI / 180);
        angleStart = angleEnd;

        return html`<path
          d="M16,16 L${x1},${y1} A16,16 0 ${largeArc},1 ${x2},${y2} Z"
          fill="${['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][i]}"
        ></path>`;
      })}
    </svg>`;
  }

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', sans-serif;
      padding: 2rem;
      background: #f9f9f9;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
    }
    h2 {
      color: #4A90E2;
    }
    .question {
      margin-bottom: 1rem;
    }
    select {
      margin-left: 1rem;
    }
    .results {
      margin-top: 2rem;
      background: #fff;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    button {
      margin-top: 2rem;
      padding: 0.6rem 1.2rem;
      background-color: #4A90E2;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    svg {
      display: block;
      margin: 1rem auto;
      width: 300px;
      height: 300px;
    }
  `;

  render() {
    return html`
      <h2>NLNB Risk Assessment Tool</h2>

      ${!this.submitted ? html`
        ${this.questions.map((q, i) => html`
          <div class="question">
            ${i + 1}. ${q}
            <select @change="${(e) => this.handleResponse(i, e.target.value)}">
              <option value="0">Select</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
        `)}
        <button @click="${this.handleSubmit}">Submit Assessment</button>
      ` : html`
        <div class="results">
          <h3>Risk Results Summary</h3>
          <ul>
            ${this.results.categoryBreakdown.map(r => html`
              <li><strong>${r.category}:</strong> ${r.score}</li>
            `)}
          </ul>
          <p><strong>Riskiest Category:</strong> ${this.results.riskiestCategory}</p>
          ${this.renderPieChart()}
        </div>
      `}
    `;
  }
}

customElements.define("risk-assessment-tool", RiskAssessmentTool);
