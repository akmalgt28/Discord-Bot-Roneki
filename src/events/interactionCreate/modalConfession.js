const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, AttachmentBuilder, ThreadAutoArchiveDuration, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const color = require('../../colors.json');
const config = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        const { customId, guild, user, channel } = interaction;

        if (customId === 'modalNewConfession') {
            const confession = interaction.fields.getTextInputValue('inputConfession');
            const image = interaction.fields.getTextInputValue('inputImage');
            let anonymously = interaction.fields.getTextInputValue('inputAnonymously');

            if (!anonymously) {
                anonymously = 'yes';
            }

            anonymously = anonymously.toLowerCase();

            if (anonymously === 'yes') {
                interaction.deferReply();
                interaction.deleteReply();

                const embed = new EmbedBuilder()
                    .setColor(color.primary)
                    .setAuthor({ name: `NEW CONFESSION`, iconURL: guild.iconURL({ dynamic: true }) })
                    .setDescription(confession)
                    .setTimestamp();

                if (image) {
                    embed.setImage(image);
                }

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
            } else if (anonymously === 'no') {
                interaction.deferReply();
                interaction.deleteReply();

                const embed = new EmbedBuilder()
                    .setColor(color.primary)
                    .setAuthor({ name: `NEW CONFESSION FROM ${user.globalName.toUpperCase()}`, iconURL: user.avatarURL({ dynamic: true }) })
                    .setDescription(confession)
                    .setTimestamp();

                if (image) {
                    embed.setImage(image);
                }

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
            } else {
                await interaction.reply({ content: 'Invalid input anonymously. Make sure the answer is **Yes** or **No**!', ephemeral: true });
            }
        }

        if (customId === 'modalReplyConfession') {
            const reply = interaction.fields.getTextInputValue('inputReply');
            const image = interaction.fields.getTextInputValue('inputImageReply');
            let anonymously = interaction.fields.getTextInputValue('inputAnonymouslyReply');

            if (!anonymously) {
                anonymously = 'yes';
            }

            anonymously = anonymously.toLowerCase();

            if (anonymously === 'yes') {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setAuthor({ name: `REPLY CONFESSION`, iconURL: guild.iconURL({ dynamic: true }) })
                    .setDescription(reply)
                    .setTimestamp();

                if (image) {
                    embed.setImage(image);
                }

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('newConfession')
                        .setLabel('Confession')
                        .setEmoji(config.emoji.send)
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`replyConfession`)
                        .setLabel('Reply')
                        .setEmoji(config.emoji.reply)
                        .setStyle(ButtonStyle.Success)
                );

                await interaction.reply({ embeds: [embed], components: [button] });
            } else if (anonymously === 'no') {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setAuthor({ name: `REPLY CONFESSION FROM ${user.globalName.toUpperCase()}`, iconURL: user.avatarURL({ dynamic: true }) })
                    .setDescription(reply)
                    .setTimestamp();

                if (image) {
                    embed.setImage(image);
                }

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('newConfession')
                        .setLabel('Confession')
                        .setEmoji(config.emoji.send)
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`replyConfession`)
                        .setLabel('Reply')
                        .setEmoji(config.emoji.reply)
                        .setStyle(ButtonStyle.Success)
                );

                await interaction.reply({ embeds: [embed], components: [button] });
            } else {
                await interaction.reply({ content: 'Invalid input anonymously. Make sure the answer is **Yes** or **No**!', ephemeral: true });
            }
        }
    }
}