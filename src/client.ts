import {CreateServiceRequest, CreateServiceResponse} from "./models";
import {Service} from "./service";

export default abstract class NSMAbstractClient {

    public abstract getBaseUrl(serviceId?: string): Promise<string>;

    async createService(body: CreateServiceRequest): Promise<CreateServiceResponse> {
        return await this.req("/v1/service/create", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    getService(id: string) {
        return new Service(this, id);
    }

    async req(path: string, init?: RequestInit): Promise<any> {
        const baseUrl = await this.getBaseUrl();
        return fetch(baseUrl + path, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
            },
        }).then(async (res) => {
            if (res.ok) {
                return res.json();
            } else if (res.body) {
                const body = await res.json();
                throw new Error("NSM request failed with status code " + res.status + ": " + body.message);
            } else {
                throw new Error("NSM request failed with status code " + res.status);
            }
        });
    }

}