const NSMCluster = require('../dist/cluster').default;

const cluster = new NSMCluster(
    ['http://localhost:3000']
);

test('nodeBalanced returns only baseUrl', async () => {
    expect(await cluster.nodeBalanced()).toBe('http://localhost:3000');
});

test('nodeByService returns only baseUrl', async () => {
    expect(await cluster.nodeByService('service')).toBe('http://localhost:3000');
});