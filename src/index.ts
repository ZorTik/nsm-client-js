import NSMCluster from "./cluster";
import NSMAbstractClient from "./client";
import {NSMNode} from "./node";

export * from "./models";

export type NSMInitOptions = {
    baseUrls: string[],
    dbString?: string,
}

export default class NSM extends NSMAbstractClient {
    private readonly cluster: NSMCluster;

    constructor(options: NSMInitOptions) {
        super();
        this.cluster = new NSMCluster(options.baseUrls, options.dbString);
    }

    getNode(id: string): NSMNode {
        return this.cluster.getNode(id);
    }

    getBaseUrl(serviceId?: string): Promise<string> {
        if (serviceId) {
            return this.cluster.nodeByService(serviceId);
        } else {
            return this.cluster.nodeBalanced();
        }
    }
}