const { SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the server")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to unban")
                .setRequired(true)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");

        try {
            const bans = await interaction.guild.bans.fetch();
            const bannedUser = bans.get(user.id);

            if (!bannedUser) {
                return interaction.reply({ content: `${user.tag} is not banned.`, ephemeral: true });
            }

            await interaction.guild.members.unban(user.id);
            interaction.reply({ content: `${user.tag} has been unbanned.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "I couldn't unban that user. Do I have the correct permissions?", ephemeral: true });
        }
    }
};
