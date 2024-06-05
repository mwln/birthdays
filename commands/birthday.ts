import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { isValidBirthday } from "../dates";
import { setBirthday } from "../db";

export default {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Everything birthday related")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("update")
                .setDescription("Update the date of your birthday")
                .addStringOption((option) =>
                    option
                        .setName("date")
                        .setRequired(true)
                        .setDescription("yyyy-MM-dd")
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("soon").setDescription("View upcoming birthdays")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("when")
                .setDescription("Check a birthday")
                .addUserOption((option) =>
                    option
                        .setName("who")
                        .setRequired(false)
                        .setDescription(
                            "Check a users birthday, or leave blank to check your own"
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("remove").setDescription("Remove your birthday")
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const id = interaction.user.id;
        switch (interaction.options.getSubcommand()) {
            case "update": {
                const userInput = (
                    interaction.options.getString("date") ?? ""
                ).trim();
                if (!isValidBirthday(userInput)) {
                    await interaction.reply(
                        `Not valid as yyyy-MM-dd: \`${userInput}\``
                    );
                    return;
                }

                const updated = await setBirthday(id, userInput);
                if (!updated) {
                    await interaction.reply(
                        `There was a problem setting your birthday`
                    );
                    return;
                }

                await interaction.reply("Success! Your birthday was set");
                return;
            }
            case "when": {
                break;
            }
            case "soon": {
                break;
            }
            default: {
                break;
            }
        }
    },
};
