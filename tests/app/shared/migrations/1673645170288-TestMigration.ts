import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1673645170288 implements MigrationInterface {
    name = 'TestMigration1673645170288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(60), "pass" varchar(10), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(60), "detail" varchar(60), "arquivada" boolean NOT NULL DEFAULT (0), "id_user" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_tasks" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(60), "detail" varchar(60), "arquivada" boolean NOT NULL DEFAULT (0), "id_user" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_44fe0c59b0e8f8077b1d9c27f75" FOREIGN KEY ("id_user") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tasks"("id", "description", "detail", "arquivada", "id_user", "created_at", "updated_at") SELECT "id", "description", "detail", "arquivada", "id_user", "created_at", "updated_at" FROM "tasks"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_tasks" RENAME TO "tasks"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME TO "temporary_tasks"`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(60), "detail" varchar(60), "arquivada" boolean NOT NULL DEFAULT (0), "id_user" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "tasks"("id", "description", "detail", "arquivada", "id_user", "created_at", "updated_at") SELECT "id", "description", "detail", "arquivada", "id_user", "created_at", "updated_at" FROM "temporary_tasks"`);
        await queryRunner.query(`DROP TABLE "temporary_tasks"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
