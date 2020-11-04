import { HealthChecker } from '@cloudnative/health';
import { BindingAddress, BindingKey } from '@loopback/core';
import { HealthComponent } from './health.component';
import { HealthConfig } from './types';
/**
 * Binding keys used by this component.
 */
export declare namespace HealthBindings {
    const COMPONENT: BindingKey<HealthComponent>;
    const CONFIG: BindingAddress<HealthConfig>;
    const HEALTH_CHECKER: BindingKey<HealthChecker>;
}
/**
 * Binding tags for health related services
 */
export declare namespace HealthTags {
    /**
     * Binding tag for liveness check functions
     */
    const LIVE_CHECK = "health.liveCheck";
    /**
     * Binding tag for readiness check functions
     */
    const READY_CHECK = "health.readyCheck";
}
