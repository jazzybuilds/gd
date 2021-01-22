import React from "react"
import Head from "next/head";
import UniformPlaceholder from "../UniformPlaceholder";
import * as objectFitImages from 'object-fit-images';
import { equalHeightPods } from "../../scripts/equal-height-columns"
import { checkRowBgs } from "../../scripts/row-bg"
import { initMobileNav } from "../../scripts/mobile-navigation"

const MVCLayout = (props) => {

  const { placeholderComponent } = props;
  const pageFields = props?.renderingContext.page?.fields;
  const metaTitle = pageFields?.title;

  React.useEffect(() => {
    document.addEventListener('DOMContentLoaded', function() {
      equalHeightPods('.js-equalHeight');
    })
  })

  React.useEffect(() => {
    checkRowBgs();
    objectFitImages();
    initMobileNav()

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        equalHeightPods('.js-equalHeight');
      }, 500);
    });

  }, [])

  return (
    <>
      <Head>
        {metaTitle && <title dangerouslySetInnerHTML={{ __html: metaTitle}} />}
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
