const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../config.json");

const jerseysPath = path.join(__dirname, "../jerseys.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("postnumbers")
        .setDescription("Post all jersey numbers and their status"),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        // Load jerseys
        const jerseys = JSON.parse(fs.readFileSync(jerseysPath, "utf8"));

        const embed = new EmbedBuilder()
            .setTitle("Jersey Numbers Status")
            .setColor("Blue")
            .setTimestamp();

        let value = "";

        for (let i = 0; i <= 99; i++) {
            const status = jerseys[i];
            if (status === "open") {
                value += `${i}: Open\n`;
            } else if (status === "Retired") {
                value += `${i}: Retired\n`;
            } else {
                const member = await interaction.guild.members.fetch(status).catch(() => null);
                value += member ? `${i}: Taken by ${member.user.tag}\n` : `${i}: Taken\n`;
            }
        }

        embed.setDescription(value);

        const channel = interaction.guild.channels.cache.get(config.channels.jerseyNumbers);
        if (!channel) return interaction.reply({ content: "Jersey Numbers channel not found.", ephemeral: true });

        await channel.send({ embeds: [embed] });
        interaction.reply({ content: "Jersey numbers posted!", ephemeral: true });
    }
};
