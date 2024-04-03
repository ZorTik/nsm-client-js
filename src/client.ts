import {CreateServiceRequest, CreateServiceResponse} from "./models";
import {Service} from "./service";

export default abstract class NSMAbstractClient {

    /**
     * Gets the base URL of the NSM node to use for the request.
     * @param serviceId The service ID to select the node.
     */
    public abstract getBaseUrl(serviceId?: string): Promise<string>;

    /**
     * Creates a new service based on the provided template.
     * @param body The request body.
     */
    async createService(body: CreateServiceRequest): Promise<CreateServiceResponse> {
        return await this.req("/v1/service/create", undefined, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    /**
     * Gets a service object by its ID.
     * This returns non-null even if the service does not exist. To check of
     * the service existence, use `service.exists()`.
     * @param id The ID of the service.
     */
    getService(id: string) {
        return new Service(this, id);
    }

    /**
     * Performs custom request against NSM node.
     * The right NSM node is selected based on the service ID provided here,
     * or the balance algorithm is used.
     * @param path The path of the endpoint, without baseUrl.
     * @param serviceId The service ID to select the node.
     * @param init The request init object.
     */
    async req(path: string, serviceId?: string, init?: RequestInit): Promise<any> {
        const baseUrl = await this.getBaseUrl(serviceId);
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