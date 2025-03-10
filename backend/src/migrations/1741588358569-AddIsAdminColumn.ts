import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAdminColumn1741588358569 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add isAdmin column with default value false
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "isAdmin" boolean DEFAULT false
        `);

        // Set specific user as admin (replace 'yaron' with the username you want to make admin)
        await queryRunner.query(`
            UPDATE "users"
            SET "isAdmin" = true
            WHERE username = 'yaron'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove isAdmin column
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN IF EXISTS "isAdmin"
        `);
    }

}
