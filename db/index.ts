import { createClient, type Client } from "@libsql/client";
import { format } from "date-fns";

const isProd = Bun.env.NODE_ENV === "production";

console.log("Running in production: ", isProd);
console.log("url: ", Bun.env.TURSO_URL);

export const db = createClient({
    url: isProd ? Bun.env.TURSO_URL as string : ":memory:",
    authToken: isProd ? Bun.env.TURSO_TOKEN as string : "mytoken"
});

export async function setBirthday(user: string, day: string): Promise<boolean> {
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
