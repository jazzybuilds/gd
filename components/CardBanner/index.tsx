import React from 'react'

export const CardBanner = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { id, item: { fields } } = renderingContext

  return (
    <div className="component c-imageSpotlight small-12 columns">
      <div className="component-content">
        <div className="c-imageSpotlight__wrapper">
          {fields.image &&
            <div className="c-imageSpotlight__image">
              <div className="ar-16-9">
                <img src={`${fields.image.url}?h=441&amp;w=784&amp;hash=B195B5C138CDD72ACAA9F22BF698AFC0`} alt={fields.image.alt} width="784" height="441" data-variantitemid={`{${id}}`} data-variantfieldname="Image" />
              </div>
            </div>
          }
          <div className="c-imageSpotlight__content">
            <h3 className="c-imageSpotlight__title field-title" dangerouslySetInnerHTML={{ __html: fields.title }} />
            <div dangerouslySetInnerHTML={{ __html: fields.summary }} />
            {fields.link &&
              <p className="c-imageSpotlight__link field-link">
                <a href={fields.link.url} data-variantitemid={`{${id}}`} role="button" data-variantfieldname="Link">{fields.link.text}</a>
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}