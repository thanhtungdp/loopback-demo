"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/health
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthTags = exports.HealthBindings = void 0;
const core_1 = require("@loopback/core");
/**
 * Binding keys used by this component.
 */
var HealthBindings;
(function (HealthBindings) {
    HealthBindings.COMPONENT = core_1.BindingKey.create('components.HealthComponent');
    HealthBindings.CONFIG = core_1.BindingKey.buildKeyForConfig(HealthBindings.COMPONENT.key);
    HealthBindings.HEALTH_CHECKER = core_1.BindingKey.create('health.HeathChecker');
})(HealthBindings = exports.HealthBindings || (exports.HealthBindings = {}));
/**
 * Binding tags for health related services
 */
var HealthTags;
(function (HealthTags) {
    /**
     * Binding tag for liveness check functions
     */
    HealthTags.LIVE_CHECK = 'health.liveCheck';
    /**
     * Binding tag for readiness check functions
     */
    HealthTags.READY_CHECK = 'health.readyCheck';
})(HealthTags = exports.HealthTags || (exports.HealthTags = {}));
//# sourceMappingURL=keys.js.map