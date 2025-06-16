import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApplicationTablesAndEnumTypes1750024882837 implements MigrationInterface {
    name = 'AddApplicationTablesAndEnumTypes1750024882837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "office" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "address" text NOT NULL, CONSTRAINT "PK_200185316ba169fda17e3b6ba00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "house_no" character varying NOT NULL, "line1" character varying NOT NULL, "line2" character varying NOT NULL, "pincode" integer NOT NULL, "employee_id" integer, CONSTRAINT "REL_7e77f562043393b08de949b804" UNIQUE ("employee_id"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "UQ_471da4b90e96c1ebe0af221e07b" UNIQUE ("name"), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."borrow_record_status_enum" AS ENUM('BORROWED', 'RETURNED', 'OVERDUE')`);
        await queryRunner.query(`CREATE TABLE "borrow_record" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "borrowed_at" TIMESTAMP, "returned_at" TIMESTAMP, "overdue_alert_sent" boolean NOT NULL DEFAULT false, "status" "public"."borrow_record_status_enum" NOT NULL DEFAULT 'BORROWED', "book_copy_id" integer, "borrowed_by" integer, "return_shelf_id" integer, CONSTRAINT "PK_bed177a8cdcca94d5adeebdc52c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."waitlist_status_enum" AS ENUM('REQUESTED', 'NOTIFIED', 'REMOVED')`);
        await queryRunner.query(`CREATE TABLE "waitlist" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."waitlist_status_enum" NOT NULL DEFAULT 'REQUESTED', "book_id" integer, "employee_id" integer, CONSTRAINT "PK_973cfbedc6381485681d6a6916c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "message" text NOT NULL, "type" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "employee_id" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "action" text NOT NULL, "entity_type" character varying NOT NULL, "entity_id" uuid, "employee_id" integer, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employee_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'PROBATION')`);
        await queryRunner.query(`CREATE TYPE "public"."employee_role_enum" AS ENUM('UI', 'UX', 'DEVELOPER', 'HR')`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "experience" integer NOT NULL, "status" "public"."employee_status_enum" NOT NULL DEFAULT 'INACTIVE', "joining_date" date NOT NULL, "password" character varying NOT NULL, "role" "public"."employee_role_enum" NOT NULL DEFAULT 'DEVELOPER', "department_id" integer, CONSTRAINT "UQ_f9d306b968b54923539b3936b03" UNIQUE ("employee_id"), CONSTRAINT "UQ_817d1d427138772d47eca048855" UNIQUE ("email"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" text NOT NULL, "rating" integer NOT NULL, "book_id" integer, "employee_id" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "isbn" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "cover_image" character varying, CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_copy" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_available" boolean NOT NULL DEFAULT true, "book_id" integer, "shelf_id" integer, CONSTRAINT "PK_ef16f7a75bc656c5486264959bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shelf" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label" character varying NOT NULL, "office_id" integer, CONSTRAINT "UQ_f9b2e1677a79142f298dbbdddf3" UNIQUE ("label"), CONSTRAINT "PK_da2ce57e38dfc635d50d0e5fc8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_authors" ("book_id" integer NOT NULL, "author_id" integer NOT NULL, CONSTRAINT "PK_75172094a131109db714f4f2bc7" PRIMARY KEY ("book_id", "author_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d68802baf370cd6818cad7a50" ON "book_authors" ("book_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6fb8ac32a0a0bbca076b2cf7c5" ON "book_authors" ("author_id") `);
        await queryRunner.query(`CREATE TABLE "book_genres" ("book_id" integer NOT NULL, "genre_id" integer NOT NULL, CONSTRAINT "PK_dc2d072b9d76acb4c5f2a4c55e6" PRIMARY KEY ("book_id", "genre_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc378b8311ff85f0dd38f16309" ON "book_genres" ("book_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_43ff7d87d7506e768ca6491a1d" ON "book_genres" ("genre_id") `);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_7e77f562043393b08de949b804b" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_21ca7e8eb6aa7aaaffc98d9e635" FOREIGN KEY ("book_copy_id") REFERENCES "book_copy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_dd18f85be77871c2fbd4d95af76" FOREIGN KEY ("borrowed_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_33360054f2c48f96f38bd83b902" FOREIGN KEY ("return_shelf_id") REFERENCES "shelf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "waitlist" ADD CONSTRAINT "FK_a0b00e574da89a1f97dc435885f" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "waitlist" ADD CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_d62835db8c0aec1d18a5a927549" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_c8c387802649e72190078ed5a78" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_c2c3f80c330f92b7d21b5e2efe1" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_copy" ADD CONSTRAINT "FK_a3365d29e50bf551ff93777d4cb" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_copy" ADD CONSTRAINT "FK_0602e03867795f8055161ea93e4" FOREIGN KEY ("shelf_id") REFERENCES "shelf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shelf" ADD CONSTRAINT "FK_1ec1284c8e5c8bef1f2cb869010" FOREIGN KEY ("office_id") REFERENCES "office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_authors" ADD CONSTRAINT "FK_1d68802baf370cd6818cad7a503" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "book_authors" ADD CONSTRAINT "FK_6fb8ac32a0a0bbca076b2cf7c5a" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_genres" ADD CONSTRAINT "FK_dc378b8311ff85f0dd38f163090" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "book_genres" ADD CONSTRAINT "FK_43ff7d87d7506e768ca6491a1dd" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_genres" DROP CONSTRAINT "FK_43ff7d87d7506e768ca6491a1dd"`);
        await queryRunner.query(`ALTER TABLE "book_genres" DROP CONSTRAINT "FK_dc378b8311ff85f0dd38f163090"`);
        await queryRunner.query(`ALTER TABLE "book_authors" DROP CONSTRAINT "FK_6fb8ac32a0a0bbca076b2cf7c5a"`);
        await queryRunner.query(`ALTER TABLE "book_authors" DROP CONSTRAINT "FK_1d68802baf370cd6818cad7a503"`);
        await queryRunner.query(`ALTER TABLE "shelf" DROP CONSTRAINT "FK_1ec1284c8e5c8bef1f2cb869010"`);
        await queryRunner.query(`ALTER TABLE "book_copy" DROP CONSTRAINT "FK_0602e03867795f8055161ea93e4"`);
        await queryRunner.query(`ALTER TABLE "book_copy" DROP CONSTRAINT "FK_a3365d29e50bf551ff93777d4cb"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_c2c3f80c330f92b7d21b5e2efe1"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_c8c387802649e72190078ed5a78"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_d62835db8c0aec1d18a5a927549"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3"`);
        await queryRunner.query(`ALTER TABLE "waitlist" DROP CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba"`);
        await queryRunner.query(`ALTER TABLE "waitlist" DROP CONSTRAINT "FK_a0b00e574da89a1f97dc435885f"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_33360054f2c48f96f38bd83b902"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_dd18f85be77871c2fbd4d95af76"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_21ca7e8eb6aa7aaaffc98d9e635"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_7e77f562043393b08de949b804b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_43ff7d87d7506e768ca6491a1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc378b8311ff85f0dd38f16309"`);
        await queryRunner.query(`DROP TABLE "book_genres"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6fb8ac32a0a0bbca076b2cf7c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d68802baf370cd6818cad7a50"`);
        await queryRunner.query(`DROP TABLE "book_authors"`);
        await queryRunner.query(`DROP TABLE "shelf"`);
        await queryRunner.query(`DROP TABLE "book_copy"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TYPE "public"."employee_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employee_status_enum"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "waitlist"`);
        await queryRunner.query(`DROP TYPE "public"."waitlist_status_enum"`);
        await queryRunner.query(`DROP TABLE "borrow_record"`);
        await queryRunner.query(`DROP TYPE "public"."borrow_record_status_enum"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "genre"`);
        await queryRunner.query(`DROP TABLE "office"`);
    }

}
