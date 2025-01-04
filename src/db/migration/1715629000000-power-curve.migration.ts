import { MigrationInterface, QueryRunner } from 'typeorm'
import { timePeriod } from '@/common/constants'

export class migration1715629000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."power_curve" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "workout_uuid" UUID NOT NULL,
        ${timePeriod.map((p) => `"${p}" INT`).join(', ')},
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT "fk_workout" 
            FOREIGN KEY(workout_uuid) 
            REFERENCES public."workout"(uuid) 
            ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_power_curve_workout_uuid ON public."power_curve" USING hash (workout_uuid);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."power_curve";')
  }
}
