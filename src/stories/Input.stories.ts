

import type { Meta, StoryObj } from '@storybook/react';

import { InputStory } from './Input';

const meta = {
    title: 'Example/Input',
    component: InputStory,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
      value:  { control: 'string' },
      placeholder:  { control: 'string' },
      type:  { control: 'string' },
    },
  } satisfies Meta<typeof InputStory>;
  
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Edit Input",
  },
};
