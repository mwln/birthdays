import { CommandInteraction, SlashCommandBuilder } from "discord.js";

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
                        .setDescription(
                            "The date of your birthday in the format YYYY-MM-DD"
                        )
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
    async execute(interaction: CommandInteraction) {
        // TODO: Implement commands and subcommands
        await interaction.reply("Bday");
    },
};
