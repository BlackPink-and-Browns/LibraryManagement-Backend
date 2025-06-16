import { MigrationInterface, QueryRunner } from "typeorm";

export class EditAuditLogEntityid1750066010418 implements MigrationInterface {
    name = 'EditAuditLogEntityid1750066010418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "entity_id"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "entity_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "entity_id"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "entity_id" uuid`);
    }

}
