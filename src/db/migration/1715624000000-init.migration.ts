import { MigrationInterface, QueryRunner } from 'typeorm'

export class migration1715624000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      DROP TYPE IF EXISTS PROVIDER_TYPE;
      CREATE TYPE PROVIDER_TYPE AS ENUM ('google', 'github', 'email');
      
      CREATE TABLE IF NOT EXISTS public."user" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "login" TEXT NOT NULL,
        "provider" PROVIDER_TYPE NOT NULL,
        "provider_id" TEXT,
        "email" TEXT,
        "password" TEXT,
        "image" TEXT,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_user_email ON public."user" USING hash (email);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."user";')
    await queryRunner.query('DROP TYPE PROVIDER_TYPE;');
  }

}
