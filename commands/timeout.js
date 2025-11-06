const { SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Put a user in timeout for a specified duration")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to timeout")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("duration")
                .setDescription("Duration of timeout in minutes")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for timeout")
                .setRequired(false)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const duration = interaction.options.getInteger("duration");
        const reason = interaction.options.getString("reason") || "No reason provided";

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({ content: "User not found in this server.", ephemeral: true });
        }

        // Duration in milliseconds
        const durationMs = duration * 60 * 1000;

        try {
            await member.timeout(durationMs, reason);
            interaction.reply({ content: `${user.tag} has been timed out for ${duration} minutes.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "I couldn't timeout that user. Do I have the correct permissions?", ephemeral: true });
        }
    }
};
