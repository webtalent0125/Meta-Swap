import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    default: true,
    label: 'Default',
  },
};

export const OutlineDefault: Story = {
  args: {
    outlinedef: true,
    label: 'OutlineDefault',
  },
};

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Primary',
  },
};

export const OutlinePrimary: Story = {
  args: {
    outlinePri: true,
    label: 'OutlinePrimary',
  },
};

export const Secondary: Story = {
  args: {
    secondary: true,
    label: 'Secondary',
  },
};

export const OutlineSecondary: Story = {
  args: {
    outlineSec: true,
    label: 'OutlineSecondary',
  },
};
