import { PublishProvider, PublishProviderOptions } from ".";
export declare class FakePublishProvider implements PublishProvider {
    private readonly publicUrl;
    private readonly logger;
    constructor({ config, logger }: PublishProviderOptions);
    get behavior(): 'replace-on-deploy' | 'update-on-deploy';
    deploy(path: string): Promise<string>;
}
//# sourceMappingURL=FakePublishProvider.d.ts.map