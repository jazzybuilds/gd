import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { actions } from '@storybook/addon-actions';

import { Input, Radio, CheckBox, DatePicker, DropDown, InputError } from '.';

export default {
  title: 'Form Elements',
} as Meta;

const defaultProps = {
  label: "Label",
  name: "element",
  type: "text",
  selected: false,
  onBlur: () => actions('clicked')
}

export const RadioElement = () => <Radio {...defaultProps} />;
export const CheckBoxElement = () => <CheckBox {...defaultProps} />;
export const DropDownElement = () => {
  const [value, setValue] = React.useState()
  return (
    <DropDown options={[{value: '1', label: 'option 1'}, {value: '2', label: 'option 2'}]} onChange={e => setValue(e.target.value)}  value={value} {...defaultProps} />
  )
};



export const DatePickerElement = () => {
  const [value, setValue] = React.useState()
  return (
    <DatePicker required={false} onChange={e => setValue(e)} value={value} {...defaultProps} />
  )
};


export const InputElement = () => {
  const [value, setValue] = React.useState()
  return (
    <Input required={false} onChange={e => setValue(e.target.value)}  value={value} {...defaultProps} />
  )
};

export const InputDisabledElement = () => {
  const [value, setValue] = React.useState()
  return (
    <Input disabled={true} onChange={e => setValue(e.target.value)}  value={value} {...defaultProps} />
  )
};

export const InputErrorElement = () => {
  const [value, setValue] = React.useState()
  return (
    <React.Fragment>
      <Input required={false} onChange={e => setValue(e.target.value)}  value={value} error={true} {...defaultProps} />
      <InputError message={"Label is required"} />
    </React.Fragment>
  )
};


