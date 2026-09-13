const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attachment')
        .setDescription('📎 Kirim file ke channel.')
        .addAttachmentOption(option => 
            option.setName('file')
                .setDescription('File yang ingin dikirim')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options } = interaction;
        const attachment = options.getAttachment('file');

        // Cek apakah file ada
        if (!attachment) {
            return interaction.reply({ content: '⚠️ Tidak ada file yang ditemukan.', ephemeral: true });
        }

        // Kirim file ke channel
        await interaction.channel.send({ files: [attachment.url] });
        await interaction.reply({ content: '✅ File berhasil dikirim!', ephemeral: true });
    }
};
