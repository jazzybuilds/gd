import React from 'react'

export const Button = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields || !renderingContext.item.fields.link) {
    return null
  }
  const { id, item: { fields: { link } } } = renderingContext

  return (
    <div className="component c-ctaButton ctaWrapper columns c-header__cta">
      <div className="component-content">
        <div className="field-link">
          <a href={link.url} data-variantitemid={`{${id}}`} className="cta-plain" role="button" data-variantfieldname="Link" target={link.target}>{link.text}</a>
        </div>
      </div>
    </div>
  )
}