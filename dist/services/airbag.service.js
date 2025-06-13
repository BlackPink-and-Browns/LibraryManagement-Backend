"use strict";
// File: src/service/airbag.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirbagService = void 0;
/**
 * Service responsible for deploying the airbag in isolation
 */
class AirbagService {
    constructor(sensor, igniter) {
        this.sensor = sensor;
        this.igniter = igniter;
    }
    /**
     * Deploys the airbag if a crash is detected
     * @returns AirbagResult indicating whether deployment occurred
     */
    deployAirbag() {
        if (this.sensor.isCrashDetected()) {
            const force = this.calculateForce();
            const timing = this.calculateTiming();
            this.igniter.trigger(force, timing);
            return { triggered: true, force, timing };
        }
        return { triggered: false };
    }
    /**
     * Calculates the required deployment force
     */
    calculateForce() {
        // Example fixed value; replace with real logic if needed
        return 100;
    }
    /**
     * Calculates the deployment timing
     */
    calculateTiming() {
        // Example fixed timing in milliseconds
        return 50;
    }
}
exports.AirbagService = AirbagService;
//# sourceMappingURL=airbag.service.js.map