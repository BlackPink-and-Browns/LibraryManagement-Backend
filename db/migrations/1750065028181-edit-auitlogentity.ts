import { MigrationInterface, QueryRunner } from "typeorm";

export class EditAuitlogentity1750065028181 implements MigrationInterface {
    name = 'EditAuitlogentity1750065028181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "employee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "employee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
