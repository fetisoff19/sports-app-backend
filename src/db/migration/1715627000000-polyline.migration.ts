import { MigrationInterface, QueryRunner } from 'typeorm'

export class migration1715627000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."polyline" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "workout_uuid" UUID NOT NULL,
        "points" JSONB NOT NULL,
        "array_length" INT NOT NULL,
        "orig_length" INT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT "fk_workout" 
            FOREIGN KEY(workout_uuid) 
            REFERENCES public."workout"(uuid) 
            ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_polyline_workout_uuid ON public."polyline" USING hash (workout_uuid);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."polyline";')
  }

}
