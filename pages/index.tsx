import React from "react";
import { ThemeProvider } from "styled-components";

// Uniform
import {
  BasePlaceholder,
  PageComponent,
  UniformContext,
  NextPageProps,
  getNextPageProps,
  createConsoleLogger,
} from "@uniformdev/next";
import { UniformContextProps } from "@uniformdev/common-client";

import uniformConfig from "../uniform.config";
const context: UniformContextProps = uniformConfig();
context.logger = context.logger || createConsoleLogger();

import { Hero as HeroComponent } from "../components/Hero";
import { TextBanner as TextBannerComponent } from "../components/TextBanner";
import { Card as CardComponent } from "../components/Card";
import { CardBanner as CardBannerComponent } from "../components/CardBanner";
import { ContactDetails as ContactDetailsComponent } from "../components/ContactDetails";
import { Button as ButtonComponent } from "../components/Button";
import { BlockText as BlockTextComponent } from "../components/BlockText";
import { BlockQuote as BlockQuoteComponent } from "../components/BlockQuote";
import { HeroSecondary as HeroSecondaryComponent } from "../components/HeroSecondary";
import { Accordion as AccordionComponent } from "../components/Accordion";
import { Image as ImageComponent } from "../components/Image";
import { CardArticle as CardArticleComponent } from "../components/CardArticle";
import { Video as VideoComponent } from "../components/Video";
import { CookiePreferences as CookiePreferencesComponent } from "../components/CookiePreferences";
import MVCLayout from "../components/Layout";
import MetadataLayout from "../components/MetadataLayout";
import { theme } from "../theme";
import { CampaignSearch } from "../components/CampaignSearch";
import BrowserTitle from "../components/Meta/BrowserTitle";
import { Content as ContentComponent } from "../components/Content";
import { Divider as DividerComponent } from "../components/Divider";

// Components Index
const componentsIndex: any = {};

componentsIndex["PrimaryHero"] = HeroComponent;
componentsIndex["PromoPod"] = TextBannerComponent;
componentsIndex["ManualNavigationPod"] = CardComponent;
componentsIndex["ImageSpotlight"] = CardBannerComponent;
componentsIndex["GetInTouch"] = ContactDetailsComponent;
componentsIndex["CTAButton"] = ButtonComponent;
componentsIndex["MessageBlock"] = BlockTextComponent;
componentsIndex["Quote"] = BlockQuoteComponent;
componentsIndex["SecondaryHero"] = HeroSecondaryComponent;
componentsIndex["Accordion"] = AccordionComponent;
componentsIndex["CaptionedImage"] = ImageComponent;
componentsIndex["CaseStudySpotlight"] = CardArticleComponent;
componentsIndex["Video"] = VideoComponent;
componentsIndex["MVCLayout"] = MVCLayout;
componentsIndex["MetadataLayout"] = MetadataLayout;
componentsIndex["CookiePreferences"] = CookiePreferencesComponent;
componentsIndex["Volunteeringsearchbox"] = CampaignSearch;
componentsIndex["BrowserTitle"] = BrowserTitle;
componentsIndex["RichText"] = ContentComponent
componentsIndex["ReusableRichText"] = ContentComponent
componentsIndex["Divider"] = DividerComponent

class Placeholder extends BasePlaceholder {
  constructor(props) {
    super(props, componentsIndex, createConsoleLogger(), context.options);
  }
}

componentsIndex.Placeholder = Placeholder;

// Page
export default class extends React.Component<NextPageProps> {
  static async getInitialProps(arg: any) {
    return await getNextPageProps(arg);
  }

  render() {
    return (
      <>
        <UniformContext.Provider value={context}>
          <ThemeProvider theme={theme}>
            <PageComponent {...this.props} components={componentsIndex}>
              {(renderingContext) => (
                <Placeholder
                  placeholderKey="/"
                  renderingContext={renderingContext}
                />
              )}
            </PageComponent>
          </ThemeProvider>
        </UniformContext.Provider>
      </>
    );
  }
}
