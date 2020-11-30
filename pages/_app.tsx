import Head from 'next/head'
import "../styles/core.scss"

export default function App({ Component, pageProps }) {
  return (
    <>
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
        <link rel="preload" href="/fonts/castledown/castledown-bold.woff2" as="font" type="font/woff2" />
        <link rel="preload" href="/fonts/castledown/castledown-heavy.woff2" as="font" type="font/woff2" />
        <link href="/main.css" rel="stylesheet" />
        {/* @ts-ignore */}
      </Head>
      <Component {...pageProps} />
    </>
  )
}