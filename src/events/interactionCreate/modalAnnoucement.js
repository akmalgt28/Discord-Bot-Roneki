const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        const { customId, guild, user, channel } = interaction;

        if (customId === 'modalAnnouncement') {
            const color = interaction.fields.getTextInputValue('inputColor');

            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                return interaction.reply({ content: 'Invalid color hex. Example: #FF0000', ephemeral: true });
            }

            const message = interaction.fields.getTextInputValue('inputMessage');

            const announcementID = config.channel.announcement;
            const channel = await guild.channels.fetch(announcementID);

            const embed = new EmbedBuilder()
                .setColor(color)
                .setDescription(message);

            const everyone = await channel.send('@everyone');
            setTimeout(() => everyone.delete(), 500);

            await channel.send({ embeds: [embed] });

            interaction.reply({ content: 'Announcement has been sent!', ephemeral: true });
        }
    }
}