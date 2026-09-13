const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionsBitField, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const color = require('../../colors.json');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Add to Sticker')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return await interaction.reply({ content: 'You must have the **Manage Guild Expressions** access permission and your role must have the **Manage Guild Expressions** permission to perform this action.', ephemeral: true });
        }

        const { channel, guild } = interaction;

        async function kirim(message, edit) {
            if (!edit) {
                await interaction.reply({ content: message, ephemeral: true });
            } else {
                await interaction.editReply({ content: message });
            }
        }

        await kirim('Upload your stickers...')

        const message = await channel.messages.fetch(interaction.targetId);
        const sticker = message.stickers.first();

        if (!sticker) return await kirim('There are no stickers in this message...', true);

        if (sticker.url.endsWith('.json')) return await kirim(`That's not a valid sticker file...`, true);

        var error;
        const created = await guild.stickers.create({
            name: sticker.name,
            description: sticker.description || sticker.name,
            tags: sticker.tags,
            file: sticker.url
        }).catch(async err => {
            error = true;
            if (err.code == 30039)
                return await kirim(`Looks like you've reached the **Sticker Limit** on this server...`, true);
            else
                return await kirim('An unknown error has occurred...', true);
        });

        if (error) return;
        await kirim(`Successfully added sticker with name [${created.name}](${created.url})`, true);
    }
}