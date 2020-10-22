import React from 'react'

export const BlockQuote = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }
  const {  item: { fields } } = renderingContext

  return (
    <div className="component c-quote small-12 columns">
      <div className="component-content">
        <figure className="c-quote__wrapper">
          <blockquote className="c-quote__text field-quote-text" dangerouslySetInnerHTML={{__html: fields['quote text']}}>
            </blockquote>
          <figcaption className="c-quote__author field-author" dangerouslySetInnerHTML={{__html: fields.author}}></figcaption>
        </figure>
      </div>
    </div>
  )
}