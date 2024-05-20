import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1715626000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."chart_data" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "workout_uuid" UUID NOT NULL,
        "points" JSONB NOT NULL,
        "array_length" INT NOT NULL,
        "orig_length" INT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_chart_data_workout_uuid ON public."chart_data" USING hash (workout_uuid);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."chart_data";');
  }

}