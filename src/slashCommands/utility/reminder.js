const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const color = require('../../colors.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('🤖 Set a reminder')
        .addStringOption(option => option
            .setName('message')
            .setDescription('Message to remind you')
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('time')
            .setDescription('Time for when to remind')
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('format')
            .setDescription('Choose the format for the time')
            .setRequired(true)
            .addChoices(
                { name: 'seconds', value: 1 },
                { name: 'minutes', value: 60 },
                { name: 'hours', value: 60 * 60 }
            )
        )
        .setDMPermission(false),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const { options, user, guild } = interaction;
        const member = await client.users.fetch(user.id);
        const icon = guild.iconURL({ dynamic: true })

        try {
            const msg = options.getString('message');
            const time = options.getNumber('time');
            const format = options.getNumber('format');
            const timer = time * format * 1000;

            let currentTime = new Date().getTime();
            let on = new Date(currentTime + timer);

            await user.send('This is a test to check if you **Allow direct messages from server members**.');

            setTimeout(async () => {
                try {
                    const embed = new EmbedBuilder()
                        .setColor(color.primary)
                        .setAuthor({ name: `Reminder System`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`> ${msg}`)
                        .setFooter({ text: `This reminder is set on server ${guild.name}`, iconURL: icon })

                    await member.send({ embeds: [embed] });
                } catch (error) {
                    console.error('Failed to send the reminder DM:', error);
                    return;
                }
            }, timer);

            interaction.editReply({ content: `I'll remind you later on <t:${Math.floor(on / 1000)}:R>` });
        } catch (error) {
            await interaction.editReply({ content: `I cannot send you a DM. Please enable \`Allow direct messages from server members\` in your **Privacy Settings** and try again.\n\nIf you don't know how, please visit [Blocking & Privacy Settings](https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings)`, ephemeral: true });
        }
    }
}