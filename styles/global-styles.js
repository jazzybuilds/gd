import { createGlobalStyle } from 'styled-components';

const fontURL = `${process.env.NEXT_PUBLIC_CDN_URL}-/media/themes/guidedogs/guidedogsdotorg/guidedogstheme/fonts/castledown`

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'castledown-heavy';
    src: url('${fontURL}/castledown-heavy-woff2.woff2') format('woff2'),
        url('${fontURL}/castledown-heavy-woff.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'castledown-bold';
    src: url('${fontURL}/castledown-bold-woff2.woff2') format('woff2'),
        url('${fontURL}/castledown-bold-woff.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'castledown-regular';
    src: url('${fontURL}/castledown-regular-woff2.woff2') format('woff2'),
        url('${fontURL}/castledown-regular-woff.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

`