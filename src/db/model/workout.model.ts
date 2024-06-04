import {
  ChartDataModel, PolylineModel, PowerCurveModel, SessionModel,
  UserModel,
} from '@/db/model'

import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { DefaultFields } from '@/db/model/_default'

@Entity({ name: 'workout' })
export class WorkoutModel extends DefaultFields {

  @Column({ type: 'uuid', name: 'user_uuid' })
  user_uuid: string

  @ManyToOne(
    () => UserModel,
    (model) => model.workouts,
    { cascade: ['remove'] },
  )
  @JoinColumn({ name: 'user_uuid' })
  user: UserModel

  @Column({ type: 'text', name: 'sha256' })
  sha256: string

  @Column({ type: 'text', name: 'file_name' })
  file_name: string

  @Column({ type: 'text', name: 'name' })
  name: string

  @Column({ type: 'text', name: 'sport' })
  sport: string

  @Column({ type: 'text', name: 'sub_sport', nullable: true })
  sub_sport: string

  @Column({ type: 'text', name: 'date' })
  date: Date

  @Column({ type: 'real', name: 'size' })
  size: number

  @Column({ type: 'text', name: 'map_image' })
  map: string | null

  @Column({ type: 'text', name: 'note', nullable: true })
  note: string | null

  @Column({ type: 'text', name: 'device', nullable: true })
  device: string | null

  @OneToOne(
    () => SessionModel,
    (model) => model.workout,
  )
  session: SessionModel

  @OneToOne(
    () => PolylineModel,
    (model) => model.workout,
  )
  polyline: PolylineModel

  @OneToOne(
    () => PowerCurveModel,
    (model) => model.workout,
  )
  powerCurve: PowerCurveModel

  @OneToOne(
    () => ChartDataModel,
    (model) => model.workout,
    { nullable: true },
  )
  chartData: ChartDataModel
}
