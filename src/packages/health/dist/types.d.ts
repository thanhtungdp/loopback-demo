/**
 * Options for health component
 */
export declare type HealthOptions = {
    disabled?: boolean;
    healthPath: string;
    readyPath: string;
    livePath: string;
    openApiSpec?: boolean;
};
/**
 * Configuration for health component with optional properties
 */
export declare type HealthConfig = Partial<HealthOptions>;
export declare const DEFAULT_HEALTH_OPTIONS: HealthOptions;
/**
 * Functions for liveness check
 */
export declare type LiveCheck = () => Promise<void>;
/**
 * Functions for readiness check
 */
export declare type ReadyCheck = () => Promise<void>;
