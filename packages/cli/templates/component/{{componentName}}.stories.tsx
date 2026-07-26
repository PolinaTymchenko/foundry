import type { Meta, StoryObj } from "@storybook/react";
import { {{componentName}} } from "./{{componentName}}.js";

const meta: Meta<typeof {{componentName}}> = {
  title: "{{category}}/{{componentName}}",
  component: {{componentName}},
};

export default meta;
type Story = StoryObj<typeof {{componentName}}>;

export const Default: Story = {
  args: {
    children: "{{componentName}}",
  },
};
