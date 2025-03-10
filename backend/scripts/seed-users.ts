import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config(); // Load environment variables

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

async function seedUsers() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/family_chat'
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Enable uuid-ossp extension
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // Create users table if it doesn't exist
        await client.query(`
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

        // Insert users
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await client.query(
                `INSERT INTO "users" (username, password, nickname, "isOnline")
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (username) DO UPDATE
                 SET nickname = $3, password = $2`,
                [user.username, hashedPassword, user.nickname, false]
            );
            console.log(`User ${user.username} created/updated successfully`);
        }

        console.log('All users have been seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    } finally {
        await client.end();
    }
}

// Run the seeding function
seedUsers().catch(console.error); 