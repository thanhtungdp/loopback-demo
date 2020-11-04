"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/health
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@loopback/rest");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const keys_1 = require("../../keys");
describe('Health (acceptance)', () => {
    let app;
    let request;
    afterEach(async () => {
        if (app)
            await app.stop();
        app = undefined;
    });
    context('with default config', () => {
        beforeEach(async () => {
            app = givenRestApplication();
            app.component(__1.HealthComponent);
            await app.start();
            request = testlab_1.createRestAppClient(app);
        });
        it('exposes health at "/health/"', async () => {
            await request.get('/health').expect(200, { status: 'UP', checks: [] });
        });
        it('exposes health at "/ready/"', async () => {
            await request.get('/ready').expect(200, { status: 'UP', checks: [] });
        });
        it('exposes health at "/live/"', async () => {
            await request.get('/live').expect(200, { status: 'UP', checks: [] });
        });
        it('removes listener from the process', async () => {
            const healthChecker = await app.get(keys_1.HealthBindings.HEALTH_CHECKER);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const onShutdownRequest = healthChecker.onShutdownRequest;
            let listeners = process.listeners('SIGTERM');
            testlab_1.expect(listeners).to.containEql(onShutdownRequest);
            await app.stop();
            listeners = process.listeners('SIGTERM');
            testlab_1.expect(listeners).to.not.containEql(onShutdownRequest);
        });
        it('hides the endpoints from the openapi spec', async () => {
            const server = await app.getServer(rest_1.RestServer);
            const spec = await server.getApiSpec();
            testlab_1.expect(spec.paths).to.be.empty();
            await testlab_1.validateApiSpec(spec);
        });
    });
    context('with discovered live/ready checks', () => {
        beforeEach(async () => {
            app = givenRestApplication();
            app.component(__1.HealthComponent);
            app
                .bind('health.MockLiveCheck')
                .to(() => Promise.resolve())
                .tag(keys_1.HealthTags.LIVE_CHECK);
            app
                .bind('health.MockReadyCheck')
                .to(() => Promise.resolve())
                .tag(keys_1.HealthTags.READY_CHECK);
            await app.start();
            request = testlab_1.createRestAppClient(app);
        });
        it('exposes health at "/health/"', async () => {
            await request.get('/health').expect(200, {
                status: 'UP',
                checks: [
                    {
                        name: 'health.MockReadyCheck',
                        state: 'UP',
                        data: {
                            reason: '',
                        },
                    },
                    {
                        name: 'health.MockLiveCheck',
                        state: 'UP',
                        data: {
                            reason: '',
                        },
                    },
                ],
            });
        });
        it('exposes health at "/ready/"', async () => {
            await request.get('/ready').expect(200, {
                status: 'UP',
                checks: [
                    {
                        name: 'health.MockReadyCheck',
                        state: 'UP',
                        data: {
                            reason: '',
                        },
                    },
                ],
            });
        });
        it('exposes health at "/live/"', async () => {
            await request.get('/live').expect(200, {
                status: 'UP',
                checks: [
                    {
                        name: 'health.MockLiveCheck',
                        state: 'UP',
                        data: {
                            reason: '',
                        },
                    },
                ],
            });
        });
    });
    context('with discovered live/ready checks that fail', () => {
        beforeEach(async () => {
            app = givenRestApplication();
            app.component(__1.HealthComponent);
            app
                .bind('health.MockLiveCheck')
                .to(() => Promise.reject())
                .tag(keys_1.HealthTags.LIVE_CHECK);
            app
                .bind('health.MockReadyCheck')
                .to(() => Promise.reject())
                .tag(keys_1.HealthTags.READY_CHECK);
            await app.start();
            request = testlab_1.createRestAppClient(app);
        });
        it('exposes health at "/health/"', async () => {
            await request.get('/health').expect(503, {
                status: 'DOWN',
                checks: [
                    {
                        name: 'health.MockReadyCheck',
                        state: 'DOWN',
                        data: {
                            reason: '',
                        },
                    },
                    {
                        name: 'health.MockLiveCheck',
                        state: 'DOWN',
                        data: {
                            reason: '',
                        },
                    },
                ],
            });
        });
        it('exposes health at "/ready/"', async () => {
            await request.get('/ready').expect(503, {
                status: 'DOWN',
                checks: [
                    {
                        name: 'health.MockReadyCheck',
                        state: 'DOWN',
                        data: {
                            reason: '',
                        },
                    },
                ],
            });
        });
        it('exposes health at "/live/"', async () => {
            await request.get('/live').expect(500, {
                status: 'DOWN',
                checks: [
                    {
                        name: 'health.MockLiveCheck',
                        state: 'DOWN',
                        data: {
                            reason: '',
                        },
                    },
                ],
            });
        });
    });
    context('with custom endpoint basePath', () => {
        it('honors prefix', async () => {
            await givenAppWithCustomConfig({
                healthPath: '/internal/health',
            });
            await request
                .get('/internal/health')
                .expect(200, { status: 'UP', checks: [] });
            await request.get('/health').expect(404);
        });
    });
    context('with defaultHealth disabled', () => {
        it('does not expose /health', async () => {
            await givenAppWithCustomConfig({
                disabled: true,
            });
            await request.get('/health').expect(404);
        });
    });
    context('with openApiSpec enabled', () => {
        beforeEach(async () => {
            await givenAppWithCustomConfig({
                openApiSpec: true,
            });
        });
        it('adds the endpoints to the openapi spec', async () => {
            const server = await app.getServer(rest_1.RestServer);
            const spec = await server.getApiSpec();
            testlab_1.expect(spec.paths).to.have.properties('/health', '/live', '/ready');
            await testlab_1.validateApiSpec(spec);
        });
    });
    async function givenAppWithCustomConfig(config) {
        app = givenRestApplication();
        app.bind(keys_1.HealthBindings.CONFIG).to(config);
        app.component(__1.HealthComponent);
        await app.start();
        request = testlab_1.createRestAppClient(app);
    }
    function givenRestApplication(config) {
        const rest = Object.assign({}, testlab_1.givenHttpServerConfig(), config);
        return new rest_1.RestApplication({ rest });
    }
});
//# sourceMappingURL=health.acceptance.js.map