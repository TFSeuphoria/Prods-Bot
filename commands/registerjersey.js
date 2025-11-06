const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const jerseysPath = path.join(__dirname, "../jerseys.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("registerjersey")
        .setDescription("Register a jersey number")
        .addIntegerOption(option =>
            option.setName("number")
                .setDescription("Jersey number (0-99)")
                .setRequired(true)),

    async execute(interaction) {
        const number = interaction.options.getInteger("number");

        // Validate number
        if (number < 0 || number > 99) {
            return interaction.reply({ content: "Please pick a number between 0 and 99.", ephemeral: true });
        }

        // Load jerseys
        const jerseys = JSON.parse(fs.readFileSync(jerseysPath, "utf8"));

        if (jerseys[number] !== "open") {
            return interaction.reply({ content: `Number ${number} is already taken.`, ephemeral: true });
        }

        // Register user
        jerseys[number] = interaction.user.id;

        // Save back to file
        fs.writeFileSync(jerseysPath, JSON.stringify(jerseys, null, 2));

        interaction.reply({ content: `You have successfully registered jersey number ${number}!`, ephemeral: true });
    }
};
