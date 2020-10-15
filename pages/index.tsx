import React from 'react';

// Uniform
import { BasePlaceholder, PageComponent, UniformContext, NextPageProps, getNextPageProps, createConsoleLogger, } from '@uniformdev/next';
import { UniformContextProps } from '@uniformdev/common-client';

import uniformConfig from '../uniform.config';
const context: UniformContextProps = uniformConfig();
context.logger = context.logger || createConsoleLogger();

import { Hero as HeroComponent } from "../components/Hero"

// Components Index
const componentsIndex: any = {};

componentsIndex['PrimaryHero'] = HeroComponent


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
            <UniformContext.Provider value={context}>
                <PageComponent {...this.props} components={componentsIndex}>
                    {(renderingContext) => (
                        <Placeholder placeholderKey="/" renderingContext={renderingContext} />
                    )}
                </PageComponent>
            </UniformContext.Provider>
        );
    }
}
