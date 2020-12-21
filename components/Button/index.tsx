import React from 'react'

export const Button = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields || !renderingContext.item.fields.link) {
    return null
  }
  const {  item: { id, fields: { link } } } = renderingContext
  const datsource = renderingContext.page.renderings.find(rendering => rendering.settings.DataSource.includes(id.toUpperCase()))
  const isLarge = datsource?.settings.Parameters.includes('69244147-9040-432C-A6AC-16BAE4863271')
  const isMedium = datsource?.settings.Parameters.includes('859E750E-BF54-4DA2-8DD4-9786565E3640')
  const isSmall = datsource?.settings.Parameters.includes('19AE9B21-88B6-4D17-82B1-CA605DB70EA7')

  let buttonClass = "cta-plain"

  if (isLarge) {
    buttonClass = "cta-large"
  }


  if (isMedium) {
    buttonClass = "cta-medium"
  }

  if (isSmall) {
    buttonClass = "cta-small"
  }

  return (
    <div className="component c-ctaButton ctaWrapper columns c-header__cta">
      <div className="component-content">
        <div className="field-link">
          <a href={link.url} data-variantitemid={`{${id}}`} className={buttonClass} role="button" data-variantfieldname="Link" target={link.target}>{link.text}</a>
        </div>
      </div>
    </div>
  )
}