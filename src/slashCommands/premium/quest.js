const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { parseDuration, pickWinners } = require('../../utils/giveawayHelpers');
const color = require('../../colors.json');
const questSchema = require('../../models/premium/questSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quest')
        .setDescription('📜 Start a quest giveaway for your server')
        .addStringOption(opt => opt
            .setName('reward')
            .setDescription('The reward for the quest')
            .setRequired(true)
        )
        .addRoleOption(opt => opt
            .setName('role')
            .setDescription('The role that can join the quest')
            .setRequired(true)
        )
        .addIntegerOption(opt => opt
            .setName('participants')
            .setDescription('The number of participants for the quest')
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName('durations')
            .setDescription('The duration of the quest')
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName('message')
            .setDescription('The message for the quest')
            .setRequired(false)
        )
        .addUserOption(opt => opt
            .setName('host')
            .setDescription('The host of the quest')
            .setRequired(false)
        )
        .addAttachmentOption(opt => opt
            .setName('image')
            .setDescription('The image for the quest')
            .setRequired(false)
        )
        .addAttachmentOption(opt => opt
            .setName('thumbnail')
            .setDescription('The thumbnail for the quest')
            .setRequired(false)
        )
        .addChannelOption(opt => opt
            .setName('channel')
            .setDescription('The channel for the quest will be sent')
            .setRequired(false)
        )
        .setDMPermission(false),
    developer: true,
    async execute(interaction) {
        const { options, guild, user } = interaction;

        try {
            const reward = options.getString('reward');
            const role = options.getRole('role');
            const participants = parseInt(options.getInteger('participants'));

            const duration = options.getString('durations');
            const durationMs = parseDuration(duration);

            if (isNaN(durationMs)) {
                return interaction.reply({ content: 'Durasi tidak valid.', ephemeral: true });
            }

            const pesan = options.getString('message') || `Hey, there's a new quest. Come on, hurry up and join the quest before the slots are full.`;
            const host = options.getUser('host') || user;
            const image = options.getAttachment('image');
            const thumbnail = options.getAttachment('thumbnail');
            const channel = options.getChannel('channel') || interaction.channel;

            const endTime = Date.now() + durationMs;

            const embed = new EmbedBuilder()
                .setColor(color.primary)
                .setTitle(`📜 New Quest — ${reward}`)
                .setDescription(`${pesan}\n\nRequired Roles: ${role}\nMax Participants: **${participants}**\nHosted by: ${host}\nEnded At: <t:${Math.floor(endTime / 1000)}:R> (<t:${Math.floor(endTime / 1000)}:f>)`);

            if (image) embed.setImage(image.url);
            if (thumbnail) embed.setThumbnail(thumbnail.url);

            const message = await channel.send({ embeds: [embed] });

            await interaction.reply({ content: `Quest has been started in ${channel}`, ephemeral: true });

            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`JoinQuest_${message.id}`)
                    .setLabel('Join Quest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`TotalParticipants_${message.id}`)
                    .setLabel('0 Participants')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`SeeParticipants_${message.id}`)
                    .setLabel('Participants')
                    .setStyle(ButtonStyle.Primary)
            );

            await message.edit({ components: [button] });

            const data = {
                reward: reward,
                pesan: pesan,
                role: role.id,
                winnersCount: participants,
                duration: durationMs,
                endTime: endTime,
                hostId: host.id,
                gambar: image ? image.url : null,
                thumbnail: thumbnail ? thumbnail.url : null,
                messageId: message.id,
                channelId: channel.id,
                guildId: guild.id,
                participants: []
            }

            const newQuest = new questSchema(data);
            await newQuest.save();

            setTimeout(async () => {
                const updatedQuest = await questSchema.findOne({ messageId: message.id });
                if (!updatedQuest || updatedQuest.ended) return;

                const winnersMentions = updatedQuest.participants.map(p => `<@${p}>`).join(', ');
                const text = `**🎊 Quest Has Ended 🎊**`;

                const ended = new EmbedBuilder()
                    .setColor(color.danger)
                    .setTitle(`📜 Reward Quest — ${reward}`)
                    .setDescription(`${pesan}\n\nHosted by: ${host}\nWinners: ${winnersMentions}`);

                if (image) ended.setImage(`${image.url}`);
                if (thumbnail) ended.setThumbnail(`${thumbnail.url}`);

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`JoinQuest_${message.id}`)
                        .setLabel('Join Quest')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId(`TotalParticipants_${message.id}`)
                        .setLabel(`${updatedQuest.participants.length} Participants`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId(`SeeParticipants_${message.id}`)
                        .setLabel('Participants')
                        .setStyle(ButtonStyle.Primary)
                );

                await message.edit({ content: text, embeds: [ended], components: [button] });

                const teks = `**🎊 Congratulations to the winners of the quest ${reward}**.\n${winnersMentions}`;

                const eChannel = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Congratulations to the winners of the quest [${reward}](https://discord.com/channels/${guild.id}/${channel.id}/${message.id}).\n${winnersMentions}`);

                await channel.send({ content: teks, embeds: [eChannel] });

                await questSchema.findOneAndUpdate({ messageId: message.id }, { ended: true });
            }, durationMs);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'An error occurred while processing this command', ephemeral: true });
        }
    }
}