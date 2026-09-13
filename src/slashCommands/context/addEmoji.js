const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionsBitField, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const color = require('../../colors.json');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Add to Emoji')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return await interaction.editReply({ content: 'You must have the **Manage Guild Expressions** access permission and your role must have the **Manage Guild Expressions** permission to perform this action.' });
        }


        const { channel, guild } = interaction;

        let message = await channel.messages.fetch(interaction.targetId);

        let emojiRegex = /<(a?):(\w{2,}):(\d{10,})>/;
        let emoji = message.content.match(emojiRegex);

        if (!emoji) {
            return await interaction.editReply({
                content: `Invalid emoji. Please use this command on messages containing custom emojis.`
            });
        }

        let id = emoji.pop();
        let name = emoji.pop();
        let animated = emoji.pop() === 'a'

        let url = `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`

        try {
            let newEmoji = await guild.emojis.create({
                attachment: url,
                name: name
            });

            const embed = new EmbedBuilder()
                .setColor(color.success)
                .setDescription(`Successfully added ${newEmoji} emoji, with name \`${name}\``);

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            interaction.editReply({ content: `You cannot add this emoji because you have reached the emoji limit on this server.` });
        }
    }
}