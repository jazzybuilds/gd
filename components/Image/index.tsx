import React from 'react'

export const Image = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields || !renderingContext.item.fields.image) {
    return null
  }

  const { id, item: { fields: { image }}} = renderingContext

  return (
    <div className="component c-imagePod file-type-icon-media-link small-12 columns">
      <div className="component-content">
        <div className="c-imagePod__image">
          <img src={`${image.url}?h=${image.height}&amp;w=${image.width}&amp;hash=DC97BC1BDB5F605CB115D440DF79D79F`} alt={image.alt} width={image.width} height={image.height} data-variantitemid={id} data-variantfieldname="Image" title={image.alt} />
        </div>
      </div>
    </div>
  )
}