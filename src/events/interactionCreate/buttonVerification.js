const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputStyle, AttachmentBuilder, ModalBuilder, TextInputBuilder } = require('discord.js');

const { CaptchaGenerator } = require('captcha-canvas');

const color = require('../../colors.json');
const terminal = require('../../terminal');

const models = require('../../models/premium/verificationSchema');
const users = require('../../models/userSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const { customId, guild, user } = interaction;

        if (customId === 'verify') {
            try {
                if (interaction.guild === null) return;

                const data = await models.findOne({ Guild: guild.id });

                const verificationUsers = await users.findOne({
                    Guild: guild.id,
                    User: user.id
                });

                if (!data) return await interaction.reply({ content: `The verification system has been disabled on this server.`, ephemeral: true });

                if (data.Verified.includes(user.id)) return await interaction.reply({ content: `You have been verified, and you can now access the server ${guild.name}`, ephemeral: true });

                let letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let result = Math.floor(Math.random() * letter.length);
                let result2 = Math.floor(Math.random() * letter.length);
                let result3 = Math.floor(Math.random() * letter.length);
                let result4 = Math.floor(Math.random() * letter.length);
                let result5 = Math.floor(Math.random() * letter.length);
                let result6 = Math.floor(Math.random() * letter.length);

                const cap = letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5] + letter[result6];

                const captcha = new CaptchaGenerator()
                    .setDimension(150, 450)
                    .setCaptcha({ font: "Sans", text: `${cap}`, size: 60, color: "#FEE75C" })
                    .setDecoy({ total: 15, opacity: 0.5, size: 50, font: "Sans" })
                    .setTrace({ size: 3, color: "#FEE75C" })

                const buffer = captcha.generateSync();

                const attachment = new AttachmentBuilder(buffer, { name: `captcha.png` });

                const embed = new EmbedBuilder()
                    .setColor(color.default)
                    .setAuthor({ name: `Hello 👋, Are you human? Let's find out!` })
                    .setDescription(`Please type the captcha below to be able to access **${guild.name}** server.`)
                    .setImage('attachment://captcha.png')
                    .addFields({ name: `Additional Notes`, value: `- Type out the traced colored characters from left to right.\n- Ignore the decoy characters spread-around.\n- You don't have to respect characters cases.` })
                    .setFooter({ text: `Verification Period: 2 minutes` });

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('captchaAnswer')
                            .setLabel('Answer')
                            .setStyle(ButtonStyle.Success)
                    );

                await interaction.reply({ embeds: [embed], components: [button], files: [attachment], ephemeral: true });

                setTimeout(async () => {
                    const updateData = await models.findOne({ Guild: guild.id });

                    if (updateData && !updateData.Verified.includes(user.id)) {
                        const expiredEmbed = new EmbedBuilder()
                            .setColor(color.danger)
                            .setDescription('**Verification Expired**\n**Oops**! an error occurred while trying to verify you.\nYour verification code has expired, you need to press the **verify** button again!');

                        await interaction.editReply({ embeds: [expiredEmbed], components: [], files: [], ephemeral: true });
                    }
                }, 120000);

                if (verificationUsers) {
                    await users.deleteMany({
                        Guild: guild.id,
                        User: user.id
                    });

                    await users.create({
                        Guild: guild.id,
                        User: user.id,
                        Key: cap
                    });
                } else {
                    await users.create({
                        Guild: guild.id,
                        User: user.id,
                        Key: cap
                    });
                }
            } catch (error) {
                console.error(error);
                return;
            }
        }

        if (customId === 'captchaAnswer') {
            const modal = new ModalBuilder()
                .setTitle('Captcha Answer')
                .setCustomId('modalVerification');

            const inputCode = new TextInputBuilder()
                .setCustomId('inputCode')
                .setLabel('Answer')
                .setPlaceholder('Input captcha code')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const answerInput = new ActionRowBuilder().addComponents(inputCode);
            modal.addComponents(answerInput);

            await interaction.showModal(modal);
        }
    }
}