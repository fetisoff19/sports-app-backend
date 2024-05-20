import {
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class DefaultFields {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()', nullable: false  })
  updatedAt: Date;
}
