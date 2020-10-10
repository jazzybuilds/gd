import { DataItem } from './DataItem';
import { RenderingNode } from './RenderingNode';
import { TrackingNode } from './TrackingNode';
export interface PageItem extends DataItem {
    children?: DataItem[];
    renderings?: RenderingNode[];
    datasources?: string[];
    tracking?: TrackingNode;
    url?: string;
}
//# sourceMappingURL=PageItem.d.ts.map