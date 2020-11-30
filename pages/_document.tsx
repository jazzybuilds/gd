import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from 'styled-components'

//import CustomHead from '../components/CustomHead';

// When Sitecore solution does not have personalization rules and when it does not require SPA-navigation
// it makes sense to disable all nextjs scripts to minimize javascript bundle and fit performance budget.

// CustomDocument replaces stock.js Document component to replace stock Head component
const sheet = new ServerStyleSheet()

export default class CustomDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );

    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* @ts-ignore */}
          {this.props.styleTags}
        </Head>
        <body className="default-device">
          <Main />
          <NextScript />
          <script src="/-/media/Base-Themes/Core-Libraries/scripts/optimized-min.js?t=20190703T145418Z"></script>
          <script src="/-/media/Base-Themes/XA-API/Scripts/optimized-min.js?t=20190703T145419Z"></script>
          <script src="/-/media/Base-Themes/Main-Theme/scripts/optimized-min.js?t=20190703T145420Z"></script>
          <script src="/-/media/Base-Themes/Google-Maps-JS-Connector/Scripts/optimized-min.js?t=20190703T145421Z"></script>
          <script src="/-/media/Base-Themes/Maps/Scripts/optimized-min.js?t=20190703T145421Z"></script>
          <script src="/-/media/Base-Themes/SearchTheme/Scripts/optimized-min.js?t=20190703T145422Z"></script>
          <script src="/-/media/Base-Themes/Components-Theme/Scripts/optimized-min.js?t=20200422T100700Z"></script>
          <script src="/-/media/Base-Themes/Resolve-Conflicts/Scripts/optimized-min.js?t=20190703T145423Z"></script>
          <script src="/-/media/Themes/GuideDogs/GuideDogsDotOrg/GuideDogsTheme/scripts/optimized-min.js"></script> 
          <script src="/scripts.js"></script>
        </body>
      </Html>
    );
  }
}
