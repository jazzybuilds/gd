import Head from "next/head";
import UniformPlaceholder from "../UniformPlaceholder";

const MVCLayout = (props) => {

  const { placeholderComponent } = props;

  return (
    <>
      <Head>
        <UniformPlaceholder
          placeholderKey="/head"
          placeholderComponent={placeholderComponent}
          {...props}
        ></UniformPlaceholder>
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
