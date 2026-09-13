const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const color = require('../../colors.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('🔎 Check how many members invite')
        .addSubcommand(command => command
            .setName('invite')
            .setDescription('🔎 Check how many members invite')
            .addUserOption(option => option
                .setName('user')
                .setDescription('User you want to check')
                .setRequired(true)
            )
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply();

        const { options } = interaction;
        const sub = options.getSubcommand();
        const user = options.getUser('user');

        if (sub === 'invite') {
            let invites = await interaction.guild.invites.fetch();
            let invited = invites.filter(u => u.inviter && u.inviter.id === user.id);

            let i = 0;
            invited.forEach(inv => i += inv.uses);

            const embed = new EmbedBuilder()
                .setColor(color.primary)
                .setDescription(`**${user.tag}** has invited **${i}** members to the server.`);

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    }
}