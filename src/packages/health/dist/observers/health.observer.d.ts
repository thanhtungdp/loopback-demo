import { HealthChecker } from '@cloudnative/health';
import { ContextView, LifeCycleObserver } from '@loopback/core';
import { LiveCheck, ReadyCheck } from '../types';
export declare class HealthObserver implements LifeCycleObserver {
    private healthChecker;
    private liveChecks;
    private readyChecks;
    private eventEmitter;
    private startupCheck;
    private shutdownCheck;
    constructor(healthChecker: HealthChecker, liveChecks: ContextView<LiveCheck>, readyChecks: ContextView<ReadyCheck>);
    start(): Promise<void>;
    stop(): void;
}
