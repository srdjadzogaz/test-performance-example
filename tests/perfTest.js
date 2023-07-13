const { default: expect } = require("expect");

describe("Open devtools", () => {
  it("should load within performance budget", async () => {
    /**
     * this page load will take a bit longer as the DevTools service will
     * capture all metrics in the background
     */
    await browser.enablePerformanceAudits();
    await browser.url("http://www.google.com");

    let metrics = await browser.getMetrics();
    expect(metrics.speedIndex).toBeLessThan(1900); // check that speedIndex is below 1.9 secon

    let score = await browser.getPerformanceScore(); // get Lighthouse Performance score
    expect(score).toBeGreaterThanOrEqual(0.9); // Lighthouse Performance score is at 90% or higher
  });
});
