const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announcement')
        .setDescription('Create an announcement message for your server.')
        .setDMPermission(false),
    developer: false,
    async execute(interaction, client) {
        const { options } = interaction;

        const modal = new ModalBuilder()
            .setCustomId('modalAnnouncement')
            .setTitle('Create an announcement');

        const inputColor = new TextInputBuilder()
            .setCustomId('inputColor')
            .setLabel('Color')
            .setPlaceholder('Color of the embed. Example: #FF0000')
            .setStyle(TextInputStyle.Short);

        const inputMessage = new TextInputBuilder()
            .setCustomId('inputMessage')
            .setLabel('Message')
            .setPlaceholder('What do you want to announce?')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const color = new ActionRowBuilder().addComponents(inputColor);
        const message = new ActionRowBuilder().addComponents(inputMessage);

        modal.addComponents(color, message);

        await interaction.showModal(modal);
    }
}