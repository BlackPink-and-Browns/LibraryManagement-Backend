import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeIdColumnToTablesWaitlistAndNotification1750077072394 implements MigrationInterface {
    name = 'AddEmployeeIdColumnToTablesWaitlistAndNotification1750077072394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3"`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "employee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "waitlist" DROP CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba"`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "employee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "waitlist" ADD CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waitlist" DROP CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3"`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "employee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "waitlist" ADD CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "employee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
