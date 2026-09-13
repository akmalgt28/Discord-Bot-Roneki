const { ContextMenuCommandBuilder, ApplicationCommandType, AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('View Profile')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    async execute(interaction) {
        const { user, guild } = interaction;

        await interaction.deferReply();

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