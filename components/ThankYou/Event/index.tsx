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
  date: Date
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

        let eventDate = fields["event page"]["event date"]
        // 'Own Events' challenge dates are not returned by backend
        // see if there's a date in sessionStorage as fallback
        // these dates don't have a time element
        if (!eventDate) {
          eventDate = storageData[FormStorageNames.DateOfChallenge]
        }
        console.log('------- eventDate ---------')
        console.log(eventDate)
        // TODO - pass dates around consistently as ISO timestamps
        const formatStr = eventDate && eventDate.indexOf('/') > -1 ? "MM/dd/yyyy h:mm:ss a" : "yyyy-MM-dd"
        const parsedDate = eventDate ? parse(eventDate, formatStr, new Date()) : null
        console.log('------- parsedDate ---------')
        console.log(parsedDate)
        setEvent({
          title: fields["calendar title"],
          description: "",
          location: fields["event page"]["location"],
          challenge: storageData[FormStorageNames.Challenge],
          date: parsedDate
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

  // @see useEffect() setEvent state
  const startsAtStr = event.date ? format(event.date, "yyyy-MM-dd'T'HH:mm") : ''
  const endsAtStr = event.date ? format(event.date, "yyyy-MM-dd'T'HH:mm") : ''

  const startsAtDateStr = event.date ? format(event.date, "dd/MM/yyyy") : ''
  const startsAtTimeStr = event.date ? format(event.date, "h:mm a") : ''

  return (
    <Root className="component">
      <p>{fields["confirmation text"]}</p>
      <h2>{fields["title"]}</h2>

      <SummaryText dangerouslySetInnerHTML={{ __html: fields["summary"].replace("#EMAIL#", user.email) }} />

      <div>
        <ListText>Name: {user.firstname} {user.lastname}</ListText>
        
        {event.challenge && <ListText>Challenge: {event.challenge}</ListText>}
        {event.location && !event.challenge && <ListText>Where: {event.location}</ListText>}
        
        {startsAtDateStr && <ListText>Date: {startsAtDateStr}</ListText>}
        {startsAtTimeStr && <ListText gutter={true}>Time: {startsAtTimeStr}</ListText>}

        {user.reference &&
          <ListText>Payment reference: {user.reference}</ListText>
        }
      </div>
      {startsAtStr && endsAtStr &&
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