import styled from 'styled-components'

export const Root = styled.div`
  padding: 0;
  margin:1rem auto;
  margin-right:-16px;
  margin-left:-16px;
  width:-webkit-calc(100% + 32px);
  width:calc(100% + 32px);
  ${props => props.theme.breakpoints.sm} {
    width:100%;
    margin:1.5rem auto;
    margin-right:-24px;
    margin-left:-24px;
    width:-webkit-calc(100% + 48px);
    width:calc(100% + 48px);
  }
  ${props => props.theme.breakpoints.md} {
    width:100%;
    margin:2rem auto;
  }
`;

export const Wrapper = styled.div`
  padding:0;
  margin:0;
  background:#fff;
  display:-webkit-box;
  display:-ms-flexbox;
  display:flex;
  -webkit-box-orient:vertical;
  -webkit-box-direction:normal;
  -ms-flex-direction:column;
  flex-direction:column;
  -webkit-box-align:stretch;
  -ms-flex-align:stretch;
  align-items:stretch;
  display:inline-block;
  vertical-align:middle;
  margin-left:5px;
  ${props => props.theme.breakpoints.sm} {
    padding:0 .5rem;
  }
  ${props => props.theme.breakpoints.md} {
    padding:0;
    -webkit-box-orient:horizontal;
    -webkit-box-direction:normal;
    -ms-flex-direction:row;
    flex-direction:row;
    -webkit-box-align:center;
    -ms-flex-align:center;
    align-items:center;
    -webkit-box-pack:justify;
    -ms-flex-pack:justify;
    justify-content:space-between;
  }
`;
