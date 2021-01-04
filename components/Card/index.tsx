import React from 'react'
import { Root, Wrapper, Content, Text, ImageWrapper, Image, Link } from "./Card.styles"

const ManualNavigationPodVariants = {
  Default: "{D288AE53-0DFF-418F-9773-52A51A40B582}",
  NoImage: "{83D702CA-4797-4B98-9C9A-E861370CE490}",
  Large: "{0199A687-14BF-4599-A99A-6A97576E18D8}"
}

const ManualNavigationPodStyles = {
  MakeEqualHeight: "{3182392E-93CD-425C-8778-611B677FA58A}",
  LightBlue: "{76720053-27F8-4CCF-8652-69A6A91FA586}",
  DarkBlue: "{0D887421-9606-4A99-8B97-D20C79EAE2C0}",
}

export const Card = (props: any) => {
  const { renderingContext } = props

  if (!renderingContext.item || !renderingContext.item.fields) {
    console.error("No item supplied for Card")
    return null
  }

  const { item: { id, name, fields }, parameters } = renderingContext

  const isLarge = parameters?.FieldNames === ManualNavigationPodVariants.Large;
  const noImage = parameters?.FieldNames === ManualNavigationPodVariants.NoImage;
  const jsClass = parameters?.Styles === ManualNavigationPodStyles.MakeEqualHeight;
  const lightBlueBg = parameters?.Styles === ManualNavigationPodStyles.LightBlue;
  const darkBlueBg = parameters?.Styles === ManualNavigationPodStyles.DarkBlue;

  let bgClass = "row-bg "

  if (lightBlueBg) {
    bgClass += "row-bg--blue"
  }

  if (darkBlueBg) {
    bgClass += "row-bg--darkBlue"
  }

  let formattedUrl = fields.link?.url.split("/") ?? []
  if (formattedUrl.length > 0) {
    formattedUrl = formattedUrl[formattedUrl.length - 1].replace(/-/g, " ")
  } else {
    formattedUrl = ""
  }

  return (
    <Root className={`component c-navigationPod c-navigationPod--manual small-12 columns ${lightBlueBg || darkBlueBg ? bgClass : ""} ${jsClass ? "js-equalHeight" : ""}`}>
      <div className="component-content">
        <Wrapper className="c-navigationPod__wrapper">
          {!noImage && fields['pod image'] &&
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
            {isLarge && fields['cta link'] &&
              <div className="c-navigationPod__cta field-cta-link">
                <a href={`${fields['cta link'].url}/${fields['cta link'].url.includes('sponsor-a-puppy-today') ? `?puppy_selected=${name.replace(" ", "_").toLowerCase()}${fields['cta link'].anchor}` : ""}`} data-variantitemid={`{${id.toUpperCase()}}`} data-variantfieldname="CTA link">{fields['cta link'].text}</a>
              </div>
            }
          </Content>
        </Wrapper>
      </div>
    </Root>
  )
}