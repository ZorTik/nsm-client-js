import NSMAbstractClient from "./client";
import {BasicActionResponse} from "./models";

export class Service {

    constructor(
        private readonly client: NSMAbstractClient,
        private readonly id: string,
    ) {}

    async exists(): Promise<boolean> {
        return new Promise((resolve) => {
            this.client.req("/v1/service/" + this.id, this.id)
                .then((res) => {
                    if (!res.id) {
                        throw new Error();
                    }
                    resolve(true);
                })
                .catch(() => resolve(false));
        });
    }

    async resume(): Promise<BasicActionResponse> {
        return this.client.req("/v1/service/" + this.id + "/resume", this.id, {
            method: "POST",
        });
    }

    async stop(): Promise<BasicActionResponse> {
        return this.client.req("/v1/service/" + this.id + "/stop", this.id, {
            method: "POST",
        });
    }

    async delete(): Promise<BasicActionResponse> {
        return this.client.req("/v1/service/" + this.id + "/delete", this.id, {
            method: "POST",
        });
    }

    async reboot(): Promise<BasicActionResponse> {
        return this.client.req("/v1/service/" + this.id + "/reboot", this.id, {
            method: "POST",
        });
    }

}