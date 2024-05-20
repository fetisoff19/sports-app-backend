import { WorkoutModel } from '@/db/model/workout.model'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { DefaultFields } from '@/db/model/_default';

@Entity({ name: 'session' })
export class SessionModel extends DefaultFields {

  @OneToOne(
    () => WorkoutModel,
    (model) => model.session,
    { cascade: ['remove'], }
  )
  @JoinColumn({ name: 'workout_id' })
  workout: WorkoutModel

  @Column({ type: 'uuid', name: 'workout_uuid' })
  workoutUuid: string

  @Column({ type: 'real', name: 'time_step', default: 1 })
  timeStep: number

  @Column({ type: 'int', name: 'smoothing', default: 1 })
  smoothing: number

  @Column({ type: 'int', name: 'cadence_coef', default: 1 })
  cadenceCoef: number

  @Column({ type: 'real', name: 'total_distance', default: 0 })
  totalDistance: number | null

  @Column({ type: 'real', name: 'total_timer_time', default: 0 })
  totalTimerTime: number | null

  @Column({ type: 'real', name: 'total_elapsed_time', nullable: true })
  totalElapsedTime: number | null

  @Column({ type: 'real', name: 'enhanced_max_speed', nullable: true })
  enhancedMaxSpeed: number | null

  @Column({ type: 'real', name: 'max_speed', nullable: true })
  maxSpeed: number | null

  @Column({ type: 'real', name: 'avg_speed', nullable: true })
  avgSpeed: number | null

  @Column({ type: 'real', name: 'enhanced_avg_speed', nullable: true })
  enhancedAvgSpeed: number | null

  @Column({ type: 'real', name: 'avg_heart_rate', nullable: true })
  avgHeartRate: number | null

  @Column({ type: 'real', name: 'min_heart_rate', nullable: true })
  minHeartRate: number | null

  @Column({ type: 'real', name: 'max_heart_rate', nullable: true })
  maxHeartRate: number | null

  @Column({ type: 'real', name: 'max_cadence', default: 0 })
  maxCadence: number | null

  @Column({ type: 'real', name: 'avg_cadence', nullable: true })
  avgCadence: number | null

  @Column({ type: 'real', name: 'avg_power', nullable: true })
  avgPower: number | null

  @Column({ type: 'real', name: 'max_power', nullable: true })
  maxPower: number | null

  @Column({ type: 'real', name: 'normalized_power', nullable: true })
  normalizedPower: number | null

  @Column({ type: 'real', name: 'total_ascent', nullable: true })
  totalAscent: number | null

  @Column({ type: 'real', name: 'total_descent', nullable: true })
  totalDescent: number | null

  @Column({ type: 'real', name: 'max_altitude', nullable: true })
  maxAltitude: number | null

  @Column({ type: 'real', name: 'avg_altitude', nullable: true })
  avgAltitude: number | null

  @Column({ type: 'real', name: 'min_altitude', nullable: true })
  minAltitude: number | null

  @Column({ type: 'real', name: 'max_temperature', nullable: true })
  maxTemperature: number | null

  @Column({ type: 'real', name: 'avg_temperature', nullable: true })
  avgTemperature: number | null

  @Column({ type: 'real', name: 'total_strides', nullable: true })
  totalStrides: number | null

  @Column({ type: 'real', name: 'total_calories', nullable: true })
  totalCalories: number | null

  @Column({ type: 'real', name: 'training_stress_score', nullable: true })
  trainingStressScore: number | null

}
