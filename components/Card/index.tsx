import React from 'react'

export const Card = (props: any) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { id, item: { fields } } = renderingContext

  return (
    <div className="component c-navigationPod c-navigationPod--manual small-12 columns js-equalHeight"  >
      <div className="component-content">
        <div className="c-navigationPod__wrapper" style={{background: 'red'}}>
          {fields['pod image'] &&
            <div className="c-navigationPod__image">
              <img src={fields['pod image'].url} alt={fields['pod image'].alt} />
            </div>
          }
          <div className="c-navigationPod__content">
            {fields.link &&
              <div className="c-navigationPod__link field-link">
                <a href={fields.link.url} data-variantitemid={`{${id}}`} data-variantfieldname="Link">{fields.link.text}</a>
              </div>
            }
            <p className="c-navigationPod__text field-pod-text" dangerouslySetInnerHTML={{ __html: fields['pod text'] }} />
          </div>
        </div>
      </div>
    </div>
  )
}