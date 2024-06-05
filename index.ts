import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { loop } from "./commands";
import Cron from "croner";
import { getTodaysBirthdays } from "./db";
import { format } from "date-fns";

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
    const today = format(new Date(), "yyyy-MM-dd");
    console.log("Checking for birthdays on: ", today);

    const bdays = await getTodaysBirthdays();
    console.log(`Found ${bdays.length} users with a birthday today.`);

    // TODO: send a birthday message with discordjs using the guild & channel provided
}

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const job = Cron("* * * * *", wishTodaysBirthdays, {
        timezone: "Canada/Newfoundland",
    });
    console.log(`cron job is running: ${job.isRunning()}`);
});

client.login(TOKEN);
