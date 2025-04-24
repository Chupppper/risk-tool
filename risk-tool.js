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

  renderBarChart() {
    const maxScore = Math.max(...this.results.scores);
    return html`
      <div class="bar-chart">
        ${this.results.categoryBreakdown.map((item) => {
          const widthPercent = (item.score / maxScore) * 100;
          return html`
            <div class="bar-label">${item.category}</div>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${widthPercent}%;"></div>
              <span class="bar-score">${item.score}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  getRecommendations(category) {
    const recs = {
      "Infrastructure Risk": [
        "Conduct a full audit of hardware assets.",
        "Implement a disaster recovery strategy with redundancy.",
        "Ensure all firmware is regularly patched and access is controlled."
      ],
      "Application Risk": [
        "Enforce regular security testing on applications.",
        "Audit and update permission sets and roles.",
        "Ensure secure development lifecycle (SDLC) procedures are followed."
      ],
      "Vendor Risk": [
        "Review third-party SLAs and risk scoring.",
        "Request updated compliance certifications from all vendors.",
        "Develop fallback plans in case a key vendor fails."
      ],
      "Cybersecurity Risk": [
        "Roll out organization-wide phishing simulation training.",
        "Implement stronger endpoint protection and MFA.",
        "Invest in centralized logging and intrusion detection."
      ],
      "Operational Risk": [
        "Strengthen change management processes.",
        "Ensure regular staff training for IT operations.",
        "Analyze support tickets for recurring issues."
      ]
    };
    return recs[category] || ["No recommendations available."];
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

    .bar-chart {
      margin-top: 2rem;
    }
    .bar-label {
      margin: 0.5rem 0 0.2rem;
      font-weight: bold;
    }
    .bar-container {
      position: relative;
      background: #e0e0e0;
      border-radius: 4px;
      height: 24px;
      margin-bottom: 1rem;
    }
    .bar-fill {
      background: #4A90E2;
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .bar-score {
      position: absolute;
      top: 0;
      right: 10px;
      line-height: 24px;
      font-size: 14px;
      color: #fff;
      font-weight: bold;
    }

    .recommendations {
      margin-top: 2rem;
      background: #f1f9ff;
      padding: 1rem;
      border-left: 4px solid #4A90E2;
      border-radius: 8px;
    }
    .recommendations h3 {
      margin-top: 0;
      color: #0077cc;
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
            ${this.results.categoryBreakdown.map(r => {
              const percentage = ((r.score / this.results.scores.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
              return html`<li><strong>${r.category}:</strong> ${r.score} (${percentage}%)</li>`;
            })}
          </ul>
          <p><strong>Riskiest Category:</strong> ${this.results.riskiestCategory}</p>
          ${this.renderBarChart()}
          <div class="recommendations">
            <h3>Recommended Actions for ${this.results.riskiestCategory}</h3>
            <ul>
              ${this.getRecommendations(this.results.riskiestCategory).map(rec => html`<li>${rec}</li>`)}
            </ul>
          </div>
        </div>
      `}
    `;
  }
}

customElements.define("risk-assessment-tool", RiskAssessmentTool);
