import { Constructor } from '@loopback/core';
import { HealthOptions } from '../types';
/**
 * A factory function to create a controller class for health endpoints. This
 * makes it possible to customize decorations such as `@get` with a dynamic
 * path value not known at compile time.
 *
 * @param options - Options for health endpoints
 */
export declare function createHealthController(options?: HealthOptions): Constructor<unknown>;
