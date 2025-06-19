import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookEntity1750259834269 implements MigrationInterface {
    name = 'UpdateBookEntity1750259834269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "is_available" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "is_available" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "avg_rating" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "avg_rating" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "is_available" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "is_available" DROP NOT NULL`);
    }

}
