import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAllNecessaryTablesToTheDatabase1749979965669 implements MigrationInterface {
    name = 'AddAllNecessaryTablesToTheDatabase1749979965669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_2a4f5082f1be346e2b8cdec2194"`);
        await queryRunner.query(`ALTER TABLE "department" RENAME COLUMN "dpt_name" TO "name"`);
        await queryRunner.query(`CREATE TABLE "office" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "address" text NOT NULL, CONSTRAINT "PK_200185316ba169fda17e3b6ba00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_author" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "book_id" integer NOT NULL, "author_id" integer NOT NULL, CONSTRAINT "PK_920fe9755293f867fe2720a14e6" PRIMARY KEY ("id", "book_id", "author_id"))`);
        await queryRunner.query(`CREATE TABLE "genre" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_genre" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "book_id" integer NOT NULL, "genre_id" integer NOT NULL, CONSTRAINT "PK_91a2ecf52198d1c5e722c57f528" PRIMARY KEY ("id", "book_id", "genre_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."borrow_record_status_enum" AS ENUM('BORROWED', 'RETURNED', 'OVERDUE')`);
        await queryRunner.query(`CREATE TABLE "borrow_record" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "borrowed_at" TIMESTAMP, "returned_at" TIMESTAMP, "overdue_alert_sent" boolean NOT NULL DEFAULT false, "status" "public"."borrow_record_status_enum" NOT NULL DEFAULT 'BORROWED', "book_copy_id" integer, "borrowed_by" integer, "return_shelf_id" integer, CONSTRAINT "PK_bed177a8cdcca94d5adeebdc52c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."waitlist_status_enum" AS ENUM('REQUESTED', 'NOTIFIED', 'REMOVED')`);
        await queryRunner.query(`CREATE TABLE "waitlist" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "notified" boolean NOT NULL DEFAULT false, "status" "public"."waitlist_status_enum" NOT NULL DEFAULT 'REQUESTED', "book_id" integer, "employee_id" integer, CONSTRAINT "PK_973cfbedc6381485681d6a6916c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "message" text NOT NULL, "type" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "employee_id" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "action" text NOT NULL, "entity_type" character varying NOT NULL, "entity_id" uuid, "employee_id" integer, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" text NOT NULL, "rating" integer NOT NULL, "book_id" integer, "employee_id" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "isbn" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "cover_image" character varying, CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_copy" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_available" boolean NOT NULL DEFAULT true, "book_id" integer, "shelf_id" integer, CONSTRAINT "PK_ef16f7a75bc656c5486264959bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shelf" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label" character varying NOT NULL, "office_id" integer, CONSTRAINT "UQ_f9b2e1677a79142f298dbbdddf3" UNIQUE ("label"), CONSTRAINT "PK_da2ce57e38dfc635d50d0e5fc8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "houseno"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "line_1"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "line_2"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "UQ_2a4f5082f1be346e2b8cdec2194"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "joiningdate"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "house_no" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "line1" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "line2" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "pincode" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "employee_id" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "UQ_7e77f562043393b08de949b804b" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "joining_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "UQ_471da4b90e96c1ebe0af221e07b" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "employee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "UQ_f9d306b968b54923539b3936b03" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "experience" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "book_author" ADD CONSTRAINT "FK_01af769e5879705bc5035b731c7" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_author" ADD CONSTRAINT "FK_51dabed37e04e81c0b7703d7ad4" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_genre" ADD CONSTRAINT "FK_fa09ea26c5837f4f4160ae55715" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_genre" ADD CONSTRAINT "FK_df2409dcd1dade9038a7d79e653" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_7e77f562043393b08de949b804b" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_21ca7e8eb6aa7aaaffc98d9e635" FOREIGN KEY ("book_copy_id") REFERENCES "book_copy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_dd18f85be77871c2fbd4d95af76" FOREIGN KEY ("borrowed_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_33360054f2c48f96f38bd83b902" FOREIGN KEY ("return_shelf_id") REFERENCES "shelf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "waitlist" ADD CONSTRAINT "FK_a0b00e574da89a1f97dc435885f" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "waitlist" ADD CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_c8c387802649e72190078ed5a78" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_c2c3f80c330f92b7d21b5e2efe1" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_copy" ADD CONSTRAINT "FK_a3365d29e50bf551ff93777d4cb" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_copy" ADD CONSTRAINT "FK_0602e03867795f8055161ea93e4" FOREIGN KEY ("shelf_id") REFERENCES "shelf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shelf" ADD CONSTRAINT "FK_1ec1284c8e5c8bef1f2cb869010" FOREIGN KEY ("office_id") REFERENCES "office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shelf" DROP CONSTRAINT "FK_1ec1284c8e5c8bef1f2cb869010"`);
        await queryRunner.query(`ALTER TABLE "book_copy" DROP CONSTRAINT "FK_0602e03867795f8055161ea93e4"`);
        await queryRunner.query(`ALTER TABLE "book_copy" DROP CONSTRAINT "FK_a3365d29e50bf551ff93777d4cb"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_c2c3f80c330f92b7d21b5e2efe1"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_c8c387802649e72190078ed5a78"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2d1b6bc7dc2f2406884cb5cf5d2"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3"`);
        await queryRunner.query(`ALTER TABLE "waitlist" DROP CONSTRAINT "FK_b0795629a03ccb46e03e095d5ba"`);
        await queryRunner.query(`ALTER TABLE "waitlist" DROP CONSTRAINT "FK_a0b00e574da89a1f97dc435885f"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_33360054f2c48f96f38bd83b902"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_dd18f85be77871c2fbd4d95af76"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_21ca7e8eb6aa7aaaffc98d9e635"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_7e77f562043393b08de949b804b"`);
        await queryRunner.query(`ALTER TABLE "book_genre" DROP CONSTRAINT "FK_df2409dcd1dade9038a7d79e653"`);
        await queryRunner.query(`ALTER TABLE "book_genre" DROP CONSTRAINT "FK_fa09ea26c5837f4f4160ae55715"`);
        await queryRunner.query(`ALTER TABLE "book_author" DROP CONSTRAINT "FK_51dabed37e04e81c0b7703d7ad4"`);
        await queryRunner.query(`ALTER TABLE "book_author" DROP CONSTRAINT "FK_01af769e5879705bc5035b731c7"`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "experience" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "UQ_f9d306b968b54923539b3936b03"`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "employee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "UQ_471da4b90e96c1ebe0af221e07b"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "joining_date"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "UQ_7e77f562043393b08de949b804b"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "pincode"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "line2"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "line1"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "house_no"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "joiningdate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "address_id" integer`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "UQ_2a4f5082f1be346e2b8cdec2194" UNIQUE ("address_id")`);
        await queryRunner.query(`ALTER TABLE "address" ADD "line_2" character varying`);
        await queryRunner.query(`ALTER TABLE "address" ADD "line_1" character varying`);
        await queryRunner.query(`ALTER TABLE "address" ADD "houseno" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "shelf"`);
        await queryRunner.query(`DROP TABLE "book_copy"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "waitlist"`);
        await queryRunner.query(`DROP TYPE "public"."waitlist_status_enum"`);
        await queryRunner.query(`DROP TABLE "borrow_record"`);
        await queryRunner.query(`DROP TYPE "public"."borrow_record_status_enum"`);
        await queryRunner.query(`DROP TABLE "book_genre"`);
        await queryRunner.query(`DROP TABLE "genre"`);
        await queryRunner.query(`DROP TABLE "book_author"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "office"`);
        await queryRunner.query(`ALTER TABLE "department" RENAME COLUMN "name" TO "dpt_name"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_2a4f5082f1be346e2b8cdec2194" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
