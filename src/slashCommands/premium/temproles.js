const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const TempRoles = require('../../models/premium/TempRoles'); // Import skema TempRoles
const ms = require('ms'); // Pastikan Anda menginstall modul ini: npm install ms

module.exports = {
    data: new SlashCommandBuilder()
        .setName('temprole')
        .setDescription('📅 Assign a temporary role to a user for a specified duration.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to assign the temporary role to.')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role to assign temporarily.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('duration')
                .setDescription('Duration for the temporary role (e.g., 10m, 2h, 1d, or up to 90d).')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDMPermission(false),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const durationInput = interaction.options.getString('duration');
        const member = await interaction.guild.members.fetch(targetUser.id);

        const durationMs = ms(durationInput);
        if (!durationMs || durationMs > 90 * 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: '❌ Durasi harus valid dan tidak lebih dari 90 hari.', ephemeral: true });
        }

        const expirationDate = new Date(Date.now() + durationMs);
        const addedDate = new Date().toLocaleString();

        const botMember = interaction.guild.members.me;
        if (!botMember || !botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: '❌ Bot tidak memiliki izin untuk mengelola role.', ephemeral: true });
        }

        if (botMember.roles.highest.position <= role.position) {
            return interaction.reply({ content: '❌ Bot tidak bisa memberikan role ini karena keterbatasan hierarki.', ephemeral: true });
        }

        await member.roles.add(role);

        const embedAdd = new EmbedBuilder()
            .setColor('#7452f1')
            .setTitle('📥 Role Telah Ditambahkan')
            .addFields(
                { name: '👤 User', value: `<@${targetUser.id}>`, inline: true },
                { name: '🎭 Role', value: `<@&${role.id}>`, inline: true },
                { name: '📅 Tanggal Ditambahkan', value: addedDate, inline: false }
            )
            .setFooter({ text: `Role akan kedaluwarsa pada ${expirationDate.toLocaleString()}` });

        await interaction.reply({ embeds: [embedAdd] });

        const tempRoleData = new TempRoles({
            Guild: interaction.guild.id,
            User: targetUser.id,
            Role: role.id,
            Expiration: expirationDate
        });
        await tempRoleData.save();

        // Fungsi pembantu untuk mengatur durasi panjang
        const scheduleRemoval = async (remainingMs) => {
            const maxTimeout = 2147483647; // Batas maksimum `setTimeout`
            if (remainingMs > maxTimeout) {
                setTimeout(() => scheduleRemoval(remainingMs - maxTimeout), maxTimeout);
            } else {
                // Hapus role setelah waktu selesai
                setTimeout(async () => {
                    try {
                        const refreshedMember = await interaction.guild.members.fetch(targetUser.id);
                        if (refreshedMember.roles.cache.has(role.id)) {
                            await refreshedMember.roles.remove(role);

                            const embedRemove = new EmbedBuilder()
                                .setColor('#ff0000')
                                .setTitle('📤 Role Telah Dilepas')
                                .addFields(
                                    { name: '👤 User', value: `<@${targetUser.id}>`, inline: true },
                                    { name: '🎭 Role', value: `<@&${role.id}>`, inline: true },
                                    { name: '📅 Tanggal Dilepas', value: new Date().toLocaleString(), inline: false }
                                )
                                .setFooter({ text: 'Terima Kasih Telah Menggunakan Layanan!' });

                            await interaction.channel.send({ embeds: [embedRemove] });
                            await TempRoles.findOneAndDelete({ Guild: interaction.guild.id, User: targetUser.id, Role: role.id });
                        }
                    } catch (error) {
                        console.error(`Error saat menghapus role: ${error.message}`);
                    }
                }, remainingMs);
            }
        };

        // Atur penghapusan role dengan pembagian durasi
        scheduleRemoval(durationMs);
    },
};
