"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/health
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthController = void 0;
const tslib_1 = require("tslib");
const health_1 = require("@cloudnative/health");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../keys");
const types_1 = require("../types");
function getHealthResponseObject() {
    /**
     * OpenAPI definition of health response schema
     */
    const healthResponseSchema = {
        type: 'object',
        properties: {
            status: { type: 'string' },
            checks: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        state: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                reason: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
    };
    /**
     * OpenAPI definition of health response
     */
    const healthResponse = {
        description: 'Health Response',
        content: {
            'application/json': {
                schema: healthResponseSchema,
            },
        },
    };
    return healthResponse;
}
/**
 * OpenAPI spec for health endpoints
 */
const healthSpec = {
    // response object needs to be cloned because the oas-validator throws an
    // error if the same object is referenced twice
    responses: {
        '200': getHealthResponseObject(),
        '500': getHealthResponseObject(),
        '503': getHealthResponseObject(),
    },
};
/**
 * OpenAPI spec to hide endpoints
 */
const hiddenSpec = {
    responses: {},
    'x-visibility': 'undocumented',
};
/**
 * A factory function to create a controller class for health endpoints. This
 * makes it possible to customize decorations such as `@get` with a dynamic
 * path value not known at compile time.
 *
 * @param options - Options for health endpoints
 */
function createHealthController(options = types_1.DEFAULT_HEALTH_OPTIONS) {
    const spec = options.openApiSpec ? healthSpec : hiddenSpec;
    /**
     * Controller for health endpoints
     */
    let HealthController = class HealthController {
        constructor(healthChecker) {
            this.healthChecker = healthChecker;
        }
        async health(response) {
            const status = await this.healthChecker.getStatus();
            return handleStatus(response, status);
        }
        async ready(response) {
            const status = await this.healthChecker.getReadinessStatus();
            return handleStatus(response, status, 503);
        }
        async live(response) {
            const status = await this.healthChecker.getLivenessStatus();
            return handleStatus(response, status, 500);
        }
    };
    tslib_1.__decorate([
        rest_1.get(options.healthPath, spec),
        tslib_1.__param(0, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], HealthController.prototype, "health", null);
    tslib_1.__decorate([
        rest_1.get(options.readyPath, spec),
        tslib_1.__param(0, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], HealthController.prototype, "ready", null);
    tslib_1.__decorate([
        rest_1.get(options.livePath, spec),
        tslib_1.__param(0, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], HealthController.prototype, "live", null);
    HealthController = tslib_1.__decorate([
        core_1.injectable({ scope: core_1.BindingScope.SINGLETON }),
        tslib_1.__param(0, core_1.inject(keys_1.HealthBindings.HEALTH_CHECKER)),
        tslib_1.__metadata("design:paramtypes", [health_1.HealthChecker])
    ], HealthController);
    return HealthController;
}
exports.createHealthController = createHealthController;
/**
 * Create response for the given status
 * @param response - Http response
 * @param status - Health status
 * @param failingCode - Status code for `DOWN`
 */
function handleStatus(response, status, failingCode = 503) {
    let statusCode = 200;
    switch (status.status) {
        case health_1.State.STARTING:
            statusCode = 503;
            break;
        case health_1.State.UP:
            statusCode = 200;
            break;
        case health_1.State.DOWN:
            statusCode = failingCode;
            break;
        case health_1.State.STOPPING:
            statusCode = 503;
            break;
        case health_1.State.STOPPED:
            statusCode = 503;
            break;
    }
    response.status(statusCode).send(status);
    return response;
}
//# sourceMappingURL=health.controller.js.map