import { createClient } from "@libsql/client";

export const db = createClient({
    url: "file:local.db",
});

export async function migrate() {
    return await db.batch(
        [
            "CREATE TABLE IF NOT EXISTS users (id TEXT UNIQUE, day TEXT)",
        ],
        "write"
    );
}

