import React from 'react'
import { Root, Wrapper } from './CardBanner.styles'

export const CardBanner = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { id, item: { fields } } = renderingContext

  return (
    <Root className="component small-12 columns">
      <div className="component-content">
        <Wrapper>
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
        </Wrapper>
      </div>
    </Root>
  )
}