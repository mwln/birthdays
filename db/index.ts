import { createClient, type Client } from "@libsql/client";
import { format } from "date-fns";

export const db = createClient({
    url: Bun.env.NODE_ENV === "production" ? "file:local.db" : ":memory:",
});

export async function migrate() {
    console.log("NODE_ENV: ", Bun.env.NODE_ENV);
    return await db.batch(
        ["CREATE TABLE IF NOT EXISTS users (id TEXT UNIQUE, day TEXT)"],
        "write"
    );
}

export async function setBirthday(user: string, day: string): Promise<boolean> {
    console.log(Bun.env.NODE_ENV);
    const result = await db.execute({
        sql: "INSERT OR REPLACE INTO users (id, day) VALUES (?, ?)",
        args: [user, day],
    });
    return result.rowsAffected === 1;
}

export async function deleteUser(user: string, c?: Client): Promise<boolean> {
    const result = await db.execute({
        sql: "DELETE FROM users WHERE id = ?",
        args: [user],
    });
    return result.rowsAffected > 0;
}

export async function getBirthday(user: string): Promise<string | null> {
    const result = await db.execute({
        sql: "SELECT day FROM users WHERE id = ?",
        args: [user],
    });
    if (result.rows.length > 0) {
        return result.rows[0][0] as string;
    } else {
        return null;
    }
}

// TODO: finish this function implementation
export async function getUpcomingBirthdays() { }

export async function getTodaysBirthdays(): Promise<string[]> {
    const today = format(new Date(), "yyyy-MM-dd");
    const results = await db.execute({
        sql: "SELECT id FROM users WHERE day = ?",
        args: [today],
    });
    return results.rows.map((row) => row.id as string);
}
