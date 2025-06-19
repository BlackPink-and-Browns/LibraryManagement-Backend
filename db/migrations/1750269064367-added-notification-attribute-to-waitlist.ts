import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNotificationAttributeToWaitlist1750269064367 implements MigrationInterface {
    name = 'AddedNotificationAttributeToWaitlist1750269064367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waitlist" ADD "notification" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waitlist" DROP COLUMN "notification"`);
    }

}
