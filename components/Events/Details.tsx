import React from 'react'
import { format } from 'date-fns'
import { Info, Price, Summary, Heading} from './Details.styles'
import { Banner } from './Banner'

const EventDetails = (props) => {
  const { item: { fields } } = props.renderingContext
  const { event } = fields

  if (!event) {
    console.error('No event data supplied')
    return null
  }

  const fee = Number(event["registration fee"])

  return (
    <React.Fragment>
      {event["capacity"] && <Banner type={event["capacity"]["title"]} text={event["capacity"]["summary"]} link={event["capacity"]["link"]} />}
      {!event["capacity"] && <Summary dangerouslySetInnerHTML={{__html: fields.summary }} />}
      <Heading>{fields.heading}</Heading>
      <Info>
        <span>{event["date label"] ?? "When:"} {format(new Date(event["date"]), 'iiii dd MMMM yyyy')}</span>
        <span>{event["location label"] ?? "Where:"} {event["location"]}</span>
      </Info>
      <Info withoutGutter={true}>{event["registration fee label"] ?? "Registration fee:"}</Info>
      <Price>{!fee ? 'FREE' : `£${fee}`}</Price>
      <Summary dangerouslySetInnerHTML={{__html: event["registration info"] }} />
    </React.Fragment>
  )
}

export default EventDetails