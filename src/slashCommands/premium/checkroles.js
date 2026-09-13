const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const TempRoles = require('../../models/premium/TempRoles'); // Import skema TempRoles
const ms = require('ms'); // Gunakan pustaka "ms" untuk format waktu (opsional, jika sudah ada)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkrole')
        .setDescription('🔍 Check the remaining time of a user’s temporary role.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to check temporary role for.')
            .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');

        // Cari data role sementara untuk pengguna tersebut di MongoDB
        const tempRoleData = await TempRoles.findOne({ Guild: interaction.guild.id, User: targetUser.id });

        // Jika tidak ada data untuk pengguna tersebut
        if (!tempRoleData) {
            return interaction.reply({ content: `❌ ${targetUser.username} does not have any active temporary roles.`, ephemeral: true });
        }

        // Hitung waktu tersisa
        const currentTime = Date.now();
        const expirationTime = new Date(tempRoleData.Expiration).getTime();
        const remainingTime = expirationTime - currentTime;

        // Jika role sudah habis masa berlaku tetapi belum dihapus dari database
        if (remainingTime <= 0) {
            await TempRoles.findOneAndDelete({ Guild: interaction.guild.id, User: targetUser.id });
            return interaction.reply({ content: `⏰ ${targetUser.username}'s temporary role has already expired.`, ephemeral: true });
        }

        // Format waktu tersisa dalam bentuk yang mudah dibaca
        const timeString = ms(remainingTime, { long: true });

        // Membuat embed untuk menampilkan informasi role sementara
        const embed = new EmbedBuilder()
            .setColor('#7452f1')
            .setTitle(`Informasi Role Untuk ${targetUser.username}`)
            .setDescription(`**Role:** <@&${tempRoleData.Role}>\n**Time Remaining:** ${timeString}`)
            .setFooter({ text: `Role akan kedaluwarsa pada ${new Date(expirationTime).toLocaleString()}` });

        await interaction.reply({ embeds: [embed] });
    },
};
