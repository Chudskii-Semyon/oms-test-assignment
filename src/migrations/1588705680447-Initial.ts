import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1588705680447 implements MigrationInterface {
    name = 'Initial1588705680447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "employee_role_enum" AS ENUM('CASHIER', 'ACCOUNTANT', 'SHOP_ASSISTANT')`, undefined);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "role" "employee_role_enum" NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_55cd161a0462c075f774b002c3" ON "employee" ("role") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_817d1d427138772d47eca04885" ON "employee" ("email") `, undefined);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "order_status_enum" AS ENUM('CREATED', 'COMPLETED', 'PAID')`, undefined);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "discount" double precision NOT NULL DEFAULT 0, "subTotal" double precision NOT NULL, "total" double precision NOT NULL, "status" "order_status_enum" NOT NULL DEFAULT 'CREATED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, "cashierId" integer, "shopAssistantId" integer, CONSTRAINT "REL_88991860e839c6153a7ec878d3" UNIQUE ("productId"), CONSTRAINT "REL_30fd5a3eac6bdbf80f74981fbc" UNIQUE ("cashierId"), CONSTRAINT "REL_d8c0a646a893343e171ba55030" UNIQUE ("shopAssistantId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_7a9573d6a1fb982772a9123320" ON "order" ("status") `, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_30fd5a3eac6bdbf80f74981fbc0" FOREIGN KEY ("cashierId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d8c0a646a893343e171ba55030d" FOREIGN KEY ("shopAssistantId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d8c0a646a893343e171ba55030d"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_30fd5a3eac6bdbf80f74981fbc0"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7a9573d6a1fb982772a9123320"`, undefined);
        await queryRunner.query(`DROP TABLE "order"`, undefined);
        await queryRunner.query(`DROP TYPE "order_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "product"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_817d1d427138772d47eca04885"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_55cd161a0462c075f774b002c3"`, undefined);
        await queryRunner.query(`DROP TABLE "employee"`, undefined);
        await queryRunner.query(`DROP TYPE "employee_role_enum"`, undefined);
    }

}
