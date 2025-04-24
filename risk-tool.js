import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js';

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
    this.questions = [
      "Are all critical hardware assets regularly maintained and inventoried?",
      "Is the network infrastructure protected with redundant failover systems?",
      "Do systems and storage devices have current firmware and patch levels?",
      "Is there a disaster recovery plan for server and data center outages?",
      "Are access controls and physical security measures in place for all infrastructure?",
      "Is there a version control system in place for application software?",
      "Are user roles and permissions reviewed periodically across all apps?",
      "Is customer transaction data encrypted in transit and at rest?",
      "Are application logs regularly monitored for anomalies?",
      "Do applications undergo regular security and functionality testing?",
      "Do vendors have a documented incident response policy?",
      "Is there a current and binding SLA for each critical vendor?",
      "Are vendor systems audited for compliance with banking standards?",
      "Does the bank have contingency plans if a vendor fails?",
      "Are vendor security controls aligned with NLNB’s policies?",
      "Are endpoint security solutions (AV/EDR) deployed across all user machines?",
      "Is multi-factor authentication enforced for all administrative access?",
      "Are phishing and social engineering simulations conducted regularly?",
      "Is there a centralized log management system to detect threats?",
      "Are firewalls and intrusion detection systems regularly updated?",
      "Are employee access rights promptly removed upon termination?",
      "Are there defined and tested backup and recovery procedures?",
      "Are change management procedures followed for all system updates?",
      "Are helpdesk incident trends analyzed for root causes?",
      "Is staff training provided regularly for IT and cybersecurity protocols?"
    ];
    this.results = {};
    this.submitted = false;
  }

  handleResponse(index, value) {
    this.responses[index] = parseInt(value);
  }

  handleSubmit() {
    this.calculateResults();
    this.submitted = true;
    this.updateComplete.then(() => this.renderChart());
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

  renderChart() {
    const ctx = this.shadowRoot.getElementById('riskChart');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.results.categoryBreakdown.map(r => r.category),
        datasets: [{
          label: 'Risk Scores',
          data: this.results.categoryBreakdown.map(r => r.score),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Risk Category Distribution' }
        }
      }
    });
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
    canvas {
      max-width: 100%;
      margin-top: 1rem;
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
          <canvas id="riskChart"></canvas>
        </div>
      `}
    `;
  }
}

customElements.define("risk-assessment-tool", RiskAssessmentTool);
