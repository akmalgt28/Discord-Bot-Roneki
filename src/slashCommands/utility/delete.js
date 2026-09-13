const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-message')
        .setDescription('❌ Hapus pesan dalam rentang tertentu di channel berdasarkan ID pesan.')
        .addStringOption(option => 
            option.setName('channel_id')
                .setDescription('ID channel tempat pesan berada')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('message_id_from')
                .setDescription('ID pesan awal dalam rentang yang ingin dihapus')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('message_id_to')
                .setDescription('ID pesan akhir dalam rentang yang ingin dihapus')
                .setRequired(true)
        ),
    developer: true,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true }); // Tunda respons untuk menghindari kesalahan waktu

        const channelId = interaction.options.getString('channel_id');
        const messageIdFrom = interaction.options.getString('message_id_from');
        const messageIdTo = interaction.options.getString('message_id_to');

        try {
            // Mengambil channel berdasarkan ID
            const channel = await interaction.guild.channels.fetch(channelId);
            if (!channel) {
                return interaction.followUp({ content: '❌ Channel tidak ditemukan.' });
            }

            // Mengambil pesan dalam jumlah tertentu untuk mencari rentang ID
            let messages = await channel.messages.fetch({ limit: 100 });
            messages = messages.filter(msg => 
                msg.id >= messageIdFrom && msg.id <= messageIdTo
            );

            if (messages.size === 0) {
                return interaction.followUp({ content: '❌ Tidak ada pesan dalam rentang tersebut.' });
            }

            // Menghapus pesan dalam rentang
            for (const message of messages.values()) {
                await message.delete();
            }

            await interaction.followUp({ content: `✅ Berhasil menghapus ${messages.size} pesan dalam rentang ID yang ditentukan di channel <#${channelId}>.` });
        } catch (error) {
            console.error('Error saat menghapus pesan:', error);
            await interaction.followUp({ content: '❌ Gagal menghapus pesan. Pastikan ID channel dan pesan valid.' });
        }
    }
};
