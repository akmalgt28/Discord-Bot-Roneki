const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const { customId, guild, message, user, channel } = interaction;

        if (customId === 'newConfession') {
            const modal = new ModalBuilder()
                .setCustomId('modalNewConfession')
                .setTitle('New Confession');

            const inputConfession = new TextInputBuilder()
                .setCustomId('inputConfession')
                .setLabel('Confession')
                .setPlaceholder('Write your confession here')
                .setMinLength(1)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const inputImage = new TextInputBuilder()
                .setCustomId('inputImage')
                .setLabel('Image URL')
                .setPlaceholder('Image URL')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const inputAnonymously = new TextInputBuilder()
                .setCustomId('inputAnonymously')
                .setLabel('Anonymously?')
                .setPlaceholder('Yes/No (default: Yes)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const confession = new ActionRowBuilder().addComponents(inputConfession);
            const image = new ActionRowBuilder().addComponents(inputImage);
            const anonymously = new ActionRowBuilder().addComponents(inputAnonymously);

            modal.addComponents(confession, image, anonymously);

            await interaction.showModal(modal);
        }

        if (customId === 'replyConfession') {
            const modal = new ModalBuilder()
                .setCustomId('modalReplyConfession')
                .setTitle('Reply This Confession');

            const inputReply = new TextInputBuilder()
                .setCustomId('inputReply')
                .setLabel('Reply')
                .setPlaceholder('Write your reply here')
                .setMinLength(1)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const inputImageReply = new TextInputBuilder()
                .setCustomId('inputImageReply')
                .setLabel('Image URL')
                .setPlaceholder('Image URL')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const inputAnonymouslyReply = new TextInputBuilder()
                .setCustomId('inputAnonymouslyReply')
                .setLabel('Anonymously?')
                .setPlaceholder('Yes/No (default: Yes)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const reply = new ActionRowBuilder().addComponents(inputReply);
            const imageReply = new ActionRowBuilder().addComponents(inputImageReply);
            const anonymouslyReply = new ActionRowBuilder().addComponents(inputAnonymouslyReply);

            modal.addComponents(reply, imageReply, anonymouslyReply);

            await interaction.showModal(modal);
        }
    }
}