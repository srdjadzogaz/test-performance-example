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
    expect(metrics.speedIndex).toBeLessThan(1900);
    expect(metrics.firstContentfulPaint).toBeLessThan(1000);
    expect(metrics.firstMeaningfulPaint).toBeLessThan(2000);
    expect(metrics.largestContentfulPaint).toBeLessThan(1000);
    expect(metrics.interactive).toBeLessThan(10000);
    expect(metrics.timetoFirstByte).toBeLessThan(250);

    let score = await browser.getPerformanceScore();
    expect(score).toBeGreaterThanOrEqual(0.6);

    console.log(metrics);
  });
});
