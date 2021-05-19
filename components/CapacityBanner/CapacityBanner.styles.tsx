import styled, { css } from 'styled-components'
import { typography } from '../../theme'

type BannerType = "cancel" | "full" | "own_place"

export const Root = styled.div`
  margin-bottom: 26px;
  background: ${props => props.theme.colors.primaryLight};
  padding: 16px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
`

export const Text = styled.p`
  ${typography.h3}
  margin: 0;
  max-width: 70%;
`

const ButtonArrowMixin = css`
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: center right 24px;
  background-image: url(/images/icon-arrow-white.svg);
  padding-right: 50px
`

export const Button = styled.a<{type: BannerType}>`
  text-decoration: none;
  border-radius: 100px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 10px 20px;
  &:hover {
    color: ${props => props.theme.colors.white};
  }
  ${props => ["full", "cancel"].includes(props.type) && ButtonArrowMixin}
`