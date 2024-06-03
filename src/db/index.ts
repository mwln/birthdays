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

export async function setBirthday(user: string, day: string): Promise<boolean> {
    const result = await db.execute({
        sql: "INSERT OR REPLACE INTO users (id, day) VALUES (?, ?)",
        args: [user, day]
    });
    return result.rowsAffected === 1;
}

export async function deleteUser(user: string): Promise<boolean> {
    const result = await db.execute({
        sql: "DELETE FROM users WHERE id = ?",
        args: [user]
    });
    return result.rowsAffected > 0;
}

export async function getBirthday(user: string): Promise<string> {
    const result = await db.execute({
        sql: "SELECT day FROM users WHERE id = ?",
        args: [user]
    });
    console.log(result.rows)
    return result.rows[0][0] as string
}

// TODO: finish this function implementation
export async function getUpcomingBirthdays() { }

