import React from 'react'
import { Root, Text, Button } from './Banner.styles'

export type BannerType = 'full' | 'cancel' | 'own_place'
interface BannerProps {
  type: BannerType
  text: string
  link?: {
    url: string
    text: string
    target: string
  }
}
export const Banner = (props: BannerProps) => {
  return (
    <Root>
      <Text>{props.text}</Text>
      {props.link &&
        <Button type={props.type} href={props.link.url} target={props.link.target}>{props.link.text}</Button>
      }
    </Root>

  )
}