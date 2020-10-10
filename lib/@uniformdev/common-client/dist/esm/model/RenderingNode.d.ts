import { RenderingContext } from ".";
export interface RenderingNode {
    id?: string;
    renderingId?: string;
    componentName?: string;
    placeholder?: string;
    datasource: string;
    hidden: boolean;
    settings: any;
    renderingContext: RenderingContext;
}
//# sourceMappingURL=RenderingNode.d.ts.map