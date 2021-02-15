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

import MVCLayout from '../components/Layout'

const LoaderComponent = () => <div />
const HeroComponent =  loadable(() => import('../components/Hero'), {
  fallback: <div className="c-hero c-hero--primary" style={{height: 560}} />,
})
const HeroSecondaryComponent =  loadable(() => import('../components/HeroSecondary'), {
  fallback: <div className="c-hero c-hero--secondary" style={{height: 500}} />,
})

const CardComponent =  loadable(() => import('../components/Card'), {
  fallback: LoaderComponent
})
const TextBannerComponent =  loadable(() => import('../components/TextBanner'), {
  fallback: LoaderComponent
})
const CardBannerComponent =  loadable(() => import('../components/CardBanner'), {
  fallback: LoaderComponent
})
const ContactDetailsComponent =  loadable(() => import('../components/ContactDetails'), {
  fallback: LoaderComponent
})
const ButtonComponent =  loadable(() => import('../components/Button'), {
  fallback: LoaderComponent
})
const BlockTextComponent =  loadable(() => import('../components/BlockText'), {
  fallback: LoaderComponent
})
const BlockQuoteComponent =  loadable(() => import('../components/BlockQuote'), {
  fallback: LoaderComponent
})
const ImageComponent =  loadable(() => import('../components/Image'), {
  fallback: LoaderComponent
})
const CardArticleComponent =  loadable(() => import('../components/CardArticle'), {
  fallback: LoaderComponent
})
const VideoComponent =  loadable(() => import('../components/Video'), {
  fallback: LoaderComponent
})
const CookiePreferencesComponent =  loadable(() => import('../components/CookiePreferences'), {
  fallback: LoaderComponent
})
const CampaignSearchComponent =  loadable(() => import('../components/CampaignSearch'), {
  fallback: LoaderComponent
})
const ContentComponent =  loadable(() => import('../components/Content'), {
  fallback: LoaderComponent
})
const DividerComponent =  loadable(() => import('../components/Divider'), {
  fallback: LoaderComponent
})
const BrowserTitle =  loadable(() => import('../components/Meta/BrowserTitle'), {
  fallback: LoaderComponent
})
const MetadataLayout =  loadable(() => import('../components/MetadataLayout'), {
  fallback: LoaderComponent
})
const FormComponent =  loadable(() => import('../components/Form'), {
  fallback: LoaderComponent
})

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
componentsIndex["JavaScriptForm"] = FormComponent

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
