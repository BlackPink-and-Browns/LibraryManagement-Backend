import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminToEmployeeRole1750056856208 implements MigrationInterface {
    name = 'AddAdminToEmployeeRole1750056856208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."employee_role_enum" RENAME TO "employee_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."employee_role_enum" AS ENUM('UI', 'UX', 'DEVELOPER', 'HR', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" TYPE "public"."employee_role_enum" USING "role"::"text"::"public"."employee_role_enum"`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" SET DEFAULT 'DEVELOPER'`);
        await queryRunner.query(`DROP TYPE "public"."employee_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."employee_role_enum_old" AS ENUM('UI', 'UX', 'DEVELOPER', 'HR')`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" TYPE "public"."employee_role_enum_old" USING "role"::"text"::"public"."employee_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" SET DEFAULT 'DEVELOPER'`);
        await queryRunner.query(`DROP TYPE "public"."employee_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."employee_role_enum_old" RENAME TO "employee_role_enum"`);
    }

}
