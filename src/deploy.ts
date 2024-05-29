import { REST, Routes, type Command } from "discord.js";
import { loop } from "./commands";

const rest = new REST().setToken(Bun.env.DISCORD_TOKEN as string);
const commands: unknown[] = [];
await loop((cmd) => commands.push(cmd.data.toJSON()));

try {
    console.log(
        `Started refreshing ${commands.length} application (/) commands.`
    );

    // deploy to test guild
    // const data = await rest.put(
    //     Routes.applicationGuildCommands(
    //         Bun.env.DISCORD_CLIENT_ID as string,
    //         Bun.env.DISCORD_GUILD_ID as string
    //     ),
    //     { body: commands }
    // );

    // deploy globally
    const data = await rest.put(
        Routes.applicationCommands(Bun.env.DISCORD_CLIENT_ID as string),
        { body: commands }
    );

    console.log(
        `Successfully reloaded ${commands.length} application (/) commands.`
    );
} catch (error) {
    console.error(error);
}
