import React from 'react'

export const Content = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const {  item: { id, fields } } = renderingContext

  const datsource = renderingContext.page.renderings.find(rendering => rendering.settings.DataSource.includes(id.toUpperCase()))
  const skipLink = datsource?.settings.Parameters.includes("590736D8-A121-436C-B033-53288E07DCF3") 

  return (
    <div className={`component rich-text small-12 columns ${skipLink ? "c-header__skiplinks" : ""}`}>
      <div className="component-content" dangerouslySetInnerHTML={{ __html: fields.text }} />
    </div>
  )
}