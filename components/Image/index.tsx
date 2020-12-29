import React from 'react'

export const Image = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields || !renderingContext.item.fields.image) {
    return null
  }

  const { item: {id, fields: { imagecaption, image }}} = renderingContext

  return (
    <div className="component c-imagePod file-type-icon-media-link small-12 columns">
      <div className="component-content">
        <div className="c-imagePod__image">
          <img src={`${image.url}?h=${image.height}&amp;w=${image.width}&amp;`} alt={image.alt} width={image.width} height={image.height} data-variantitemid={id} data-variantfieldname="Image" title={image.alt} />
        </div>
        {imagecaption &&
          <div className="c-imagePod__content">
            <p className="c-imagePod__caption field-imagecaption" dangerouslySetInnerHTML={{ __html: imagecaption }}/>
          </div>
        }
      </div>
    </div>
  )
}