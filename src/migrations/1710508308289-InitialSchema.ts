/* eslint-disable quotes */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1710508308289 implements MigrationInterface {
  name = 'InitialSchema1710508308289'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`equipment\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(30) NOT NULL, \`type\` enum ('barbell', 'dumbbell', 'machine', 'cardio') NOT NULL, \`purchase_date\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`notes\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`exercises\` (\`id\` varchar(36) NOT NULL, \`workout_id\` varchar(255) NOT NULL, \`name\` varchar(40) NOT NULL, \`setCount\` int NOT NULL, \`repCount\` int NOT NULL, \`weight\` float NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`type\` enum ('strength', 'cardio', 'hypertrophy') NULL, \`notes\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`workouts\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`member_id\` varchar(255) NOT NULL, \`type\` enum ('strength', 'cardio', 'hypertrophy', 'endurance', 'powerbuilding') NULL, \`notes\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`meals\` (\`id\` varchar(36) NOT NULL, \`member_id\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`name\` varchar(40) NOT NULL, \`calories\` decimal(5,2) NOT NULL, \`notes\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`members\` (\`id\` varchar(36) NOT NULL, \`first_name\` varchar(30) NOT NULL, \`last_name\` varchar(30) NOT NULL, \`email\` varchar(50) NOT NULL, \`join_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`measurements\` (\`id\` varchar(36) NOT NULL, \`member_id\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`weight\` decimal(5,2) NOT NULL, \`bodyfat_percentage\` decimal(5,2) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`exercise_equipment\` (\`equipment_id\` varchar(36) NOT NULL, \`exercise_id\` varchar(36) NOT NULL, INDEX \`IDX_db115ed207d568e5d9cbaad1c6\` (\`equipment_id\`), INDEX \`IDX_96a58fe75afd4920928496d6a1\` (\`exercise_id\`), PRIMARY KEY (\`equipment_id\`, \`exercise_id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`exercises\` ADD CONSTRAINT \`FK_7b0c9579a1c0ef6d5bd42f83282\` FOREIGN KEY (\`workout_id\`) REFERENCES \`workouts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`workouts\` ADD CONSTRAINT \`FK_dcefe37a24049cbbddfc8bfe288\` FOREIGN KEY (\`member_id\`) REFERENCES \`members\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`meals\` ADD CONSTRAINT \`FK_82467c8fadd30272f8b884e1de3\` FOREIGN KEY (\`member_id\`) REFERENCES \`members\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`measurements\` ADD CONSTRAINT \`FK_dcfffa998a420a3d241fba8e810\` FOREIGN KEY (\`member_id\`) REFERENCES \`members\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`exercise_equipment\` ADD CONSTRAINT \`FK_db115ed207d568e5d9cbaad1c63\` FOREIGN KEY (\`equipment_id\`) REFERENCES \`equipment\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`exercise_equipment\` ADD CONSTRAINT \`FK_96a58fe75afd4920928496d6a11\` FOREIGN KEY (\`exercise_id\`) REFERENCES \`exercises\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`exercise_equipment\` DROP FOREIGN KEY \`FK_96a58fe75afd4920928496d6a11\``
    )
    await queryRunner.query(
      `ALTER TABLE \`exercise_equipment\` DROP FOREIGN KEY \`FK_db115ed207d568e5d9cbaad1c63\``
    )
    await queryRunner.query(
      `ALTER TABLE \`measurements\` DROP FOREIGN KEY \`FK_dcfffa998a420a3d241fba8e810\``
    )
    await queryRunner.query(
      `ALTER TABLE \`meals\` DROP FOREIGN KEY \`FK_82467c8fadd30272f8b884e1de3\``
    )
    await queryRunner.query(
      `ALTER TABLE \`workouts\` DROP FOREIGN KEY \`FK_dcefe37a24049cbbddfc8bfe288\``
    )
    await queryRunner.query(
      `ALTER TABLE \`exercises\` DROP FOREIGN KEY \`FK_7b0c9579a1c0ef6d5bd42f83282\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_96a58fe75afd4920928496d6a1\` ON \`exercise_equipment\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_db115ed207d568e5d9cbaad1c6\` ON \`exercise_equipment\``
    )
    await queryRunner.query(`DROP TABLE \`exercise_equipment\``)
    await queryRunner.query(`DROP TABLE \`measurements\``)
    await queryRunner.query(`DROP TABLE \`members\``)
    await queryRunner.query(`DROP TABLE \`meals\``)
    await queryRunner.query(`DROP TABLE \`workouts\``)
    await queryRunner.query(`DROP TABLE \`exercises\``)
    await queryRunner.query(`DROP TABLE \`equipment\``)
  }
}
