import { format, parse } from 'date-fns';
import React from 'react'
import AddToCalendar from '@culturehq/add-to-calendar';
import { FormStorageNames } from '../../../utils/constants';
import { ListText, Calendar, SummaryText, Root } from './ThankYou.styles';

interface UserProps {
  firstname: string
  lastname: string
  email: string
  reference: string
}

interface EventProps {
  title: string
  description: string
  location: string
  challenge: string
  date: string
  time: string
}

const ThankYou = (props) => {
  const [user, setUser] = React.useState<UserProps | null>(null)
  const [event, setEvent] = React.useState<EventProps | null>(null)
  const { item: { fields } } = props.renderingContext

  React.useEffect(() => {
    const redirectFunc = () => {
      if (fields["fallback url"]) {
        window.location.href = fields["fallback url"]
      } else {
        const paths = window.location.pathname.split("/").filter(path => path)
        paths.pop()
        window.location.replace(`${window.location.origin}/${paths.join("/")}/`)
      }
    }

    if (fields["event page"]) {
      const storageData = JSON.parse(sessionStorage.getItem(fields["event page"]["id"]))
      if (!storageData) {
        redirectFunc()
      } else {
        setUser({
          firstname: storageData[FormStorageNames.Firstname],
          lastname: storageData[FormStorageNames.Lastname],
          email: storageData[FormStorageNames.Email],
          reference: storageData[FormStorageNames.PaymentReference]
        })

        // TODO - pass dates around consistently as ISO timestamps
        const eventDate = fields["event page"]["event date"]
        const formatStr = eventDate && eventDate.indexOf('/') > -1 ? "MM/dd/yyyy h:mm:ss a" : "yyyy-MM-dd h:mm:ss a"
        const parsedDate = eventDate ? parse(eventDate, formatStr, new Date()) : null
        setEvent({
          title: fields["calendar title"],
          description: "",
          location: fields["event page"]["location"],
          challenge: storageData[FormStorageNames.Challenge],
          date: parsedDate ? format(parsedDate, "dd/MM/yyyy") : "",
          time: parsedDate ? format(parsedDate, "h:mm a") : ""
        })
      }
    } else {
      redirectFunc()
    }
  }, [])

  if (!fields || !fields["event page"]) {
    console.log("No event data supplied")
    return null
  }

  if (!user || !event) {
    return (<p>Loading</p>)
  }

  let startsAt = new Date()
  let endsAt = new Date()

  if (event.date) {
    // TODO - pass dates around consistently as ISO timestamps
    const formatStr = event.date && event.date.indexOf('/') > -1 ? "dd/MM/yyyy h:mm a" : "yyyy-MM-dd h:mm:ss a"
    startsAt = parse(`${event.date} ${event.time}`, formatStr, new Date())
    endsAt = parse(`${event.date} ${event.time}`, formatStr, new Date())
  }

  const startsAtStr = format(startsAt, "yyyy-MM-dd'T'HH:mm")
  const endsAtStr = format(endsAt, "yyyy-MM-dd'T'HH:mm")

  return (
    <Root className="component">
      <p>{fields["confirmation text"]}</p>
      <h2>{fields["title"]}</h2>

      <SummaryText dangerouslySetInnerHTML={{ __html: fields["summary"].replace("#EMAIL#", user.email) }} />

      <div>
        <ListText>Name: {user.firstname} {user.lastname}</ListText>
        
        {event.challenge && <ListText>Challenge: {event.challenge}</ListText>}
        {event.location && !event.challenge && <ListText>Where: {event.location}</ListText>}
        
        {event.date && <ListText>Date: {event.date}</ListText>}
        {event.time && <ListText gutter={true}>Time: {event.time}</ListText>}

        {user.reference &&
          <ListText>Payment reference: {user.reference}</ListText>
        }
      </div>
      {event.date && event.date &&
        <Calendar>
          <AddToCalendar
            children="Add to my calendar"
            event={{
              name: event.title,
              details: "",
              location: event.location,
              startsAt: startsAtStr,
              endsAt: endsAtStr,
            }}
          />
        </Calendar>
      }

    </Root>
  )
}

export default ThankYou