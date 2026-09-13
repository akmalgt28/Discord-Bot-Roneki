const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('animated-avatar')
        .setDescription('Animasi avatar')
        .addAttachmentOption(option => option
            .setName('avatar')
            .setDescription('The avatar')
            .setRequired(true)
        ),
    
    async execute(interaction, client) {
        const { options } = interaction;
        const avatar = options.getAttachment('avatar');

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
                .setColor("#5865F2")  // Warna Blurple Discord
                .setDescription(message);

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }

        try {
            // Menunda respons awal agar bot punya waktu untuk proses lebih lama
            await interaction.deferReply({ ephemeral: true });

            // Cek apakah file yang diupload adalah GIF
            if (avatar.contentType !== "image/gif") {
                return await sendMessage('⚠️ Gunakan format gif untuk avatar');
            }

            // Set avatar baru untuk bot
            await client.user.setAvatar(avatar.url);

            // Kirim pesan sukses
            await sendMessage('✅ Aku sudah mengupload avatar baru!');
        } catch (error) {
            console.error(error);
            await sendMessage(`⚠️ Error: \`${error.message}\``);
        }
    }
};
