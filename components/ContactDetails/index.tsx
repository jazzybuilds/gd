import React from 'react'
import "../../styles/component-getintouch.scss";

export const ContactDetails = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { id, item: { fields } } = renderingContext

  return (
    <div className="component c-getInTouch small-12 columns">
      <div className="component-content">
        <div className="c-getInTouch__wrapper">
          <h3 className="c-getInTouch__title field-getintouchtitle" dangerouslySetInnerHTML={{ __html: fields.getintouchtitle }} />
          <div className="c-getInTouch__summary field-getintouchcopy" dangerouslySetInnerHTML={{ __html: fields.getintouchcopy }} />
          {fields.getintouchemaillink &&
            <p className="c-getInTouch__email field-getintouchemaillink">
              <a href={fields.getintouchemaillink.url} data-variantitemid={`{${id}}`} data-variantfieldname="GetInTouchEmailLink">{fields.getintouchemaillink.text}</a>
            </p>
          }

          {fields.getintouchtelephonetext && !fields.getintouchtelephonetext.includes("&lt;") &&
            <p className="c-getInTouch__telephone field-getintouchtelephonetext" data-rel="external">
              <a title="fundraising getintouch" href={`tel:${fields.getintouchtelephonetext}`}>{fields.getintouchtelephonetext}</a>
            </p>
          }
        </div>
      </div>
    </div>
  )
}