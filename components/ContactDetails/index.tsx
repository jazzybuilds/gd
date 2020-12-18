import React from 'react'
import "../../styles/component-getintouch.scss";

export const ContactDetails = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { item: {id, fields } } = renderingContext
  const datsource = renderingContext.page.renderings.find(rendering => rendering.settings.DataSource.includes(id.toUpperCase()))

  const all = datsource?.settings.Parameters.includes("55861F56-E0CD-43F3-96D9-574552AB7D10") 
  const emailOnly = datsource?.settings.Parameters.includes("04CF5404-EC1F-4421-9216-20C86A0AEABB") 
  const phoneOnly = datsource?.settings.Parameters.includes("FBBFC646-525D-4997-A37F-DD4262F5CB25") 

  return (
    <div className="component c-getInTouch small-12 columns">
      <div className="component-content">
        <div className="c-getInTouch__wrapper">
          <h3 className="c-getInTouch__title field-getintouchtitle" dangerouslySetInnerHTML={{ __html: fields.getintouchtitle }} />
          <div className="c-getInTouch__summary field-getintouchcopy" dangerouslySetInnerHTML={{ __html: fields.getintouchcopy }} />
          {fields.getintouchemaillink && (!phoneOnly || all) &&
            <p className="c-getInTouch__email field-getintouchemaillink">
              <a href={fields.getintouchemaillink.url} data-variantitemid={`{${id}}`} data-variantfieldname="GetInTouchEmailLink">{fields.getintouchemaillink.text}</a>
            </p>
          }

          {fields.getintouchtelephonetext && (!emailOnly || all) &&
            <p className="c-getInTouch__telephone field-getintouchtelephonetext" data-rel="external">
              <a title="fundraising getintouch" href={`tel:${fields.getintouchtelephonetext}`}>{fields.getintouchtelephonetext}</a>
            </p>
          }
        </div>
      </div>
    </div>
  )
}