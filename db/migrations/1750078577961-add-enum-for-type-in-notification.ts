import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnumForTypeInNotification1750078577961 implements MigrationInterface {
    name = 'AddEnumForTypeInNotification1750078577961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('BOOK_REQUEST', 'BOOK_AVAILABLE', 'BOOK_OVERDUE')`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "type" "public"."notification_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "type" character varying NOT NULL`);
    }

}
