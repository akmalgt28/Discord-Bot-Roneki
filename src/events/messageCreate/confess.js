const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Schema = require('../../models/premium/anonymousSchema');
const color = require('../../colors.json');
const config = require('../../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const { guild, channel } = message;
        if (message.author.bot) return;

        try {
            const data = await Schema.findOne({ guildID: guild.id });

            if (data && channel.id === data.channelID) {
                const content = message.content;

                const embed = new EmbedBuilder()
                    .setColor(color.primary)
                    .setAuthor({ name: `NEW CONFESSION`, iconURL: guild.iconURL({ dynamic: true }) })
                    .setDescription(content)
                    .setTimestamp();

                await message.delete();

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('newConfession')
                        .setLabel('Confession')
                        .setEmoji(config.emoji.send)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`replyConfession`)
                        .setLabel('Reply')
                        .setEmoji(config.emoji.reply)
                        .setStyle(ButtonStyle.Primary)
                );

                await channel.send({ embeds: [embed], components: [button] });
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }
}