"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/health
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthComponent = void 0;
const tslib_1 = require("tslib");
const health_1 = require("@cloudnative/health");
const core_1 = require("@loopback/core");
const controllers_1 = require("./controllers");
const keys_1 = require("./keys");
const observers_1 = require("./observers");
const types_1 = require("./types");
/**
 * A component providing health status
 */
let HealthComponent = class HealthComponent {
    constructor(application, healthConfig = {}) {
        this.application = application;
        // Bind the HealthCheck service
        this.application
            .bind(keys_1.HealthBindings.HEALTH_CHECKER)
            .toClass(health_1.HealthChecker)
            .inScope(core_1.BindingScope.SINGLETON);
        // Bind the health observer
        this.application.lifeCycleObserver(observers_1.HealthObserver);
        const options = {
            ...types_1.DEFAULT_HEALTH_OPTIONS,
            ...healthConfig,
        };
        if (!options.disabled) {
            this.application.controller(controllers_1.createHealthController(options));
        }
    }
};
HealthComponent = tslib_1.__decorate([
    core_1.injectable({ tags: { [core_1.ContextTags.KEY]: keys_1.HealthBindings.COMPONENT } }),
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, core_1.config()),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, Object])
], HealthComponent);
exports.HealthComponent = HealthComponent;
//# sourceMappingURL=health.component.js.map