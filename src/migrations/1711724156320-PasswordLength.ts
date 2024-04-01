import { MigrationInterface, QueryRunner } from 'typeorm'

export class PasswordLength1711724156320 implements MigrationInterface {
  name = 'PasswordLength1711724156320'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `members` ADD UNIQUE INDEX `IDX_2714af51e3f7dd42cf66eeb08d` (`email`)'
    )
    await queryRunner.query('ALTER TABLE `members` DROP COLUMN `password`')
    await queryRunner.query('ALTER TABLE `members` ADD `password` varchar(500) NOT NULL')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `exercise_equipment` DROP FOREIGN KEY `FK_96a58fe75afd4920928496d6a11`'
    )
    await queryRunner.query(
      'ALTER TABLE `exercise_equipment` DROP FOREIGN KEY `FK_db115ed207d568e5d9cbaad1c63`'
    )
    await queryRunner.query('ALTER TABLE `members` DROP COLUMN `password`')
    await queryRunner.query('ALTER TABLE `members` ADD `password` varchar(50) NOT NULL')
    await queryRunner.query('ALTER TABLE `members` DROP INDEX `IDX_2714af51e3f7dd42cf66eeb08d`')
  }
}
