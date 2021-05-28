import React from 'react'
import { DatePickerImage, DatePickerRoot, StyledCheckbox, StyledDatePicker, StyledDropdown, StyledInput, StyledLabel, StyledRadio, StyledTextArea } from '../Form.styles'
import DatePickerComponent from "react-datepicker";

interface FieldProps {
  required?: boolean
  className?: string
  disabled?: boolean
  helptext?: string;
  type?: string
  value: any
  name: string
  error?: boolean
  label: string
  onChange: (e: any) => void
  onBlur: (e: any) => void
}

export const Label = (props: {gutter?: boolean, required?: boolean, name: string, label: string, disabled?:boolean, tabIndex?: number}) => (
  <StyledLabel gutter={props.gutter} tabIndex={props.tabIndex} disabled={props.disabled} htmlFor={props.name}>{props.label}{props.required ? "*" : ""}</StyledLabel>
)

export const Text = (props: {htmlElement: string}) => <div dangerouslySetInnerHTML={{ __html: props.htmlElement }} />

export const CheckBox = ({ label, ...props }) => {
  return (
    <StyledCheckbox htmlFor={props.id} disabled={props.disabled}>
      <input {...props}  type="checkbox" checked={props.selected} />
      <span>{label}{props.required? "*" : ""}</span>
    </StyledCheckbox>
  )
}

export const Radio = ({ label, ...props }) => {
  return (
    <StyledRadio htmlFor={props.id} disabled={props.disabled}>
      <input {...props} type="radio"  checked={props.selected} />
      <span>{label}{props.required? "*" : ""}</span>
    </StyledRadio>
  )
}

export const DatePicker = ({label, required, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  let value: string | Date = new Date(props.value || '')
  if (isNaN(value.getTime())) {
    value = null
  }

  return (
    <React.Fragment>
      <Label name={props.name} label={label} required={required} />
      <DatePickerRoot>
        <DatePickerComponent
          placeholderText="dd/mm/yyyy" 
          id={props.name}
          isClearable={false}
          disabled={props.disabled}
          onBlur={props.onBlur}
          showYearDropdown={true}
          showMonthDropdown={true}
          scrollableYearDropdown={true}
          yearDropdownItemNumber={50}
          onClickOutside={() => setIsOpen(false)}
          open={isOpen}
          customInput={<StyledDatePicker error={props.error}  onBlur={props.onBlur} />}
          dateFormat="dd/MM/yyyy"
          selected={value}
          onChange={date => { 
            if (!date || isNaN(date.getTime())) {
              return props.onChange(date)
            }
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const updatedValue = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
            props.onChange(updatedValue)
          }}
        />
        <DatePickerImage src="/images/calendar-blue.svg" alt="calendar icon" onClick={() => setIsOpen(!isOpen)} />
      </DatePickerRoot>
    </React.Fragment>
  )
}

interface DropDownProps extends FieldProps{
  rows?: number
  options: {value: string, label: string}[]
  addDefault?: boolean
}

export const DropDown = ({ label, options, addDefault, type, rows, required, error, ...props }: DropDownProps) => (
  <React.Fragment>
    <Label name={props.name} label={label} required={required} />
    <StyledDropdown error={error} className={props.className} id={props.name} name={props.name} {...props} size={rows}>
      {addDefault && <option value="" disabled={true}>Please select...</option>}
      {options.map(option => (
        <option key={option.value} value={option.value} >{option.label}</option>
      ))}
    </StyledDropdown>
  </React.Fragment>
)

export const Input = ({ required, helptext, type, error, label, ...props }: FieldProps) => {
  return (
    <React.Fragment>
      <Label disabled={props.disabled} name={props.name} label={label} required={required} />
      {(type === 'textarea')
        ? <StyledTextArea {...props} error={error} />
        : <StyledInput
          removeGutter={Boolean(helptext)}
          type={type}
          error={error}
          {...props}
        />
      }
      <span>{helptext}</span>
    </React.Fragment>
  )
}

export const InputError = ({message, id }: {id: string, message: string}) => <span id={id} className="field-validation-error">{message}</span>