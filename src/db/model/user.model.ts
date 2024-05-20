import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultFields } from '@/db/model/_default';
import { WorkoutModel } from '@/db/model/workout.model';

@Entity('user')
export class UserModel extends DefaultFields{
  @Column({ type: 'varchar', name: 'email' })
  email: string

  @Column({ type: 'varchar', name: 'password' })
  password: string

  @Column({ type: 'text', name: 'login' })
  login: string

  @Column({ type: 'text', name: 'image', nullable: true })
  image: string | null

  @OneToMany(() => WorkoutModel, (model) => model.user)
  workouts: WorkoutModel[]
}
