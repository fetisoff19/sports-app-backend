import { MigrationInterface, QueryRunner } from 'typeorm'

export class migration1715625000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."workout" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "sha256" TEXT NOT NULL,
        "user_uuid" UUID NOT NULL,
        "file_name" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "sport" TEXT NOT NULL,
        "sub_sport" TEXT,
        "date" TIMESTAMPTZ NOT NULL,
        "size" INT,
        "note" TEXT,
        "device" TEXT,
        "map_image" TEXT,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
          
        CONSTRAINT "fk_user" 
            FOREIGN KEY(user_uuid) 
            REFERENCES public."user"(uuid)
            ON DELETE CASCADE
      );
     
      CREATE INDEX IF NOT EXISTS idx_workout_user_uuid ON public."workout" USING hash (user_uuid);
      CREATE INDEX IF NOT EXISTS idx_workout_created_at ON public."workout" USING brin (created_at);
    
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."workout";')
  }

}

