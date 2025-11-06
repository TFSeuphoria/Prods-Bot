const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gametime")
        .setDescription("Announce a game time")
        .addStringOption(option =>
            option.setName("time")
                .setDescription("Time of the game")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("timezone")
                .setDescription("Timezone of the game")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("league")
                .setDescription("League")
                .setRequired(true)),

    async execute(interaction) {
        // Check if user is head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const time = interaction.options.getString("time");
        const timezone = interaction.options.getString("timezone");
        const league = interaction.options.getString("league");

        // Build the embed
        const embed = new EmbedBuilder()
            .setTitle("Upcoming Game!")
            .addFields(
                { name: "Time", value: time, inline: true },
                { name: "Timezone", value: timezone, inline: true },
                { name: "League", value: league, inline: true }
            )
            .setColor("Blue")
            .setTimestamp();

        const channel = interaction.guild.channels.cache.get(config.channels.gametimes);
        if (!channel) return interaction.reply({ content: "Gametime channel not found.", ephemeral: true });

        // Send the message once
        await channel.send({ content: "@everyone", embeds: [embed] });

        // DM everyone in the server once
        interaction.guild.members.fetch().then(members => {
            members.forEach(member => {
                if (!member.user.bot) {
                    member.send({ embeds: [embed] }).catch(() => {}); // Ignore DMs that fail
                }
            });
        });

        interaction.reply({ content: "Game time announced!", ephemeral: true });
    }
};
