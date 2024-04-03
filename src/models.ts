// Requests

export type CreateServiceRequest = {
    template: string,
    ram?: number,
    cpu?: number,
    disk?: number,
    env?: { [key: string]: string },
}

// Responses

export type NodeStatusResponse = {
    nodeId: string,
    running: string[],
    all: number,
    system: {
        totalmem: number,
        freemem: number,
        totaldisk: number,
        freedisk: number,
    }
}

export type BasicActionResponse = {
    status: number,
    message: string,
}

export type CreateServiceResponse = BasicActionResponse & {
    serviceId: string,
    statusPath: string,
    time: number,
}