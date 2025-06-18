import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedExpiresAtColumnInBorrowEntity1750241854079 implements MigrationInterface {
    name = 'CreatedExpiresAtColumnInBorrowEntity1750241854079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD "expires_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TYPE "public"."waitlist_status_enum" RENAME TO "waitlist_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."waitlist_status_enum" AS ENUM('REQUESTED', 'NOTIFIED', 'REMOVED', 'FULFILLED')`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "status" TYPE "public"."waitlist_status_enum" USING "status"::"text"::"public"."waitlist_status_enum"`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`);
        await queryRunner.query(`DROP TYPE "public"."waitlist_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."waitlist_status_enum_old" AS ENUM('REQUESTED', 'NOTIFIED', 'REMOVED')`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "status" TYPE "public"."waitlist_status_enum_old" USING "status"::"text"::"public"."waitlist_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "waitlist" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`);
        await queryRunner.query(`DROP TYPE "public"."waitlist_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."waitlist_status_enum_old" RENAME TO "waitlist_status_enum"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP COLUMN "expires_at"`);
    }

}
