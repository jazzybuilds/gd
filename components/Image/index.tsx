import React from 'react'

export const Image = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields || !renderingContext.item.fields.image) {
    return null
  }

  const { id, item: { fields: { imagecaption, image }}} = renderingContext

  return (
    <div className="component c-imagePod file-type-icon-media-link small-12 columns">
      <div className="component-content">
        <div className="c-imagePod__image">
          <img src={`${image.url}?h=${image.height}&amp;w=${image.width}&amp;hash=DC97BC1BDB5F605CB115D440DF79D79F`} alt={image.alt} width={image.width} height={image.height} data-variantitemid={id} data-variantfieldname="Image" title={image.alt} />
        </div>
        <div className="c-imagePod__content">
          <p className="c-imagePod__caption field-imagecaption" dangerouslySetInnerHTML={{ __html: imagecaption }}/>
        </div>
      </div>
    </div>
  )
}