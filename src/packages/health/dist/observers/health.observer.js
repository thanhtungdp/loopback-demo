"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/health
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthObserver = void 0;
const tslib_1 = require("tslib");
const health_1 = require("@cloudnative/health");
const core_1 = require("@loopback/core");
const events_1 = require("events");
const keys_1 = require("../keys");
let HealthObserver = class HealthObserver {
    constructor(healthChecker, liveChecks, readyChecks) {
        this.healthChecker = healthChecker;
        this.liveChecks = liveChecks;
        this.readyChecks = readyChecks;
        this.eventEmitter = new events_1.EventEmitter();
        const startup = once(this.eventEmitter, 'startup');
        const startupCheck = new health_1.StartupCheck('startup', () => startup);
        this.startupCheck = this.healthChecker.registerStartupCheck(startupCheck);
        const shutdown = once(this.eventEmitter, 'shutdown');
        this.shutdownCheck = new health_1.ShutdownCheck('shutdown', () => shutdown);
    }
    async start() {
        this.healthChecker.registerShutdownCheck(this.shutdownCheck);
        const liveChecks = await this.liveChecks.values();
        const liveCheckBindings = this.liveChecks.bindings;
        let index = 0;
        for (const lc of liveChecks) {
            const name = liveCheckBindings[index].key;
            const check = new health_1.LivenessCheck(name, lc);
            this.healthChecker.registerLivenessCheck(check);
            index++;
        }
        const readyChecks = await this.readyChecks.values();
        const readyCheckBindings = this.readyChecks.bindings;
        index = 0;
        for (const rc of readyChecks) {
            const name = readyCheckBindings[index].key;
            const check = new health_1.ReadinessCheck(name, rc);
            this.healthChecker.registerReadinessCheck(check);
            index++;
        }
        this.eventEmitter.emit('startup');
        await this.startupCheck;
    }
    stop() {
        this.eventEmitter.emit('shutdown');
        // Fix a potential memory leak caused by
        // https://github.com/CloudNativeJS/cloud-health/blob/2.1.2/src/healthcheck/HealthChecker.ts#L118
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onShutdownRequest = this.healthChecker.onShutdownRequest;
        if (onShutdownRequest != null) {
            // Remove the listener from the current process
            process.removeListener('SIGTERM', onShutdownRequest);
        }
    }
};
HealthObserver = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(keys_1.HealthBindings.HEALTH_CHECKER)),
    tslib_1.__param(1, core_1.inject.view(core_1.filterByTag(keys_1.HealthTags.LIVE_CHECK))),
    tslib_1.__param(2, core_1.inject.view(core_1.filterByTag(keys_1.HealthTags.READY_CHECK))),
    tslib_1.__metadata("design:paramtypes", [health_1.HealthChecker,
        core_1.ContextView,
        core_1.ContextView])
], HealthObserver);
exports.HealthObserver = HealthObserver;
function once(emitter, event) {
    return events_1.once(emitter, event);
}
//# sourceMappingURL=health.observer.js.map