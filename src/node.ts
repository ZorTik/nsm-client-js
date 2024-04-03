import NSMAbstractClient from "./client";
import {NodeStatusResponse} from "./models";

export class NSMNode extends NSMAbstractClient {

    constructor(
        readonly baseUrl: string|undefined,
    ) {
        super();
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