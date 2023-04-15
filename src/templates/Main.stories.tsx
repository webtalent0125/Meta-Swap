import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { Main } from './Main';

const meta: Meta<typeof Main> = {
  title: 'Example/Main',
  component: Main,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Main>;

export const MainWithReactComponent: Story = {
  args: {
    children: <div>Children node</div>,
  },
};

export const MainWithString: Story = {
  args: {
    children: 'String',
  },
};

export const MainWithHomeLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByRole('link', {
      name: /Home/i,
    });

    await userEvent.click(loginButton);
  },
};
