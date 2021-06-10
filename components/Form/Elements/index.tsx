import React from 'react'
import { StyledCheckbox, StyledDropdown, StyledDropdownGroup, StyledError, StyledInput, StyledLabel, StyledRadio, StyledTextArea } from '../Form.styles'

import range from 'ramda/src/range'

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
  'aria-label'?:string
  'aria-describedby'?:string
  onChange: (e: any) => void
  onBlur: (e: any) => void
}

export const Label = (props: {gutter?: boolean, required?: boolean, name: string, label: string, disabled?:boolean }) => (
  <StyledLabel gutter={props.gutter} disabled={props.disabled} htmlFor={props.name}>{props.label}{props.required ? "*" : ""}</StyledLabel>
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

export const DatePickerFallback = ({ label, required, ...props }) => {

  const now = new Date()
  let value: Date = props.value ? new Date(props.value) : now

  const defaultMinDate = new Date();
  defaultMinDate.setFullYear(defaultMinDate.getFullYear() - 120)

  const defaultMaxDate = new Date();
  defaultMaxDate.setFullYear(defaultMaxDate.getFullYear() + 51)

  let minDate: Date = props.min ? new Date(props.min) : defaultMinDate;
  let maxDate: Date = props.max ? new Date(props.max) : now;

  const populateDays = (monthIndex) => {
    // Create variable to hold new number of days to inject
    let days;
    // 31 or 30 days?
    if(months[monthIndex] === 'January' || months[monthIndex] === 'March' || months[monthIndex] === 'May' || months[monthIndex] === 'July' || months[monthIndex] === 'August' || months[monthIndex] === 'October' || months[monthIndex] === 'December') {
      days = 31;
    } else if(months[monthIndex] === 'April' || months[monthIndex] === 'June' || months[monthIndex] === 'September' || months[monthIndex] === 'November') {
      days = 30;
    } else {
    // If month is February, calculate whether it is a leap year or not
    const isLeap = new Date(selectedYear, 1, 29).getMonth() === 1;
    isLeap ? days = 29 : days = 28;
    }
    return range(1, days + 1).map( d => ({value:d, label:d}));
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const monthOptions = months.map((m, i) => ({value:i, label:m}));
  const yearOptions = range(minDate.getFullYear(), maxDate.getFullYear()+1).map( y => ({value:y, label:y}))

  const day = value.getDate()
  const month = value.getMonth()
  const year = value.getFullYear()

  const [selectedDay, setSelectedDay] = React.useState<number>(day)
  const [selectedMonth, setSelectedMonth] = React.useState<number>(month)
  const [selectedYear, setSelectedYear] = React.useState<number>(year)
  const [dayOptions, setDayOptions] = React.useState(populateDays(month))

  React.useEffect(() => {
    const dayOptions = populateDays(selectedMonth)
    setDayOptions(dayOptions)
    // check is selectedDay is outside max day range of selectedMonth
    // if so, adjust down to nearest valid date
    const numOfDays = dayOptions.length;
    if(selectedDay && selectedDay > numOfDays) {
      setSelectedDay(numOfDays)
    }
  }, [selectedMonth, selectedYear])

  React.useEffect(() => {
    const monthIndex:number = selectedMonth+1
    const dateString = `${selectedYear}-${String(monthIndex).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    props.onChange(dateString)
  }, [selectedDay, selectedMonth, selectedYear])

  return (
    <React.Fragment>
        <div>
          <Label name={props.name} label={label} required={required} />
          <StyledDropdownGroup>
            <span>
              <DropDown options={dayOptions} label='Day' aria-label={`${label} Day`} value={selectedDay} onChange={e => {setSelectedDay(parseInt( e.target.value, 10 ))}} {...props.fieldProps} />
            </span>
            <span>
              <DropDown options={monthOptions} label='Month' aria-label={`${label} Month`} value={selectedMonth} onChange={e => {setSelectedMonth(parseInt( e.target.value, 10 ))}} {...props.fieldProps} />
            </span>
            <span>
              <DropDown options={yearOptions} label='Year' aria-label={`${label} Year`} value={selectedYear} onChange={e => {setSelectedYear(parseInt( e.target.value, 10 ))}} {...props.fieldProps} />
            </span>
          </StyledDropdownGroup>
        </div>
    </React.Fragment>
  )
}

interface DropDownProps extends FieldProps{
  rows?: number
  options: {value: string, label: string}[]
  addDefault?: boolean
}

export const DropDown = ({ label, options, addDefault, type, rows, required, error, ...props }: DropDownProps) => !props.disabled && (
  <React.Fragment>
    <Label name={props.name} label={label} required={required} />
    <StyledDropdown error={error} aria-label={props['aria-label']} className={props.className} id={props.name} name={props.name} {...props} size={rows}>
      {addDefault && <option value="" disabled={true}>Please select...</option>}
      {options.map(option => (
        <option key={option.value} value={option.value} >{option.label}</option>
      ))}
    </StyledDropdown>
  </React.Fragment>
)

export const Input = ({ required, helptext, type, error, label, ...props }: FieldProps) => {
  return !props.disabled && (
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

export const InputError = ({message, id }: {id: string, message: string}) => <StyledError id={id} className="field-validation-error">{message}</StyledError>