const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

const color = require('../../colors.json');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maintenance')
        .setDescription('🔒 Toggle maintenance mode')
        .addStringOption(option => option
            .setName('mode')
            .setDescription('Enable or disable maintenance mode')
            .setRequired(true)
            .addChoices(
                { name: 'Enable', value: 'enable' },
                { name: 'Disable', value: 'disable' }
            )
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.editReply({
                content: `You do not have permission to use this command. You need the "Manage Messages" permission.`
            });
        }

        const { options, user, guild } = interaction;
        const mode = options.getString('mode');

        const newChannel = '💀﹒eternal-prison';

        const rembed = new EmbedBuilder()
            .setColor(color.default);

        if (mode === 'enable') {
            try {
                await guild.roles.everyone.setPermissions([
                    PermissionFlagsBits.AddReactions,
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.ChangeNickname,
                    PermissionFlagsBits.CreateInstantInvite,
                    PermissionFlagsBits.CreatePrivateThreads,
                    PermissionFlagsBits.CreatePublicThreads,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.RequestToSpeak,
                    PermissionFlagsBits.SendVoiceMessages,
                    PermissionFlagsBits.Speak,
                    PermissionFlagsBits.Stream,
                    PermissionFlagsBits.UseApplicationCommands,
                    PermissionFlagsBits.UseEmbeddedActivities,
                    PermissionFlagsBits.UseExternalEmojis,
                    PermissionFlagsBits.UseExternalSounds,
                    PermissionFlagsBits.UseExternalStickers,
                    PermissionFlagsBits.UseSoundboard,
                ], `${user.globalName} Kalian akan dipenjara tanpa ampun selama server dijarah oleh monarch dan raja iblis. Siapkan diri untuk merasakan kesengsaraan abadi yang tak terhindarkan, di mana setiap detik terasa seperti siksaan yang tak berujung!`);

                let maintenanceChannel = guild.channels.cache.find(channel => channel.name === newChannel);

                if (!maintenanceChannel) {
                    maintenanceChannel = await guild.channels.create({
                        name: newChannel,
                        type: ChannelType.GuildText,
                        reason: `${user.globalName} Kalian akan dipenjara tanpa ampun selama server dijarah oleh monarch dan raja iblis. Siapkan diri untuk merasakan kesengsaraan abadi yang tak terhindarkan, di mana setiap detik terasa seperti siksaan yang tak berujung!`,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone.id,
                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages
                                ],
                                deny: [
                                    PermissionFlagsBits.MentionEveryone
                                ]
                            }
                        ],
                        topic: `${guild.name} Kalian akan dipenjara tanpa ampun selama server dijarah oleh monarch dan raja iblis. Siapkan diri untuk merasakan kesengsaraan abadi yang tak terhindarkan, di mana setiap detik terasa seperti siksaan yang tak berujung!`,
                        nsfw: false,
                        rateLimitPerUser: 0
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor(color.default)
                    .setTitle(`${interaction.guild.name} Sedang Dijarah Oleh Monarch`)
                    .setDescription('Kalian akan dipenjara tanpa ampun selama server dijarah oleh monarch dan raja iblis. Siapkan diri untuk merasakan kesengsaraan abadi yang tak terhindarkan, di mana setiap detik terasa seperti siksaan yang tak berujung!')
                    .setImage(config.image.maintenance)
                    .setFooter({ text: 'HAHAHAHAHAHAHAHA' })
                    .setTimestamp();

                await maintenanceChannel.send({ embeds: [embed] }).then(msg => msg.pin());

                rembed.setDescription(`Maintenance mode is successfully activated. We have created a new channel ${maintenanceChannel}.`);

                await interaction.editReply({ embeds: [rembed] });
            } catch (error) {
                console.log(`Eror mas!`, error);
                return;
            }
        }

        if (mode === 'disable') {
            await guild.roles.everyone.setPermissions([
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.ChangeNickname,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.CreateInstantInvite,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.CreatePublicThreads,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.RequestToSpeak,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.SendVoiceMessages,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.UseEmbeddedActivities,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalSounds,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.UseSoundboard,
                PermissionFlagsBits.ViewChannel
            ], `${user.globalName} has disabled maintenance mode. Server ${guild.name} is back to normal, thank you.`);

            const oldChannel = guild.channels.cache.find(channel => channel.name === newChannel);

            if (oldChannel) {
                await oldChannel.delete().catch(console.error);
            }

            rembed.setDescription(`Maintenance mode has been successfully disabled. Channel \`${newChannel}\` has been deleted.`);

            await interaction.editReply({ embeds: [rembed] });
        }
    }
}