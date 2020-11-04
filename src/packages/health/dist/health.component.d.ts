import { Application, Component } from '@loopback/core';
import { HealthConfig } from './types';
/**
 * A component providing health status
 */
export declare class HealthComponent implements Component {
    private application;
    constructor(application: Application, healthConfig?: HealthConfig);
}
