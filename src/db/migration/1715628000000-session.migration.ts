import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1715628000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."session" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "workout_uuid" UUID NOT NULL,
        
        "time_step" REAL NOT NULL DEFAULT 1,        
        "smoothing" INT NOT NULL DEFAULT 1,
        "cadence_coef" INT NOT NULL DEFAULT 1,
        "total_distance" REAL NOT NULL DEFAULT 0,
        "total_timer_time" REAL NOT NULL DEFAULT 0,
        "total_elapsed_time" REAL,
        "enhanced_max_speed" REAL,
        "max_speed" REAL,
        "avg_speed" REAL,
        "enhanced_avg_speed" REAL,
        "avg_heart_rate" REAL,
        "min_heart_rate" REAL,
        "max_heart_rate" REAL,
        "max_cadence" REAL NOT NULL DEFAULT 0,
        "avg_cadence" REAL,
        "avg_power" REAL,
        "max_power" REAL,
        "normalized_power" REAL,
        "total_ascent" REAL,
        "total_descent" REAL,
        "max_altitude" REAL,
        "avg_altitude" REAL,
        "min_altitude" REAL,
        "max_temperature" REAL,
        "avg_temperature" REAL,
        "total_strides" REAL,
        "total_calories" REAL,
        "training_stress_score" REAL,
        
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT "fk_workout" 
            FOREIGN KEY(workout_uuid) 
            REFERENCES public."workout"(uuid) 
            ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_session_workout_uuid ON public."session" USING hash (workout_uuid);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."session";');
  }

}