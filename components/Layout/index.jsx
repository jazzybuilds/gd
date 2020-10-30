import Head from "next/head";
import UniformPlaceholder from "../UniformPlaceholder";

const MVCLayout = (props) => {

  const { placeholderComponent } = props;

  return (
    <>
      <Head>
        <title>Guide Dogs UK Charity For The Blind And Partially Sighted</title>
        <meta content="Guide Dogs: Providing mobility for the blind and partially sighted. Supporting research, raising awareness and campaigning for the visually impaired. We will not rest until people who are blind or partially sighted can enjoy the same freedom of movement as everyone else." name="description"  />

        <meta content="Guide Dogs: Providing mobility for the blind and partially sighted. Supporting research, raising awareness and campaigning for the visually impaired"  property="og:description" />
        <meta content="128733004236479"  property="fb:app_id" />
        <meta content="website"  property="og:type" />
        <meta content="Guide Dogs Site"  property="og:site_name" />
        <meta content="https://www.guidedogs.org.uk:443/-/media/Project/GuideDogs/GuideDogsDotOrg/Images/opengraph/homepage/Black-labrador-looks-up-at-camera.jpg"  property="og:image" />
        <meta content="Guide Dogs UK"  property="og:title" />
        <meta content="https://www.guidedogs.org.uk/"  property="og:url" />
        <link href="/main.css" rel="stylesheet" />
{/*         
        <link
          href="https://gdogskb.blob.core.windows.net/$web/-/media/Feature/Experience-Accelerator/Foundation/Foundation/Styles/optimized-min.css?t=20190703T145413Z"
          rel="stylesheet"
        />
        <link
          href="https://gdogskb.blob.core.windows.net/$web/-/media/Base-Themes/Core-Libraries/styles/optimized-min.css?t=20190703T145418Z"
          rel="stylesheet"
        />
        <link
          href="https://gdogskb.blob.core.windows.net/$web/-/media/Base-Themes/Main-Theme/styles/optimized-min.css?t=20190703T145420Z"
          rel="stylesheet"
        />
        <link
          href="https://gdogskb.blob.core.windows.net/$web/-/media/Themes/GuideDogs/GuideDogsDotOrg/GuideDogsTheme/styles/optimized-min.css?t=20200914T150421Z"
          rel="stylesheet"
        /> */}

      
        {/* <UniformPlaceholder
          placeholderKey="/head"
          placeholderComponent={placeholderComponent}
          {...props}
        ></UniformPlaceholder> */}
      </Head>

      <UniformPlaceholder
        placeholderKey="/body-top"
        placeholderComponent={placeholderComponent}
        {...props}
      ></UniformPlaceholder>
      <div id="wrapper">
        <header>
          <div id="header" className="row">
            <UniformPlaceholder
              placeholderKey="/header"
              placeholderComponent={placeholderComponent}
              {...props}
            ></UniformPlaceholder>
          </div>
        </header>
        <main>
          <div id="content" className="row">
            <UniformPlaceholder
              placeholderKey="/main"
              placeholderComponent={placeholderComponent}
              {...props}
            ></UniformPlaceholder>
          </div>
        </main>
        <footer>
          <div id="footer" className="row">
            <UniformPlaceholder
              placeholderKey="/footer"
              placeholderComponent={placeholderComponent}
              {...props}
            ></UniformPlaceholder>
          </div>
        </footer>
      </div>
      <UniformPlaceholder
        placeholderKey="/body-bottom"
        placeholderComponent={placeholderComponent}
        {...props}
      ></UniformPlaceholder>

    </>
  );
};

export default MVCLayout;
