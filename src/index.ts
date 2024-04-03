import NSMCluster from "./cluster";
import NSMAbstractClient from "./client";
import {NSMNode} from "./node";

export * from "./models";

export type NSMInitOptions = {
    baseUrls: string[],
    dbString?: string,
}

export function createNsm(options: NSMInitOptions) {
    return new NSM(options);
}

// TODO: Tests for multiple NSMCluster baseUrls

export default class NSM extends NSMAbstractClient {
    private readonly cluster: NSMCluster;

    constructor(options: NSMInitOptions) {
        super();
        this.cluster = new NSMCluster(options.baseUrls, options.dbString);
    }

    async forceFetchNodes() {
        return this.cluster.mapNodes();
    }

    getNode(id: string): NSMNode {
        return this.cluster.getNode(id);
    }

    getNodes(): NSMNode[] {
        return this.cluster.getNodes();
    }

    getBaseUrl(serviceId?: string): Promise<string> {
        if (serviceId) {
            return this.cluster.nodeByService(serviceId);
        } else {
            return this.cluster.nodeBalanced();
        }
    }
}