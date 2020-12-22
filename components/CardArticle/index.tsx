import React from 'react'
import "../../styles/component-case-study.scss";

export const CardArticle = (props) => {
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
    <div className={`component c-caseStudy small-12 columns ${lightBlueBg || darkBlueBg ? bgClass : ""}`}>
      <div className="component-content">
        <div className="c-caseStudy__wrapper">
          <div className="c-caseStudy__image">
            {fields.image &&
              <img src={`${fields.image.url}?h=${fields.image.height}&amp;w=${fields.image.width}&amp;hash=6940A9C3A97A0F58BB776EAB35A8B2E9`} alt={fields.image.alt} width={fields.image.width} height={fields.image.height} data-variantitemid={`{${id}}`} data-variantfieldname="Image" />
            }
          </div>
          <div className="c-caseStudy__content">
            <h3 className="c-caseStudy__title field-title" dangerouslySetInnerHTML={{ __html: fields.title }} />
            <div className="c-caseStudy__summary field-summary" dangerouslySetInnerHTML={{ __html: fields.summary }} />
            <p />
            {fields.link &&
              <p className="c-caseStudy__link field-link">
                <a href={fields.link.url} data-variantitemid={`{${id}}`} role="button" data-variantfieldname="Link" target={fields.link.target}>{fields.link.text}</a>
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}