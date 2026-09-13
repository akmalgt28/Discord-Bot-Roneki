const color = require('../../colors.json');
const terminal = require('../../terminal');

const models = require('../../models/premium/verificationSchema');
const users = require('../../models/userSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        const { customId, guild, user, channel } = interaction;

        if (customId === 'modalVerification') {
            try {
                const code = interaction.fields.getTextInputValue('inputCode');

                const pengguna = await users.findOne({
                    Guild: guild.id,
                    User: user.id
                });

                const data = await models.findOne({ Guild: guild.id });

                if (data.Verified.includes(user.id)) {
                    return await interaction.reply({ content: `You have been verified on this **${guild.name}** server`, ephemeral: true });
                }

                if (code === pengguna.Key) {
                    const role = await guild.roles.cache.get(data.Role);

                    try {
                        await interaction.member.roles.add(role);
                    } catch (err) {
                        return await interaction.reply({ content: `An error occurred while trying to grant you the <@&${data.Role}> role. Please try again later!`, ephemeral: true })
                    }

                    await interaction.reply({ content: `You have been verified, and you can now access the server ${guild.name}`, ephemeral: true });

                    await models.updateOne({ Guild: guild.id }, { $push: { Verified: user.id } });
                } else {
                    await interaction.reply({ content: `**Oops**! The verification code you entered is invalid, please enter the correct code before it's too late!`, ephemeral: true });
                }
            } catch (error) {
                terminal.error(error);
                return await interaction.reply({ content: `An error has occurred while executing this command.`, ephemeral: true });
            }
        }
    }
}