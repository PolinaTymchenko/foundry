import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from "./Input.js";

const meta: Meta<typeof Input> = {
  title: "Input",
  component: Input,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    label: "Email address",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    defaultValue: "",
  },
};

export const WithDescription: Story = {
  args: {
    description: "We'll only use this to send your receipt.",
  },
};

export const WithError: Story = {
  args: {
    defaultValue: "not-an-email",
    error: "Enter a valid email address.",
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "you@example.com",
    disabled: true,
  },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Controlled: Story = {
  render: (args) => {
    function ControlledExample() {
      const [value, setValue] = useState("");
      return (
        <Input
          {...args}
          value={value}
          onChange={setValue}
          description={`Current value: "${value}"`}
        />
      );
    }
    return <ControlledExample />;
  },
};
