const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'select-roles') {
            const selectedRoles = interaction.values; // Array dari role ID yang dipilih
            const member = interaction.member;

            const addedRoles = [];
            const removedRoles = [];

            selectedRoles.forEach(roleId => {
                const role = interaction.guild.roles.cache.get(roleId);
                if (member.roles.cache.has(roleId)) {
                    // Jika role sudah ada, hapus role
                    member.roles.remove(role);
                    removedRoles.push(role.name);
                } else {
                    // Jika role belum ada, tambahkan role
                    member.roles.add(role);
                    addedRoles.push(role.name);
                }
            });

            let message = '';
            if (addedRoles.length > 0) {
                message += `✅ Ditambahkan role: ${addedRoles.join(', ')}\n`;
            }
            if (removedRoles.length > 0) {
                message += `❌ Dihapus role: ${removedRoles.join(', ')}\n`;
            }

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setDescription(message || 'Tidak ada perubahan pada role.');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
