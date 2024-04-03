const { createNsm } = require('../dist');
const nsm = createNsm({
    baseUrls: ['http://localhost:3000']
});

beforeAll(async () => {
    await nsm.forceFetchNodes();
});

test('node count is 1', () => {
    expect(nsm.getNodes().length).toBe(1);
});

test('status returns 200 and nodeId matches', async () => {
    const node = nsm.getNodes()[0];
    const status = await node.status();
    expect(status.nodeId).toBe(node.id());
});