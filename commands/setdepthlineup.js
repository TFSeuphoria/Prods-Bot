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
        .setName("setdepthlineup")
        .setDescription("Set the backup/depth lineup")
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

        // Remove backup role from all members first
        const backupRole = guild.roles.cache.get(config.roles.backups);
        if (!backupRole) return interaction.reply({ content: "Backups role not found.", ephemeral: true });

        backupRole.members.forEach(member => member.roles.remove(backupRole).catch(() => {}));

        // Build depth lineup object
        const depthLineup = {};
        for (const pos of positions) {
            const userInput = interaction.options.getString(pos.toLowerCase());
            if (userInput) {
                const userId = userInput.replace(/\D/g, "");
                const member = guild.members.cache.get(userId);
                if (member) {
                    depthLineup[pos] = member;
                    member.roles.add(backupRole).catch(() => {});
                }
            }
        }

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle("Backup/Depth Lineup")
            .setColor("Orange")
            .setTimestamp();

        for (const pos of positions) {
            embed.addFields({ name: pos, value: depthLineup[pos] ? `<@${depthLineup[pos].id}>` : "None", inline: true });
        }

        const depthChannel = guild.channels.cache.get(config.channels.lineupDepth);
        if (!depthChannel) return interaction.reply({ content: "Lineup Depth channel not found.", ephemeral: true });

        await depthChannel.send({ embeds: [embed] });
        await interaction.reply({ content: "Backup/depth lineup has been set!", ephemeral: true });
    }
};
