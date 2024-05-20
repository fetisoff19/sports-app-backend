import { WorkoutModel } from '@/db/model';
import { DefaultFields } from '@/db/model/_default';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'polyline' })
export class PolylineModel extends DefaultFields {

  @Column({ type: 'uuid', name: 'workout_uuid' })
  workoutUuid: string;

  @OneToOne(
    () => WorkoutModel,
    (model) => model.polyline,
    { cascade: ['remove'] }
  )
  @JoinColumn({ name: 'workout_uuid' })
  workout: WorkoutModel;

  @Column({ type: 'jsonb', name: 'points' })
  points: string | null;

  @Column({ type: 'int', name: 'array_length' })
  arrayLength: number;

  @Column({ type: 'int', name: 'orig_length' })
  origLength: number;

}
