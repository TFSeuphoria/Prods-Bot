const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../config.json");

const jerseysPath = path.join(__dirname, "../jerseys.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retirejersey")
        .setDescription("Retire a jersey number")
        .addIntegerOption(option =>
            option.setName("number")
                .setDescription("The jersey number to retire (0-99)")
                .setRequired(true)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const number = interaction.options.getInteger("number");

        if (number < 0 || number > 99) {
            return interaction.reply({ content: "Please pick a number between 0 and 99.", ephemeral: true });
        }

        // Load jerseys
        const jerseys = JSON.parse(fs.readFileSync(jerseysPath, "utf8"));

        // Retire the number
        jerseys[number] = "Retired";

        // Save back to file
        fs.writeFileSync(jerseysPath, JSON.stringify(jerseys, null, 2));

        interaction.reply({ content: `Jersey number ${number} has been retired.`, ephemeral: true });
    }
};
