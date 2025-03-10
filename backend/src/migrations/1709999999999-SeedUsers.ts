import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedUsers1709999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const users = [
            { username: "yaron", password: "0512", nickname: "ירון" },
            { username: "yael", password: "0414", nickname: "יעל" },
            { username: "tom", password: "0806", nickname: "תום" },
            { username: "ela", password: "2411", nickname: "אלה" },
            { username: "gony", password: "2702", nickname: "גוני" },
            { username: "omer", password: "2205", nickname: "עומר" },
            { username: "zivo", password: "2103", nickname: "זיוו" },
            { username: "nitzan", password: "1908", nickname: "ניצן" },
            { username: "nir", password: "0704", nickname: "ניר" },
            { username: "adi", password: "0912", nickname: "עדי" },
            { username: "ziv", password: "3112", nickname: "זיו גדול" },
            { username: "or", password: "1408", nickname: "אור" },
            { username: "eyal", password: "0202", nickname: "אייל" },
            { username: "victor", password: "3011", nickname: "סבא" },
            { username: "esti", password: "2209", nickname: "סבתא" }
        ];

        // First, ensure the migrations table exists
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "migrations" (
                "id" SERIAL PRIMARY KEY,
                "timestamp" bigint NOT NULL,
                "name" varchar NOT NULL
            );
        `);

        // Create the users table if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "username" varchar UNIQUE NOT NULL,
                "password" varchar NOT NULL,
                "nickname" varchar NOT NULL,
                "isOnline" boolean DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            );
        `);

        // Enable uuid-ossp extension if not enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        // Hash passwords and insert users
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await queryRunner.query(`
                INSERT INTO "users" (username, password, nickname, "isOnline")
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (username) DO UPDATE
                SET nickname = $3, password = $2
            `, [user.username, hashedPassword, user.nickname, false]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove all seeded users
        for (const user of ["yaron", "yael", "tom", "ela", "gony", "omer", 
                          "zivo", "nitzan", "nir", "adi", "ziv", "or", "eyal", 
                          "victor", "esti"]) {
            await queryRunner.query(`DELETE FROM "users" WHERE username = $1`, [user]);
        }
    }
} 