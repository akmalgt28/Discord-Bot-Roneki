const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const models = require('../../models/premium/verificationSchema');
const color = require('../../colors.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification')
        .setDescription('✅ Configure your verification system using captcha')
        .addSubcommand(command => command
            .setName('setup')
            .setDescription('✅ Setup the verification system for this server')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Specified role will be given to users who are verified.')
                .setRequired(true)
            )
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('Specified channel will be your verify channel')
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
            )
            .addStringOption(option => option
                .setName('content')
                .setDescription('Specified message will be included in the verification embed.')
                .setMinLength(1)
                .setMaxLength(1000)
            )
        )
        .addSubcommand(command => command
            .setName('disable')
            .setDescription('❎ Disable the verification system for this server')
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return await interaction.reply({ content: "Sorry, you do not have **Manage Guild** permissions to use this command.", ephemeral: true });
        }

        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        const role = options.getRole('role');
        const channel = options.getChannel('channel') || interaction.channel;
        const message = options.getString('content') || `Hello , Welcome to the **${guild.name}** server.\nBefore access the **${guild.name}** server, please verify yourself by pressing the **verification** button below.`;

        const data = await models.findOne({ Guild: interaction.guild.id });

        const embed = new EmbedBuilder();

        if (sub === 'setup') {
            if (data) {
                return await interaction.reply({ content: `You already have a verification system set up! Do \`/verification disable\` to cancel the verification system...`, ephemeral: true });
            } else {
                await models.create({
                    Guild: interaction.guild.id,
                    Role: role.id,
                    Channel: channel.id,
                    Message: 'empty',
                    Verified: []
                });

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('verify')
                            .setLabel('Start Verification')
                            .setStyle(ButtonStyle.Primary)
                    );

                embed
                    .setColor(color.default)
                    .setThumbnail(guild.iconURL())
                    .setTitle('Verification System')
                    .setDescription(message)
                    .setFooter({ text: 'We want to make sure that you are truly human' })

                interaction.reply({ content: `Panel verification has been send on ${channel}`, ephemeral: true });
                const msg = await channel.send({ embeds: [embed], components: [button] });

                await models.updateOne({ Guild: interaction.guild.id }, { $set: { Message: msg.id } });
            }
        } else {
            if (!data) {
                return await interaction.reply({ content: `The verification system has not been set up, there is nothing to delete...`, ephemeral: true });
            } else {

                await models.deleteMany({ Guild: interaction.guild.id });
                const message = await client.channels.cache.get(data.Channel).messages.fetch(data.Message);
                await message.delete();

                await interaction.reply({ content: `Your verification system has been disabled.`, ephemeral: true });

            }
        }
    }
};