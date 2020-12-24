import React from 'react'
import { Root, Wrapper } from './CardBanner.styles'
import "../../styles/component-image-spotlight.scss";

export const CardBanner = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { item: { id, fields } } = renderingContext

  const datsource = renderingContext.page.renderings.find(rendering => rendering.settings.DataSource.includes(id.toUpperCase()))

  const lightBlueBg = datsource?.settings.Parameters.includes('76720053-27F8-4CCF-8652-69A6A91FA586')
  const darkBlueBg = datsource?.settings.Parameters.includes('0D887421-9606-4A99-8B97-D20C79EAE2C0')

  let bgClass = "row-bg "

  if (lightBlueBg) {
    bgClass += "row-bg--blue"
  }

  if (darkBlueBg) {
    bgClass += "row-bg--darkBlue"
  }

  return (
    <Root className={`component small-12 columns ${lightBlueBg || darkBlueBg ? bgClass : ""}`}>
      <div className="component-content">
        <Wrapper className="c-imageSpotlight__wrapper">
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
            <p />
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