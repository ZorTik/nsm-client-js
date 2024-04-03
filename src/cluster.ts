import {NSMNode} from "./node";
import * as mysql from "mysql";

const noneNsmNode = new NSMNode(undefined);

const serviceTableName = 'Service';
const sessionTableName = 'Session';

export default class NSMCluster {

    private readonly nodes: { [id: string]: NSMNode } = {};
    private readonly fetched: string[] = [];
    private readonly db: mysql.Connection;

    constructor(
        private readonly baseUrls: string[],
        private readonly dbString?: string,
    ) {
        if (baseUrls.length > 1 && !dbString) {
            throw new Error("MySQL connection is required for multiple baseUrls!");
        }
        this.db = dbString != undefined
            ? mysql.createConnection(dbString)
            : undefined;
    }

    async nodeByService(id: string): Promise<string> {
        await this.beforeAction();
        return this.firstBaseOrGet(() => new Promise((resolve, reject) => {
            this.db.query(
                `SELECT nodeId FROM ${serviceTableName} WHERE serviceId = '${id}' LIMIT 1;`,
                (err, res) => {
                    if (err || res.length === 0) {
                        reject(err);
                    } else {
                        if (!Object.keys(this.nodes).includes(res[0].nodeId)) {
                            reject(new Error("Node not found!"));
                            return;
                        }
                        resolve(this.nodes[res[0].nodeId].baseUrl);
                    }
            });
        }));
    }

    async nodeBalanced(): Promise<string> {
        await this.beforeAction();
        return this.firstBaseOrGet(() => new Promise((resolve, reject) => {
            this.db.query(
                `SELECT nodeId, COUNT(serviceId) AS serviceCount FROM ${sessionTableName} GROUP BY nodeId;`,
                (err, res: { nodeId: string, serviceCount: number }[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        const node = res
                            .filter((node) => Object.keys(this.nodes).includes(node.nodeId))
                            .sort((a, b) => a.serviceCount - b.serviceCount)
                            .shift();
                        if (node) {
                            resolve(this.nodes[node.nodeId].baseUrl);
                        } else {
                            // Random node
                            const keys = Object.keys(this.nodes);
                            resolve(this.nodes[keys[Math.floor(Math.random() * keys.length)]].baseUrl);
                        }
                    }
                });
        }));
    }

    getNode(id: string): NSMNode {
        return this.nodes[id] || noneNsmNode;
    }

    getNodes(): NSMNode[] {
        return Object.values(this.nodes);
    }

    private async firstBaseOrGet(get: () => Promise<string>) {
        const keys = Object.keys(this.nodes);
        if (keys.length === 0) {
            throw new Error("No nodes available!");
        } else if (keys.length === 1) {
            return this.nodes[keys[0]].baseUrl;
        } else {
            if (!this.dbString) {
                throw new Error("MySQL connection is required for multiple baseUrls!");
            }
            return get();
        }
    }

    private async beforeAction() {
        await this.prepareSql();
        await this.mapNodes();
    }

    private async prepareSql() {
        if (!this.db) {
            return;
        }
        this.db.state === "disconnected" && await new Promise((resolve, reject) => {
            this.db.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            })
        });
    }

    async mapNodes() {
        for (const baseUrl of this.baseUrls) {
            if (this.fetched.includes(baseUrl)) {
                continue;
            }
            try {
                const node = new NSMNode(baseUrl);
                if (await node.update()) {
                    this.nodes[node.id()] = node;
                    this.fetched.push(baseUrl);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}