const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder } = require('discord.js');

const color = require('../../colors.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete messages in bulk')
        .addSubcommand(command => command
            .setName('any')
            .setDescription('🧹 Delete any message type')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('bots')
            .setDescription('🧹 Delete messages that were sent by bots')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('embeds')
            .setDescription('🧹 Delete messages that contain embeds')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('humans')
            .setDescription('🧹 Delete messages that were sent by humans (non-bots)')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('images')
            .setDescription('🧹 Delete messages that contain images')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('invites')
            .setDescription('🧹 Delete messages that contain invites')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('keyword')
            .setDescription('🧹 Delete messages that contain a specific keyword')
            .addStringOption(option => option
                .setName('keyword')
                .setDescription('Keyword to delete messages for.')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('🧹 Number of messages to delete.')
                .setRequired(false)
            )
        )
        .addSubcommand(command => command
            .setName('links')
            .setDescription('🧹 Delete messages that contain links')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('mentions')
            .setDescription('🧹 Delete messages that contain mentions')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('text')
            .setDescription('🧹 Delete messages that contain text (non-images/files)')
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete. Limit 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('user')
            .setDescription('🧹 Delete messages that were sent by a specific user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('User to delete messages from.')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Number of messages to delete.')
                .setRequired(false)
            )
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return await interaction.editReply({
                content: `You do not have permission to use this command. You need the "Manage Messages" permission.`
            });
        }

        const { options, channel } = interaction;
        const sub = options.getSubcommand();
        const count = options.getInteger('count');

        if (sub === 'any') {
            const messages = await channel.bulkDelete(count, true);
            const text = messages.size > 1 ? 'messages' : 'message';

            if (messages.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${messages.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }

        } else if (sub === 'bots') {
            const messages = await channel.messages.fetch({ limit: count });
            const bots = messages.filter(message => message.author.bot);

            const deleted = await channel.bulkDelete(bots, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'embeds') {
            const messages = await channel.messages.fetch({ limit: count });
            const embeds = messages.filter(message => message.embeds.length);

            const deleted = await channel.bulkDelete(embeds, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'humans') {
            const messages = await channel.messages.fetch({ limit: count });
            const humans = messages.filter(message => !message.author.bot);

            const deleted = await channel.bulkDelete(humans, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'images') {
            const messages = await channel.messages.fetch({ limit: count });
            const images = messages.filter(message => message.attachments.size);

            const deleted = await channel.bulkDelete(images, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'invites') {
            const messages = await channel.messages.fetch({ limit: count });
            const invites = messages.filter(message => message.content.includes('discord.gg/'));

            const deleted = await channel.bulkDelete(invites, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'keyword') {
            const keyword = options.getString('keyword');
            const messages = await channel.messages.fetch({ limit: count });
            const found = messages.filter(message => message.content.includes(keyword));

            const deleted = await channel.bulkDelete(found, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'links') {
            const messages = await channel.messages.fetch({ limit: count });
            const links = messages.filter(message => message.content.includes('http://') || message.content.includes('https://'));

            const deleted = await channel.bulkDelete(links, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'mentions') {
            const messages = await channel.messages.fetch({ limit: count });
            const mentions = messages.filter(message => message.mentions.users.size);

            const deleted = await channel.bulkDelete(mentions, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (sub === 'text') {
            const messages = await channel.messages.fetch({ limit: count });
            const kata = messages.filter(message => message.content);

            const deleted = await channel.bulkDelete(kata, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else {
            const user = options.getUser('user');
            const messages = await channel.messages.fetch({ limit: count });
            const found = messages.filter(message => message.author.id === user.id);

            const deleted = await channel.bulkDelete(found, true);
            const text = deleted.size > 1 ? 'messages' : 'message';

            if (deleted.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`Found and purged **${deleted.size}** ${text}.`);

                return await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(color.danger)
                    .setDescription(`Unable to find any messages.`);

                return await interaction.editReply({ embeds: [embed] });
            }
        }
    }
}