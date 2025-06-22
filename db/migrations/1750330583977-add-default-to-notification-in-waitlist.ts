import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultToNotificationInWaitlist1750330583977 implements MigrationInterface {
    name = 'AddDefaultToNotificationInWaitlist1750330583977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "notification" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "notification" DROP DEFAULT`);
    }

}
