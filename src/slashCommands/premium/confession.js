const { SlashCommandBuilder, ChannelType } = require('discord.js');

const Anonymous = require('../../models/premium/anonymousSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confession')
        .setDescription('🎭 Set up the confession system in your server.')
        .addSubcommand(sub => sub
            .setName('setup')
            .setDescription('🎭 Set up the confession system in your server.')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel where the confessions will be sent.')
                .addChannelTypes(
                    ChannelType.GuildText
                )
                .setRequired(false)
            )
        )
        .setDMPermission(false),
    developer: true,
    async execute(interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        const channel = options.getChannel('channel') || interaction.channel;

        if (sub === 'setup') {
            const data = await Anonymous.findOne({ guildID: guild.id });

            if (data) {
                data.channelID = channel.id;
                await data.save();

                return interaction.reply({ content: `The confession system's channel has been updated to ${channel}.`, ephemeral: true });
            } else {
                await new Anonymous({
                    guildID: guild.id,
                    channelID: channel.id,
                    users: []
                }).save();

                return interaction.reply({ content: `The confession system has been set up in ${channel}.`, ephemeral: true });
            }
        }
    }
}