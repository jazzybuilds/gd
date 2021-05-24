import styled from 'styled-components'
import { typography } from '../../../theme'

export const ListText = styled.h4<{gutter: boolean}>`
  ${typography.h4}
  margin: ${props => props.gutter? '0 0 30px': 0};
`

export const SummaryText = styled.div`
  margin-bottom: 26px;
`

export const Calendar = styled.div<{open: boolean}>`
  margin: 2rem 0;

  svg {
    display: none;
  }

  .chq-atc--button {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    font-size: 18px;
    padding: 1rem 3rem 1rem 1.5rem;
    border-radius: 2rem;
    display: inline-block;
    text-decoration: none;
    text-align: center;
    width: 100%;
    position: relative;
    
    ${props => props.theme.breakpoints.sm} {
      width: auto;
    }

    &::before {
      content: "";
      position: absolute;
      width: 16px;
      height: 15px;
      top: 20px;
      right: 20px;
      background-size: 16px;
      background-repeat: no-repeat;
      background-image: url(/images/arrow-down-white.svg);
    }

    
  }
  
  .chq-atc--dropdown {
    a {
      display: block;
      margin: 8px 0;
      text-decoration: none;
      
      &:hover {
        
        text-decoration: none;
        color: inherit
      }
    }
  }
  
  
  

`
