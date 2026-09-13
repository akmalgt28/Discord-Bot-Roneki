const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('❓ See the profile of an user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user that you want to see')
        )
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply();

        const { options, guild } = interaction;
        const user = options.getUser('user') || interaction.user;


        const member = await guild.members.fetch(user.id);
        const status = member.presence ? member.presence.status : 'offline';

        const buffer = await profileImage(user.id, {
            squareAvatar: false,
            removeAvatarFrame: false,
            overwriteBadges: true,
            badgesFrame: true,
            disableProfileTheme: false,
            moreBackgroundBlur: true,
            removeAvatarFrame: false,
            presenceStatus: status
        });

        await interaction.editReply({ files: [new AttachmentBuilder(buffer)] });
    }
}