const { createNsm } = require('../dist');
const nsm = createNsm({
    baseUrls: ['http://localhost:3000']
});

let serviceId = null;

beforeAll(async () => {
    const res = await nsm.createService({
        template: 'example_minecraft',
        env: {
            'JAVA_VERSION': '11',
            'VERSION': '1.12.2',
        }
    });
    // Await idle state
    while (true) {
        const psr = await nsm.getService(res.serviceId).powerStatus();
        const status = psr.status;
        if (status && status !== 'PENDING') {
            if (status === 'ERROR') {
                throw new Error('Service failed to start: ' + psr.error);
            }
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    serviceId = res.serviceId;
}, 120000);

test('service exists', async () => {
    expect(await nsm.getService(serviceId).exists()).toBe(true);
});

test('service status returns 200 and has session', async () => {
    const status = await nsm.getService(serviceId).inspect();
    expect(status.session).toBeDefined();
});

test('running services contains service', async () => {
    const status = await nsm.getNodes()[0].status();
    expect(status.running).toContain(serviceId);
});

afterAll(async () => {
    await nsm.getService(serviceId).delete();
}, 120000);