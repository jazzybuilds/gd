import React from "react";
import { ThemeProvider } from "styled-components";
import loadable from '@loadable/component'
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
import { theme } from "../theme";

const context: UniformContextProps = uniformConfig();
context.logger = context.logger || createConsoleLogger();

const HeroComponent =  loadable(() => import('../components/Hero'))
const TextBannerComponent =  loadable(() => import('../components/TextBanner'))
const CardComponent =  loadable(() => import('../components/Card'))
const CardBannerComponent =  loadable(() => import('../components/CardBanner'))
const ContactDetailsComponent =  loadable(() => import('../components/ContactDetails'))
const ButtonComponent =  loadable(() => import('../components/Button'))
const BlockTextComponent =  loadable(() => import('../components/BlockText'))
const BlockQuoteComponent =  loadable(() => import('../components/BlockQuote'))
const HeroSecondaryComponent =  loadable(() => import('../components/HeroSecondary'))
const ImageComponent =  loadable(() => import('../components/Image'))
const CardArticleComponent =  loadable(() => import('../components/CardArticle'))
const VideoComponent =  loadable(() => import('../components/Video'))
const CookiePreferencesComponent =  loadable(() => import('../components/CookiePreferences'))
const CampaignSearchComponent =  loadable(() => import('../components/CampaignSearch'))
const ContentComponent =  loadable(() => import('../components/Content'))
const DividerComponent =  loadable(() => import('../components/Divider'))
const BrowserTitle =  loadable(() => import('../components/Meta/BrowserTitle'))
const MVCLayout =  loadable(() => import('../components/Layout'))
const MetadataLayout =  loadable(() => import('../components/MetadataLayout'))


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
componentsIndex["CaptionedImage"] = ImageComponent;
componentsIndex["CaseStudySpotlight"] = CardArticleComponent;
componentsIndex["Video"] = VideoComponent;
componentsIndex["MVCLayout"] = MVCLayout;
componentsIndex["MetadataLayout"] = MetadataLayout;
componentsIndex["CookiePreferences"] = CookiePreferencesComponent;
componentsIndex["Volunteeringsearchbox"] = CampaignSearchComponent;
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
