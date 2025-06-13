// File: src/service/airbag.service.ts

/**
 * Interface for crash sensor
 */
export interface CrashSensor {
    /**
     * Returns true if a crash is detected
     */
    isCrashDetected(): boolean;
  }
  
  /**
   * Interface for airbag igniter
   */
  export interface AirbagIgniter {
    /**
     * Triggers the airbag deployment with specified force and timing
     * @param force - deployment force
     * @param timing - deployment timing in ms
     */
    trigger(force: number, timing: number): void;
  }
  
  /**
   * Result of an airbag deployment attempt
   */
  export interface AirbagResult {
    triggered: boolean;
    force?: number;
    timing?: number;
  }
  
  /**
   * Service responsible for deploying the airbag in isolation
   */
  export class AirbagService {
    constructor(
      private sensor: CrashSensor,
      private igniter: AirbagIgniter
    ) {}
  
    /**
     * Deploys the airbag if a crash is detected
     * @returns AirbagResult indicating whether deployment occurred
     */
    deployAirbag(): AirbagResult {
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
    private calculateForce(): number {
      // Example fixed value; replace with real logic if needed
      return 100;
    }
  
    /**
     * Calculates the deployment timing
     */
    private calculateTiming(): number {
      // Example fixed timing in milliseconds
      return 50;
    }
  }
