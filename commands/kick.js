const { SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the server")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to kick")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the kick")
                .setRequired(false)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason provided";

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({ content: "User not found in this server.", ephemeral: true });
        }

        try {
            await member.kick(reason);
            interaction.reply({ content: `${user.tag} has been kicked.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "I couldn't kick that user. Do I have the correct permissions?", ephemeral: true });
        }
    }
};
