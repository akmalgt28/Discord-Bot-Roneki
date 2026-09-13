const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const color = require('../../colors.json');
const questSchema = require('../../models/premium/questSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId.startsWith('JoinQuest')) {
            const questId = interaction.customId.split('_')[1];
            const quest = await questSchema.findOne({ messageId: questId });

            if (!quest) {
                return interaction.reply({ content: 'Quest not found.', ephemeral: true });
            }

            const member = await interaction.guild.members.fetch(interaction.user.id);

            if (!member.roles.cache.has(quest.role)) {
                return interaction.reply({ content: 'You do not have the required role to join this quest.', ephemeral: true });
            }

            const userIndex = quest.participants.indexOf(interaction.user.id);

            if (userIndex !== -1) {
                quest.participants.splice(userIndex, 1);
                await quest.save();

                const joinButton = new ButtonBuilder()
                    .setCustomId(`JoinQuest_${questId}`)
                    .setLabel('Join Quest')
                    .setStyle(ButtonStyle.Primary);

                const participantButton = new ButtonBuilder()
                    .setCustomId(`TotalParticipants_${questId}`)
                    .setLabel(`${quest.participants.length} Participants`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const seeParticipantsButton = new ButtonBuilder()
                    .setCustomId(`SeeParticipants_${questId}`)
                    .setLabel('Participants')
                    .setStyle(ButtonStyle.Primary);

                const updatedButtonRow = new ActionRowBuilder()
                    .addComponents(joinButton, participantButton, seeParticipantsButton);

                await interaction.message.edit({ components: [updatedButtonRow] });
                return interaction.reply({ content: 'You have left the quest.', ephemeral: true });
            }

            if (quest.participants.length >= quest.winnersCount) {
                return interaction.reply({ content: 'Sorry, the participant limit has been reached.', ephemeral: true });
            }

            quest.participants.push(interaction.user.id);
            await quest.save();

            const joinButton = new ButtonBuilder()
                .setCustomId(`JoinQuest_${questId}`)
                .setLabel('Join Quest')
                .setStyle(ButtonStyle.Primary);

            const participantButton = new ButtonBuilder()
                .setCustomId(`TotalParticipants_${questId}`)
                .setLabel(`${quest.participants.length} Participants`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);

            const seeParticipantsButton = new ButtonBuilder()
                .setCustomId(`SeeParticipants_${questId}`)
                .setLabel('Participants')
                .setStyle(ButtonStyle.Primary);

            const updatedButtonRow = new ActionRowBuilder()
                .addComponents(joinButton, participantButton, seeParticipantsButton);

            await interaction.message.edit({ components: [updatedButtonRow] });
            await interaction.reply({ content: 'You have successfully joined the quest!', ephemeral: true });
        }

        if (interaction.customId.startsWith('SeeParticipants')) {
            const questId = interaction.customId.split('_')[1];
            const quest = await questSchema.findOne({ messageId: questId });

            if (!quest) {
                return interaction.reply({ content: 'Quest not found.', ephemeral: true });
            }

            if (quest.participants.length === 0) {
                return interaction.reply({ content: 'No one has joined the quest yet.', ephemeral: true });
            }

            const perPage = 10;
            const totalParticipants = quest.participants.length;
            const totalPages = Math.ceil(totalParticipants / perPage);
            const currentPage = parseInt(interaction.customId.split('_')[2]) || 1;
            const displayMode = interaction.customId.split('_')[3] || 'mention';
            const start = (currentPage - 1) * perPage;
            const end = start + perPage;
            const participants = quest.participants.slice(start, end);

            const participantTags = await Promise.all(participants.map(async (participantId) => {
                const user = await interaction.client.users.fetch(participantId);
                return displayMode === 'mention' ? user.toString() : `**${user.globalName}** (\`${user.id}\`)`;
            }));

            const participantList = participantTags.map((tag, index) => `${start + index + 1}. ${tag}`).join('\n');

            const embed = new EmbedBuilder()
                .setColor(color.warning)
                .setAuthor({ name: 'Quest Participants', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Here are the participants for the quest:\n\n${participantList}\n\nTotal participants: **${totalParticipants}**`);

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`PreviousQuestParticipants_${questId}_${currentPage - 1}_${displayMode}`)
                    .setLabel('Previous')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === 1),
                new ButtonBuilder()
                    .setCustomId(displayMode === 'mention' ? `ShowQuestTags_${questId}` : `ShowQuestMention_${questId}`)
                    .setLabel(displayMode === 'mention' ? 'Show User Tags' : 'Show Mentions')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`NextQuestParticipants_${questId}_${currentPage + 1}_${displayMode}`)
                    .setLabel('Next')
                    .setEmoji('➡️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === totalPages)
            );

            await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
        }

        if (interaction.customId.startsWith('PreviousQuestParticipants') ||
            interaction.customId.startsWith('NextQuestParticipants') ||
            interaction.customId.startsWith('ShowQuestTags') ||
            interaction.customId.startsWith('ShowQuestMention')) {

            const questId = interaction.customId.split('_')[1];
            const quest = await questSchema.findOne({ messageId: questId });

            if (!quest) return interaction.reply({ content: 'Quest not found.', ephemeral: true });

            const perPage = 10;
            const totalParticipants = quest.participants.length;
            const currentPage = parseInt(interaction.customId.split('_')[2]) || 1;
            const displayMode = interaction.customId.startsWith('ShowQuestTags') ? 'tag' : 'mention';
            const start = (currentPage - 1) * perPage;
            const end = start + perPage;
            const participants = quest.participants.slice(start, end);

            const participantTags = await Promise.all(participants.map(async (participantId) => {
                const user = await interaction.client.users.fetch(participantId);
                return displayMode === 'mention' ? user.toString() : `**${user.globalName || user.username}** (\`${user.id}\`)`;
            }));

            const participantList = participantTags.map((tag, index) => `${start + index + 1}. ${tag}`).join('\n');

            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setDescription(`Here are the participants for the quest:\n\n${participantList}\n\nTotal participants: **${totalParticipants}**`);

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`PreviousQuestParticipants_${questId}_${currentPage - 1}_${displayMode}`)
                    .setLabel('Previous')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === 1),
                new ButtonBuilder()
                    .setCustomId(displayMode === 'mention' ? `ShowQuestTags_${questId}_${currentPage}` : `ShowQuestMention_${questId}_${currentPage}`)
                    .setLabel(displayMode === 'mention' ? 'Show User Tags' : 'Show Mentions')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`NextQuestParticipants_${questId}_${currentPage + 1}_${displayMode}`)
                    .setLabel('Next')
                    .setEmoji('➡️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === Math.ceil(totalParticipants / perPage))
            );

            await interaction.update({ embeds: [embed], components: [buttons] });
        }

    }
}