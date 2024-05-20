import { MigrationInterface, QueryRunner, Table } from 'typeorm';


export class migration1715629000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'power_curve',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'workout_uuid',
            type: 'uuid',
            isNullable: false,
          },
          ...timePeriod.map((item) => ({
            name: item.toString(),
            type: 'int4',
            isNullable: true,
          })),
        ],
      }),
      true,
    )
  }


  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public."power_curve";')
  }
}