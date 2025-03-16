import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteAllMessages1742141237000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Delete all records from the messages table
        await queryRunner.query(`DELETE FROM messages`);
        console.log('All messages have been deleted');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This is a destructive migration, so we can't restore the deleted messages
        console.log('This migration cannot be reverted as it deletes all messages');
    }
} 