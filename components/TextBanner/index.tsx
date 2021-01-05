import React from 'react'
import "../../styles/component-promo-pod.scss";

const Styles = {
  BlueBackground: "{F3715535-4F33-4543-8217-4B17B810ECD1}",
  BlueNoCTABackground: "{462ECBEC-C6C3-410C-98D5-4632822D72BE}",
}

export const TextBanner = (props) => {
  const {renderingContext} = props

  if (!renderingContext.item || !renderingContext.item.fields) {
    console.error("No item supplied for TextBanner")
    return null
  }

  const {  item: { id, fields }, parameters } = renderingContext

  const blueBg = parameters?.Styles === Styles.BlueBackground;
  const blueNoCTA = parameters?.Styles === Styles.BlueNoCTABackground;

  let className = 'c-promoPod--blue'

  if (blueNoCTA) {
    className += ' c-promoPod--noCTA'
  }

  return (
    <div className={`component c-promoPod ${blueBg || blueNoCTA ? className : ""} small-12 columns`}>
      <div className="component-content">
        <div className="c-promoPod__wrapper">
          <p className="c-promoPod__text field-text" dangerouslySetInnerHTML={{ __html: fields.text }} />
          <p className="c-promoPod__link field-link">
            {fields.link &&
              <a href={fields.link.url} data-variantitemid={`{${id}}`} role="button" data-variantfieldname="Link" target={fields.link.target}>{fields.link.text}</a>
            }
          </p>
        </div>
      </div>
    </div>
  )
}