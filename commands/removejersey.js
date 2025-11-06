const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../config.json");

const jerseysPath = path.join(__dirname, "../jerseys.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removejersey")
        .setDescription("Remove a user's jersey number")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to remove")
                .setRequired(true)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");

        // Load jerseys
        const jerseys = JSON.parse(fs.readFileSync(jerseysPath, "utf8"));

        let removed = false;

        // Loop through all numbers to find the user's ID
        for (const number in jerseys) {
            if (jerseys[number] === user.id) {
                jerseys[number] = "open";
                removed = true;
                break; // Stop after removing first occurrence
            }
        }

        if (!removed) {
            return interaction.reply({ content: `${user.tag} does not have a jersey registered.`, ephemeral: true });
        }

        // Save back to file
        fs.writeFileSync(jerseysPath, JSON.stringify(jerseys, null, 2));

        interaction.reply({ content: `${user.tag}'s jersey has been removed.`, ephemeral: true });
    }
};
