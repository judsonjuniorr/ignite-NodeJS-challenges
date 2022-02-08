import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1616108470200 implements MigrationInterface {
  name = 'migration1616108470200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "users_games_games" ("usersId" uuid NOT NULL, "gamesId" uuid NOT NULL, CONSTRAINT "PK_cd4067d574477fd5c7693bc7872" PRIMARY KEY ("usersId", "gamesId"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_e5263d029d8644de829aae5c35" ON "users_games_games" ("usersId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_934b0d8f9d0084c97d3876ad32" ON "users_games_games" ("gamesId") ',
    );
    await queryRunner.query(
      'ALTER TABLE "users_games_games" ADD CONSTRAINT "FK_e5263d029d8644de829aae5c35a" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "users_games_games" ADD CONSTRAINT "FK_934b0d8f9d0084c97d3876ad32d" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );

    await queryRunner.query(
      'CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8yb16b62917b5595af982d66337" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "games_genres_genres" ("gamesId" uuid NOT NULL, "genresId" uuid NOT NULL, CONSTRAINT "PK_o34067d574477fd5c7693bc7872" PRIMARY KEY ("gamesId", "genresId"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_l5263d029d8644de829aae5235" ON "games_genres_genres" ("gamesId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_k34b0d8f9d0081c97d3876ad32" ON "games_genres_genres" ("genresId") ',
    );

    await queryRunner.query(
      'ALTER TABLE "games_genres_genres" ADD CONSTRAINT "FK_v5263d029d8644de829aae5c35a" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "games_genres_genres" ADD CONSTRAINT "FK_m34b0d8f9d0084c97d3876ad32d" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users_games_games" DROP CONSTRAINT "FK_934b0d8f9d0084c97d3876ad32d"',
    );
    await queryRunner.query(
      'ALTER TABLE "users_games_games" DROP CONSTRAINT "FK_e5263d029d8644de829aae5c35a"',
    );
    await queryRunner.query(
      'ALTER TABLE "games_genres_genres" DROP CONSTRAINT "FK_v5263d029d8644de829aae5c35a"',
    );
    await queryRunner.query(
      'ALTER TABLE "games_genres_genres" DROP CONSTRAINT "FK_m34b0d8f9d0084c97d3876ad32d"',
    );
    await queryRunner.query('DROP INDEX "IDX_934b0d8f9d0084c97d3876ad32"');
    await queryRunner.query('DROP INDEX "IDX_e5263d029d8644de829aae5c35"');
    await queryRunner.query('DROP INDEX "IDX_l5263d029d8644de829aae5235"');
    await queryRunner.query('DROP INDEX "IDX_k34b0d8f9d0081c97d3876ad32"');
    await queryRunner.query('DROP TABLE "users_games_games"');
    await queryRunner.query('DROP TABLE "games_genres_genres"');
    await queryRunner.query('DROP TABLE "games"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TABLE "genres"');
  }
}
