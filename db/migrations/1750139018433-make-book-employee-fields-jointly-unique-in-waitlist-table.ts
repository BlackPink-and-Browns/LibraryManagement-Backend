import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeBookEmployeeFieldsJointlyUniqueInWaitlistTable1750139018433 implements MigrationInterface {
    name = 'MakeBookEmployeeFieldsJointlyUniqueInWaitlistTable1750139018433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waitlist" ADD CONSTRAINT "UQ_b1a0729a8ec19b57a8c198a1a8a" UNIQUE ("book_id", "employee_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waitlist" DROP CONSTRAINT "UQ_b1a0729a8ec19b57a8c198a1a8a"`);
    }

}
