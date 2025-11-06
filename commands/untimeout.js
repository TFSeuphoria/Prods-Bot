const { SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Remove timeout from a user")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to remove timeout from")
                .setRequired(true)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: "User not found in this server.", ephemeral: true });
        }

        try {
            await member.timeout(null); // Removes timeout
            interaction.reply({ content: `${user.tag} is no longer timed out.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "I couldn't remove the timeout. Do I have the correct permissions?", ephemeral: true });
        }
    }
};
