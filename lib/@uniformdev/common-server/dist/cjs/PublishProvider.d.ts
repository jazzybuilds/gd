export interface PublishProvider {
    behavior: 'replace-on-deploy' | 'update-on-deploy';
    deploy(path: string): Promise<string>;
}
//# sourceMappingURL=PublishProvider.d.ts.map