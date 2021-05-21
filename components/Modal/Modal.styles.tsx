import styled from 'styled-components'

export const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 100%;
  height: 100vh;
  
  z-index: 10000000;
`;

export const Wrapper = styled.div`
  margin: 20px auto;
  background: ${props => props.theme.colors.white};
  width: 600px;
  height: 600px
`