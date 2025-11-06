const { SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("adddefensiveplay")
        .setDescription("Add a defensive play")
        .addAttachmentOption(option =>
            option.setName("image")
                .setDescription("Image of the play")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Name of the play")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Description of the play")
                .setRequired(true)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const image = interaction.options.getAttachment("image");
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");

        const channel = interaction.guild.channels.cache.get(config.channels.defensivePlays);
        if (!channel) return interaction.reply({ content: "Defensive Plays channel not found.", ephemeral: true });

        // Build the message
        const messageContent = `# ${name}\n**${description}**`;

        await channel.send({ content: messageContent, files: [image] });
        interaction.reply({ content: "Defensive play added!", ephemeral: true });
    }
};
