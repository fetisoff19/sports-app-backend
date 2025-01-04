import { DefaultFields } from '@/db/model/_default'
import { WorkoutModel } from '@/db/model/workout.model'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

@Entity({ name: 'chart_data' })
export class ChartDataModel extends DefaultFields {
  @Column({ type: 'uuid', name: 'workout_uuid' })
  workout_uuid: string

  @OneToOne(() => WorkoutModel, (model) => model.chartData, {
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'workout_uuid' })
  workout: WorkoutModel

  @Column({ type: 'jsonb', name: 'points' })
  points: string

  @Column({ type: 'int', name: 'array_length' })
  array_length: number

  @Column({ type: 'int', name: 'orig_length' })
  orig_length: number
}
