import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1709138558830 implements MigrationInterface {
    name = 'InitialSchema1709138558830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`measurement\` (\`id\` varchar(36) NOT NULL, \`member_id\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`weight\` decimal(5,2) NOT NULL, \`bodyfat_percentage\` decimal(5,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`meal\` (\`id\` varchar(36) NOT NULL, \`member_id\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`name\` varchar(40) NOT NULL, \`calories\` decimal(5,2) NOT NULL, \`notes\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`member\` (\`id\` varchar(36) NOT NULL, \`first_name\` varchar(30) NOT NULL, \`last_name\` varchar(30) NOT NULL, \`email\` varchar(50) NOT NULL, \`join_date\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`equipment\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(30) NOT NULL, \`type\` varchar(30) NOT NULL, \`purchase_date\` date NOT NULL, \`notes\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise\` (\`id\` varchar(36) NOT NULL, \`workout_id\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`type\` varchar(20) NOT NULL, \`notes\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workout\` (\`id\` varchar(36) NOT NULL, \`date\` date NOT NULL, \`member_id\` varchar(255) NOT NULL, \`type\` varchar(30) NOT NULL, \`notes\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise_equipment_equipment\` (\`exerciseId\` varchar(36) NOT NULL, \`equipmentId\` varchar(36) NOT NULL, INDEX \`IDX_699836f5204401a62f8d8844bd\` (\`exerciseId\`), INDEX \`IDX_802b1b4a08f72706e7888dd5e8\` (\`equipmentId\`), PRIMARY KEY (\`exerciseId\`, \`equipmentId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`measurement\` ADD CONSTRAINT \`FK_01fe70241e78c5c4c97859453d3\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`meal\` ADD CONSTRAINT \`FK_2d0f583024e636b9828ef2dfd78\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exercise\` ADD CONSTRAINT \`FK_f779e20c8324fc65f6d918fc8c0\` FOREIGN KEY (\`workout_id\`) REFERENCES \`workout\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workout\` ADD CONSTRAINT \`FK_6bdf1efb4e32d72701385a09276\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exercise_equipment_equipment\` ADD CONSTRAINT \`FK_699836f5204401a62f8d8844bdb\` FOREIGN KEY (\`exerciseId\`) REFERENCES \`exercise\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`exercise_equipment_equipment\` ADD CONSTRAINT \`FK_802b1b4a08f72706e7888dd5e8c\` FOREIGN KEY (\`equipmentId\`) REFERENCES \`equipment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_equipment_equipment\` DROP FOREIGN KEY \`FK_802b1b4a08f72706e7888dd5e8c\``);
        await queryRunner.query(`ALTER TABLE \`exercise_equipment_equipment\` DROP FOREIGN KEY \`FK_699836f5204401a62f8d8844bdb\``);
        await queryRunner.query(`ALTER TABLE \`workout\` DROP FOREIGN KEY \`FK_6bdf1efb4e32d72701385a09276\``);
        await queryRunner.query(`ALTER TABLE \`exercise\` DROP FOREIGN KEY \`FK_f779e20c8324fc65f6d918fc8c0\``);
        await queryRunner.query(`ALTER TABLE \`meal\` DROP FOREIGN KEY \`FK_2d0f583024e636b9828ef2dfd78\``);
        await queryRunner.query(`ALTER TABLE \`measurement\` DROP FOREIGN KEY \`FK_01fe70241e78c5c4c97859453d3\``);
        await queryRunner.query(`DROP INDEX \`IDX_802b1b4a08f72706e7888dd5e8\` ON \`exercise_equipment_equipment\``);
        await queryRunner.query(`DROP INDEX \`IDX_699836f5204401a62f8d8844bd\` ON \`exercise_equipment_equipment\``);
        await queryRunner.query(`DROP TABLE \`exercise_equipment_equipment\``);
        await queryRunner.query(`DROP TABLE \`workout\``);
        await queryRunner.query(`DROP TABLE \`exercise\``);
        await queryRunner.query(`DROP TABLE \`equipment\``);
        await queryRunner.query(`DROP TABLE \`member\``);
        await queryRunner.query(`DROP TABLE \`meal\``);
        await queryRunner.query(`DROP TABLE \`measurement\``);
    }

}
