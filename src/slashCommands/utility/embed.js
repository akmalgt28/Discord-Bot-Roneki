const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const color = require('../../colors.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('💭 Send an embed message from JSON file.')
        .addAttachmentOption(option => option
            .setName('file')
            .setDescription('The JSON file to send as an embed.')
            .setRequired(true)
        )
        .setDMPermission(false),
    developer: true,
    async execute(interaction) {
        const { options } = interaction;
        const file = options.getAttachment('file');

        try {
            const fileURL = file.url;
            const fileResponse = await fetch(fileURL);
            const fileContent = await fileResponse.text();
            const res = JSON.parse(fileContent);

            const embedsData = res.embeds;  // Mendapatkan semua embed dari file JSON
            const embeds = [];
            const text = res.content || '';

            // Loop untuk setiap item di embedsData
            embedsData.forEach(data => {
                const embed = new EmbedBuilder();

                if (data.title) embed.setTitle(data.title || '');
                if (data.color) embed.setColor(data.color || color.default);
                if (data.timestamp) embed.setTimestamp(new Date(data.timestamp) || Date.now());
                if (data.url) embed.setURL(data.url && data.url !== '' ? data.url : null);  // Validasi URL

                if (data.description) embed.setDescription(data.description || '');

                if (data.author) {
                    embed.setAuthor({
                        name: data.author.name || '',
                        iconURL: data.author.icon_url || null,  // Validasi icon_url
                        url: data.author.url && data.author.url !== '' ? data.author.url : null // Validasi URL
                    });
                }

                if (data.thumbnail) embed.setThumbnail(data.thumbnail.url || null);  // Validasi thumbnail URL
                if (data.image) embed.setImage(data.image.url || null);  // Validasi image URL
                if (data.footer) {
                    embed.setFooter({
                        text: data.footer.text || '',
                        iconURL: data.footer.icon_url || null  // Validasi icon_url
                    });
                }

                if (data.fields) {
                    data.fields.forEach(field => {
                        embed.addFields({ name: field.name || '', value: field.value || '', inline: field.inline || false });
                    });
                }

                embeds.push(embed);  // Tambahkan embed yang sudah di-build ke array
            });

            await interaction.deferReply();
            await interaction.deleteReply();

            // Kirim embed sekaligus
            await interaction.channel.send({ content: text, embeds: embeds });
        } catch (error) {
            console.error(error);
            return;
        }
    }
};
