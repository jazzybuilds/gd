import React from 'react'

const JustGiving = (props) => {
  const { item: { fields } } = props.renderingContext
  
  if (!fields) {
    return null
  }

  return (
    <React.Fragment>
      <h2>{fields["title"]}</h2>
      <p>{fields["summary"]}</p>

      <a href={fields["link"]} target={fields["link"]["target"]}>
        <img src={fields["image"]["url"]} alt={fields["image"]["alt"]} />
      </a> 

    </React.Fragment>
  )
}

export default JustGiving