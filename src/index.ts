import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { loop } from "./commands";
import Cron from "croner";
import { formatter } from "./dates";
import { turso } from "./db";

const TOKEN = Bun.env.DISCORD_TOKEN ?? "UNKNOWN";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Register commands
loop((cmd) => {
    client.commands.set(cmd.data.name, cmd);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

export async function wishTodaysBirthdays(guild: string, channel: string) {
    const today = formatter(new Date());
    console.log("Checking for birthdays on: ", today);

    const results = await turso.execute({ sql: "SELECT * FROM users WHERE day = ?", args: [today] });
    console.log(`Found ${results.rows.length} users with a birthday today.`);

    // TODO: send a birthday message with discordjs using the guild & channel provided

    return results.rows;
}

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const job = Cron("0 7 * * *", wishTodaysBirthdays, { timezone: "Canada/Newfoundland" });
    console.log(`Cron Job Status: ${job.isRunning()}`)
});

client.login(TOKEN);
