import React from 'react'
import { Root, Wrapper, Content, Text, ImageWrapper, Image, Link } from "./Card.styles"

export const Card = (props: any) => {
  const { renderingContext } = props
  if (!renderingContext.item || !renderingContext.item.fields) {
    return null
  }

  const { id, item: { fields } } = renderingContext

  return (
    <Root className="small-12 columns js-equalHeight"  >
      <div className="component-content">
        <Wrapper className="c-navigationPod__wrapper">
          {fields['pod image'] &&
            <ImageWrapper >
              <Image src={fields['pod image'].url} alt={fields['pod image'].alt} />
            </ImageWrapper>
          }
          <Content>
            {fields.link &&
              <div className=" field-link">
                <Link href={fields.link.url} data-variantitemid={`{${id}}`} data-variantfieldname="Link">{fields.link.text}</Link>
              </div>
            }
            ????<Text className="field-pod-text" dangerouslySetInnerHTML={{ __html: fields['pod text'] }} />
          </Content>
        </Wrapper>
      </div>
    </Root>
  )
}