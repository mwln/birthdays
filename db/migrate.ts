import { db } from ".";

export async function migrate() {
    return await db.batch(
        ["CREATE TABLE IF NOT EXISTS users (id TEXT UNIQUE, day TEXT)"],
        "write"
    );
}

migrate();
