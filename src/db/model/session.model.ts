import { WorkoutModel } from '@/db/model/workout.model'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { DefaultFields } from '@/db/model/_default'

@Entity({ name: 'session' })
export class SessionModel extends DefaultFields {
  @OneToOne(() => WorkoutModel, (model) => model.session, {
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'workout_uuid' })
  workout: WorkoutModel

  @Column({ type: 'uuid', name: 'workout_uuid' })
  workout_uuid: string

  @Column({ type: 'timestamptz', name: 'start_time' })
  start_time: Date

  @Column({ type: 'timestamptz', name: 'end_time' })
  end_time: Date

  @Column({ type: 'real', name: 'time_step', default: 1 })
  time_step: number

  @Column({ type: 'int', name: 'smoothing', default: 1 })
  smoothing: number

  @Column({ type: 'int', name: 'cadence_coef', default: 1 })
  cadence_coef: number

  @Column({ type: 'real', name: 'total_distance', default: 0 })
  total_distance: number | null

  @Column({ type: 'real', name: 'total_timer_time', default: 0 })
  total_timer_time: number | null

  @Column({ type: 'real', name: 'total_elapsed_time', nullable: true })
  total_elapsed_time: number | null

  @Column({ type: 'real', name: 'enhanced_max_speed', nullable: true })
  enhanced_max_speed: number | null

  @Column({ type: 'real', name: 'max_speed', nullable: true })
  max_speed: number | null

  @Column({ type: 'real', name: 'avg_speed', nullable: true })
  avg_speed: number | null

  @Column({ type: 'real', name: 'enhanced_avg_speed', nullable: true })
  enhanced_avg_speed: number | null

  @Column({ type: 'real', name: 'avg_heart_rate', nullable: true })
  avg_heart_rate: number | null

  @Column({ type: 'real', name: 'min_heart_rate', nullable: true })
  min_heart_rate: number | null

  @Column({ type: 'real', name: 'max_heart_rate', nullable: true })
  max_heart_rate: number | null

  @Column({ type: 'real', name: 'max_cadence', default: 0 })
  max_cadence: number | null

  @Column({ type: 'real', name: 'avg_cadence', nullable: true })
  avg_cadence: number | null

  @Column({ type: 'real', name: 'avg_power', nullable: true })
  avg_power: number | null

  @Column({ type: 'real', name: 'max_power', nullable: true })
  max_power: number | null

  @Column({ type: 'real', name: 'normalized_power', nullable: true })
  normalized_power: number | null

  @Column({ type: 'real', name: 'total_ascent', nullable: true })
  total_ascent: number | null

  @Column({ type: 'real', name: 'total_descent', nullable: true })
  total_descent: number | null

  @Column({ type: 'real', name: 'max_altitude', nullable: true })
  max_altitude: number | null

  @Column({ type: 'real', name: 'avg_altitude', nullable: true })
  avg_altitude: number | null

  @Column({ type: 'real', name: 'min_altitude', nullable: true })
  min_altitude: number | null

  @Column({ type: 'real', name: 'max_temperature', nullable: true })
  max_temperature: number | null

  @Column({ type: 'real', name: 'avg_temperature', nullable: true })
  avg_temperature: number | null

  @Column({ type: 'real', name: 'total_strides', nullable: true })
  total_strides: number | null

  @Column({ type: 'real', name: 'total_calories', nullable: true })
  total_calories: number | null

  @Column({ type: 'real', name: 'training_stress_score', nullable: true })
  training_stress_score: number | null
}
