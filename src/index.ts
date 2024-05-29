import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { loop } from "./commands";

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

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(TOKEN);
