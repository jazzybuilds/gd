import { format } from 'date-fns';
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
  const { page: { fields: { title: pageTitle, eventDetails } }, item: { fields } } = props.renderingContext
  console.log({ eventDetails: props.renderingContext })

  React.useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem(pageTitle))

    if (!storageData) {
      if (fields["fallback url"]) {
        window.location.href = fields["fallback url"]
      } else {
        const paths = window.location.pathname.split("/").filter(path => path)
        paths.pop()
        window.location.replace(`${window.location.origin}/${paths.join("/")}/`)
      }
    } else {
      setUser({
        firstname: storageData[FormStorageNames.Firstname],
        lastname: storageData[FormStorageNames.Lastname],
        email: storageData[FormStorageNames.Email],
        reference: storageData[FormStorageNames.PaymentReference]
      })

      setEvent({
        title: fields["calendar title"],
        description: "",
        location: eventDetails["location"],
        date: format(new Date(eventDetails["date"]), "dd/MM/yyyy"),
        time: format(new Date(eventDetails["date"]), "h:mmaaaaa'm'").toUpperCase()
      })
    }

  }, [])

  if (!eventDetails || !fields || !fields.event) {
    console.log("No event data supplied")
    return null
  }

  if (!user) {
    return (<p>Loading</p>)
  }

  return (
    <React.Fragment>
      <p>{fields["confirmation text"]}</p>
      <h2>{fields["title"]}</h2>

      <SummaryText dangerouslySetInnerHTML={{ __html: fields["share summary"].replace("#EMAIL#", user.email) }} />

      <div>
        <ListText>Name: {user.firstname} {user.lastname}</ListText>
        <ListText>Where: {event.location}</ListText>
        <ListText>Date: {event.date}</ListText>
        <ListText gutter={true}>Time: {event.time}</ListText>

        {user.reference &&
          <ListText>Payment reference: {user.reference}</ListText>
        }
      </div>
      <Calendar>
        <AddToCalendar
          event={{
            title: event.title,
            location: event.location,
            startTime: eventDetails["date"],
            endTime: eventDetails["date"]
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
    </React.Fragment>
  )
}

export default ThankYou