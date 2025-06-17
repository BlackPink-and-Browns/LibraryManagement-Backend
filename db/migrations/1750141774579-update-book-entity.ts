import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookEntity1750141774579 implements MigrationInterface {
    name = 'UpdateBookEntity1750141774579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "is_available" boolean`);
        await queryRunner.query(`ALTER TABLE "book" ADD "avg_rating" integer`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "description" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "avg_rating"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "is_available"`);
    }

}
