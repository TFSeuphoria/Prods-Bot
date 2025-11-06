const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../config.json");

const positions = [
    "QB", "RB", "LWR", "RWR", "Slot", "TE",
    "LT", "LG", "C", "RG", "RT",
    "LDE", "LDT", "RDT", "RDE",
    "LOLB", "MLB", "ROLB",
    "LCB", "RCB", "FS", "SS"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setstarterlineup")
        .setDescription("Set the starter lineup")
        // Add an option for each position
        .addStringOption(option => 
            positions.reduce((opt, pos) => opt.addStringOption(o => 
                o.setName(pos.toLowerCase())
                 .setDescription(`User mention or ID for ${pos}`)
                 .setRequired(false)
            ), option)),

    async execute(interaction) {
        // Only head coach
        if (!interaction.member.roles.cache.has(config.roles.headCoach)) {
            return interaction.reply({ content: "Only the Head Coach can run this command.", ephemeral: true });
        }

        const guild = interaction.guild;

        // Remove starter role from all members who have it
        const starterRole = guild.roles.cache.get(config.roles.starter);
        if (!starterRole) return interaction.reply({ content: "Starter role not found.", ephemeral: true });

        starterRole.members.forEach(member => member.roles.remove(starterRole).catch(() => {}));

        // Build lineup object
        const lineup = {};
        for (const pos of positions) {
            const userInput = interaction.options.getString(pos.toLowerCase());
            if (userInput) {
                // Resolve mention or ID
                const userId = userInput.replace(/\D/g, ""); // strip non-numbers
                const member = guild.members.cache.get(userId);
                if (member) {
                    lineup[pos] = member;
                    member.roles.add(starterRole).catch(() => {});
                }
            }
        }

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle("Starter Lineup")
            .setColor("Green")
            .setTimestamp();

        for (const pos of positions) {
            embed.addFields({ name: pos, value: lineup[pos] ? `<@${lineup[pos].id}>` : "None", inline: true });
        }

        const lineupChannel = guild.channels.cache.get(config.channels.lineup);
        if (!lineupChannel) return interaction.reply({ content: "Lineup channel not found.", ephemeral: true });

        await lineupChannel.send({ embeds: [embed] });
        await interaction.reply({ content: "Starter lineup has been set!", ephemeral: true });
    }
};
