import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
//import CustomHead from '../components/CustomHead';

// When Sitecore solution does not have personalization rules and when it does not require SPA-navigation
// it makes sense to disable all nextjs scripts to minimize javascript bundle and fit performance budget.

// CustomDocument replaces stock.js Document component to replace stock Head component
export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>
            Guide Dogs UK Charity For The Blind And Partially Sighted
          </title>
          <meta
            content="Guide Dogs: Providing mobility for the blind and partially sighted. Supporting research, raising awareness and campaigning for the visually impaired. We will not rest until people who are blind or partially sighted can enjoy the same freedom of movement as everyone else."
            name="description"
          />
          <meta
            content="Guide Dogs: Providing mobility for the blind and partially sighted. Supporting research, raising awareness and campaigning for the visually impaired"
            property="og:description"
          />
          <meta content="128733004236479" property="fb:app_id" />
          <meta content="website" property="og:type" />
          <meta content="Guide Dogs Site" property="og:site_name" />
          <meta
            content="https://www.guidedogs.org.uk:443/-/media/Project/GuideDogs/GuideDogsDotOrg/Images/opengraph/homepage/Black-labrador-looks-up-at-camera.jpg"
            property="og:image"
          />
          <meta content="Guide Dogs UK" property="og:title" />
          <meta content="https://www.guidedogs.org.uk/" property="og:url" />
          <link rel="preload" href="/fonts/castledown/castledown-bold.woff2" as="font" type="font/woff2"  />
          <link rel="preload" href="/fonts/castledown/castledown-heavy.woff2" as="font" type="font/woff2"  />
          <link href="/main.css" rel="stylesheet" />
        </Head>
        <body className="default-device">
          <Main />
          <NextScript />
          {/* <script src="/maps.js"></script> */}
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
