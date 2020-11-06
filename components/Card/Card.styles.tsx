import styled from 'styled-components'

export const Root = styled.div`
  width:100%;
  margin: .75rem auto;
  padding: 0;
  @media (min-width: 40em) {
    margin: 1rem auto;
  }
  @media (min-width: 60em) {
    margin: 1.5rem auto;
  }

`;

export const Wrapper = styled.div`
  background: white;
  margin: 0;
  padding: 0;
  min-height: 6.25rem;
  -webkit-transition: min-height .25s ease-in-out;
  transition: min-height .25s ease-in-out;
  word-wrap: break-word;
  overflow-wrap: break-word;
  border-radius: .5rem;
  overflow: hidden;
  border: 2px solid #ebebeb;
`;

export const Content = styled.div`
  padding: 1.5rem;
  @media (min-width: 60em) {
    padding: 2rem;
  }
`

export const Text = styled.p`
  margin: 1rem 0 0 0;
  display: block;
`

export const ImageWrapper = styled.div`
  padding-bottom: 56.25%;
  overflow: hidden;
  display: block;
  height: 0;
  position: relative;
`

export const Image = styled.img`
  height: 100%;
  width: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  font-family: 'object-fit:  cover;';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`