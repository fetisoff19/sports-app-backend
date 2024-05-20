import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1715624000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS public."user" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" TEXT NOT NULL,
        "login" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_user_email ON public."user" USING hash (email);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."user";');
  }

}
