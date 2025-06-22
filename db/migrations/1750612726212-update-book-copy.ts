import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookCopy1750612726212 implements MigrationInterface {
    name = 'UpdateBookCopy1750612726212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_copy" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_copy" DROP COLUMN "is_deleted"`);
    }

}
