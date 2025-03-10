import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMessages1741593647638 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable uuid-ossp extension if not already enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Check if table exists
        const tableExists = await queryRunner.hasTable("messages");
        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: "messages",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true,
                            default: "uuid_generate_v4()",
                        },
                        {
                            name: "content",
                            type: "text",
                        },
                        {
                            name: "user_id",  // Changed from userId to user_id to match PostgreSQL convention
                            type: "uuid",
                        },
                        {
                            name: "created_at",  // Changed from createdAt to created_at
                            type: "timestamp",
                            default: "now()",
                        },
                        {
                            name: "updated_at",  // Changed from updatedAt to updated_at
                            type: "timestamp",
                            default: "now()",
                        },
                        {
                            name: "image_url",  // Changed from imageUrl to image_url
                            type: "varchar",
                            isNullable: true,
                        }
                    ],
                }),
                true
            );

            // Check if foreign key exists before creating it
            const table = await queryRunner.getTable("messages");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
            
            if (!foreignKey) {
                await queryRunner.createForeignKey(
                    "messages",
                    new TableForeignKey({
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE",
                    })
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("messages");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("messages", foreignKey);
            }
        }
        await queryRunner.dropTable("messages", true);
    }
}
