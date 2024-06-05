import type { Command } from "discord.js";
import { readdir } from "node:fs/promises";

export async function loop(fn: (cmd: Command) => void) {
    const files = (await readdir(import.meta.dir)).filter(
        (filename) => filename != "index.ts"
    );
    for (const file of files) {
        const file_path = import.meta.dir.concat("/", file);
        await import(file_path)
            .then((module) => {
                const cmd = module.default as Command;
                if ("data" in cmd && "execute" in cmd) {
                    fn(cmd);
                } else {
                    throw Error(
                        `Command for file ${file} not configured properly.`
                    );
                }
            })
            .catch((err) => console.error(err));
    }
}
