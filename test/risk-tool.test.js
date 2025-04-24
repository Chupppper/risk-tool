import { html, fixture, expect } from '@open-wc/testing';
import "../risk-tool.js";

describe("RiskTool test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <risk-tool
        title="title"
      ></risk-tool>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
