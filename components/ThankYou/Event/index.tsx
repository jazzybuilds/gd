import { format, parse } from 'date-fns';
import React from 'react'
import AddToCalendar from 'react-add-to-calendar';
import { FormStorageNames } from '../../../utils/constants';
import { ListText, Calendar, SummaryText } from './ThankYou.styles';

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
      const storageData = JSON.parse(localStorage.getItem(fields["event page"]["id"]))
      if (!storageData) {
        redirectFunc()
      } else {
        setUser({
          firstname: storageData[FormStorageNames.Firstname],
          lastname: storageData[FormStorageNames.Lastname],
          email: storageData[FormStorageNames.Email],
          reference: storageData[FormStorageNames.PaymentReference]
        })

        const parsedDate = fields["event page"]["event date"] ? parse(fields["event page"]["event date"], "MM/dd/yyyy h:mm:ss a", new Date()) : null
        setEvent({
          title: fields["calendar title"],
          description: "",
          location: fields["event page"]["location"],
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

  return (
    <React.Fragment>
      <p>{fields["confirmation text"]}</p>
      <h2>{fields["title"]}</h2>

      <SummaryText dangerouslySetInnerHTML={{ __html: fields["summary"].replace("#EMAIL#", user.email) }} />

      <div>
        <ListText>Name: {user.firstname} {user.lastname}</ListText>
        {event.location && <ListText>Where: {event.location}</ListText>}
        {event.date && <ListText>Date: {event.date}</ListText>}
        {event.time && <ListText gutter={true}>Time: {event.time}</ListText>}

        {user.reference &&
          <ListText>Payment reference: {user.reference}</ListText>
        }
      </div>
      {event.date && event.date &&
        <Calendar>
          <AddToCalendar
            event={{
              title: event.title,
              location: event.location,
              startTime: parse(`${event.date} ${event.time}`, "dd/MM/yyyy h:mm a", new Date()),
              endTime: parse(`${event.date} ${event.time}`, "dd/MM/yyyy h:mm a", new Date()),
            }}
            buttonTemplate={{ textOnly: 'none' }}
            buttonLabel="Add to my calendar"
            listItems={[
              { outlook: 'Outlook' },
              { apple: 'Apple Calendar' },
              { google: 'Google' }
            ]}
          />
        </Calendar>
      }

    </React.Fragment>
  )
}

export default ThankYou