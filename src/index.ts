import NSMCluster from "./cluster";
import NSMAbstractClient from "./client";
import {NSMNode} from "./node";

export * from "./models";

export type NSMInitOptions = {
    baseUrls: string[],
    dbString?: string,
}

export class NSMError extends Error {
    constructor(public readonly status: number, message: string) {
        super(message);
    }
}

export function createNsm(options: NSMInitOptions) {
    return new NSM(options);
}

export default class NSM extends NSMAbstractClient {
    private readonly cluster: NSMCluster;

    constructor(options: NSMInitOptions) {
        super();
        this.cluster = new NSMCluster(options.baseUrls, options.dbString);
    }

    /**
     * Fetches all nodes from the cluster and updates the internal node list.
     * @returns {Promise<void>}
     */
    async forceFetchNodes() {
        return this.cluster.mapNodes();
    }

    /**
     * Gets a node object by its ID.
     * This returns non-null even if the node does not exist. To check of
     * the node existence, use `node.exists()`.
     * @param id The ID of the node.
     */
    getNode(id: string): NSMNode {
        return this.cluster.getNode(id);
    }

    /**
     * Gets all nodes in the cluster that are initialized.
     * This contains ONLY nodes that were fetched successfully.
     * @returns {NSMNode[]}
     */
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