import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookEntity1750259748322 implements MigrationInterface {
    name = 'UpdateBookEntity1750259748322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "avg_rating" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "avg_rating" DROP DEFAULT`);
    }

}
