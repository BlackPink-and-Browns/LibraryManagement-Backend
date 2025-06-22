import { MigrationInterface, QueryRunner } from "typeorm";

export class SetAvgRatingTypeToFloatInBookTable1750611453483 implements MigrationInterface {
    name = 'SetAvgRatingTypeToFloatInBookTable1750611453483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "avg_rating"`);
        await queryRunner.query(`ALTER TABLE "book" ADD "avg_rating" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "avg_rating"`);
        await queryRunner.query(`ALTER TABLE "book" ADD "avg_rating" integer NOT NULL DEFAULT '0'`);
    }

}
