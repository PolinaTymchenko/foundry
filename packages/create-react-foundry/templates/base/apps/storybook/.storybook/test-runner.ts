import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";

/**
 * Runs an automated axe scan against every story. This is the a11y gate
 * mentioned throughout Foundry's design: it fails the run on a real
 * violation, and there is no flag to suppress that on a per-story basis
 * beyond deliberately opting a story out via a11y.disable in its parameters.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    if (storyContext.parameters?.a11y?.disable) {
      return;
    }
    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
