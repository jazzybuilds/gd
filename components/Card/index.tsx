import React from 'react'
import { Root, Wrapper, Content, Text, ImageWrapper, Image, Link } from "./Card.styles"

export const Card = (props: any) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { item: { id, name, fields } } = renderingContext

  const datsource = renderingContext.page.renderings.find(rendering => rendering.settings.DataSource.includes(id.toUpperCase()))
  const isLarge = datsource?.settings.Parameters.includes('0199A687-14BF-4599-A99A-6A97576E18D8')

  let formattedUrl = fields.link?.url.split("/") ?? []
  formattedUrl = formattedUrl[formattedUrl.length -1].replace(/-/g, " ")

  return (
    <Root className="c-navigationPod c-navigationPod--manual small-12 columns js-equalHeight">
      <div className="component-content">
        <Wrapper className="c-navigationPod__wrapper">
          {fields['pod image'] &&
            <ImageWrapper isLarge={isLarge}>
              <Image src={fields['pod image'].url} alt={fields['pod image'].alt} />
            </ImageWrapper>
          }
          <Content>
            {fields.link &&
              <div className=" field-link">
                <Link href={fields.link.url} data-variantitemid={`{${id}}`} data-variantfieldname="Link">{fields.link.text || formattedUrl}</Link>
              </div>
            }
            <Text className="field-pod-text" dangerouslySetInnerHTML={{ __html: fields['pod text'] }} />
            {fields['cta link'] &&
              <div className="c-navigationPod__cta field-cta-link">
                <a href={`${fields['cta link'].url}/?puppy_selected=${name.replace(" ", "_").toLowerCase()}${fields['cta link'].anchor}`} data-variantitemid={`{${id.toUpperCase()}}`} data-variantfieldname="CTA link">{fields['cta link'].text}</a>
              </div>
            }
          </Content>
        </Wrapper>
      </div>
    </Root>
  )
}