import NSMAbstractClient from "./client";
import {NodeStatusResponse} from "./models";

export class NSMNode extends NSMAbstractClient {
    private nodeId: string;

    constructor(
        readonly baseUrl: string|undefined,
    ) {
        super();
    }

    id() {
        return this.nodeId;
    }

    /**
     * Updates cached parameters.
     * @returns {Promise<boolean>} True if the node was successfully fetched.
     */
    async update(): Promise<boolean> {
        this.requireExists();
        const status = await this.status();
        if (status.nodeId) {
            this.nodeId = status.nodeId;
            return true;
        } else {
            return false;
        }
    }

    async exists(): Promise<boolean> {
        return this.baseUrl != undefined;
    }

    async status(): Promise<NodeStatusResponse> {
        this.requireExists();
        return this.req("/v1/status");
    }

    async getBaseUrl(serviceId?: string): Promise<string> {
        return this.baseUrl;
    }

    private requireExists() {
        if (!this.baseUrl) {
            throw new Error("Node does not exist!");
        }
    }
}