import { Column, Entity, OneToMany } from 'typeorm'
import { DefaultFields } from '@/db/model/_default'
import { WorkoutModel } from '@/db/model/workout.model'
import { PROVIDER_TYPE } from '@/common/types';

@Entity('user')
export class UserModel extends DefaultFields {
  @Column({ type: 'text', name: 'login' })
  login: string
  
  @Column({ name: 'provider',
    type: 'enum',
    enum: PROVIDER_TYPE,
  })
  provider: PROVIDER_TYPE
  
  @Column({ type: 'text', name: 'provider_id', nullable: true })
  provider_id: string | null
  
  @Column({ type: 'text', name: 'email', nullable: true })
  email: string | null

  @Column({ type: 'text', name: 'password', nullable: true })
  password: string | null

  @Column({ type: 'text', name: 'image', nullable: true })
  image: string | null

  @OneToMany(() => WorkoutModel, (model) => model.user)
  workouts: WorkoutModel[]
}
