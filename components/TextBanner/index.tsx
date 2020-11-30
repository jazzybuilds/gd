import React from 'react'
import "../../styles/component-promo-pod.scss";

export const TextBanner = (props) => {
  const {renderingContext} = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { id, item: { fields } } = renderingContext

  return (
    <div className="component c-promoPod c-promoPod--blue small-12 columns">
      <div className="component-content">
        <div className="c-promoPod__wrapper">
          <p className="c-promoPod__text field-text" dangerouslySetInnerHTML={{ __html: fields.text }} />
          <p className="c-promoPod__link field-link">
            {fields.link &&
              <a href={fields.link.url} data-variantitemid={`{${id}}`} role="button" data-variantfieldname="Link">{fields.link.text}</a>
            }
          </p>
        </div>
      </div>
    </div>
  )
}