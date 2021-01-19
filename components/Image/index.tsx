import React from 'react'

interface ImageProps {
  src: string
  width: string
  height: string
  "data-variantitemid": string
  "data-variantfieldname": string
  alt?: string
  title?: string
}

export const Image = (props) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields || !renderingContext.item.fields.image) {
    return null
  }

  const { item: {id, fields: { imagecaption, image }}} = renderingContext

  let imageAttr: ImageProps = {
    src: `${image.url}?h=${image.height}&amp;w=${image.width}&amp;`,
    width: image.width,
    height: image.height,
    "data-variantitemid": id,
    "data-variantfieldname": "Image",
  }

  if (image.alt) {
    imageAttr = {
      ...imageAttr,
      alt: image.alt,
      title: image.alt,
    }
  }

  return (
    <div className="component c-imagePod file-type-icon-media-link small-12 columns">
      <div className="component-content">
        <div className="c-imagePod__image">
          <img {...imageAttr} />
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