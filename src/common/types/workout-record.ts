export interface WorkoutRecord {
  timestamp?: Date;
  distance?: number;
  heartRate?: number;
  cadence?: number;
  power?: number;

  speed?: number;
  enhancedSpeed?: number;

  positionLat?: number;
  positionLong?: number;

  altitude?: number;
  enhancedAltitude?: number;
}
