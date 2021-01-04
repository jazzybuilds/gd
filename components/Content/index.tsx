import React from 'react'

const Styles = {
  SkipLink: "{590736D8-A121-436C-B033-53288E07DCF3}",
}

export const Content = (props) => {
  const { renderingContext } = props

  if (!renderingContext.item || !renderingContext.item.fields) {
    console.error("No item supplied for Content")
    return null
  }

  const { item: { fields }, parameters } = renderingContext
  const skipLink = parameters?.Styles === Styles.SkipLink;

  return (
    <div className={`component rich-text small-12 columns ${skipLink ? "c-header__skiplinks" : ""}`}>
      <div className="component-content" dangerouslySetInnerHTML={{ __html: fields.text }} />
    </div>
  )
}