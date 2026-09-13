const { SlashCommandBuilder, AttachmentBuilder, ChannelType } = require('discord.js');

const { addNewLines } = require('../../utils/addNewLine');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review')
        .setDescription('⭐ Send a review of product')
        .addStringOption(option => option
            .setName('rating')
            .setDescription('Rating of product')
            .addChoices(
                { name: '⭐', value: '1' },
                { name: '⭐⭐', value: '2' },
                { name: '⭐⭐⭐', value: '3' },
                { name: '⭐⭐⭐⭐', value: '4' },
                { name: '⭐⭐⭐⭐⭐', value: '5' }
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('message')
            .setDescription('Review message')
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName('product')
            .setDescription('Select the product type')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction) {
        const { options, guild, user } = interaction;
        const rating = options.getString('rating');
        const message = options.getString('message');
        const product = options.getChannel('product');

        const ratingChannel = config.channel.rating;
        const channel = guild.channels.cache.get(ratingChannel) || interaction.channel;

        try {
            await interaction.deferReply({ ephemeral: true });

            const regular = path.join(__dirname, '../../fonts/Poppins-Regular.ttf');
            registerFont(regular, { family: 'Poppins' });

            const semiBold = path.join(__dirname, '../../fonts/Poppins-SemiBold.ttf');
            registerFont(semiBold, { family: 'Poppins Semi Bold' });

            const semiBoldItalic = path.join(__dirname, '../../fonts/Poppins-SemiBoldItalic.ttf');
            registerFont(semiBoldItalic, { family: 'Poppins Semi Italic' });

            const bold = path.join(__dirname, '../../fonts/Poppins-Bold.ttf');
            registerFont(bold, { family: 'Poppins Bold' });

            const notoEmoji = path.join(__dirname, '../../fonts/NotoColorEmoji-Regular.ttf');
            registerFont(notoEmoji, { family: 'Noto Color Emoji' });

            const imagePath = path.join(__dirname, "../../img/canvas.png");
            const image = await loadImage(imagePath);

            const canvas = createCanvas(image.width, image.height);
            const context = canvas.getContext("2d");

            context.drawImage(image, 0, 0, image.width, image.height);

            const foto = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
            const avatar = await loadImage(foto);

            // Make the avatar a circle
            const avatarX = 100; // X position of the avatar
            const avatarY = 90; // Y position of the avatar
            const avatarSize = 350; // Avatar diameter

            context.save(); // Save current state before clipping
            context.beginPath();
            context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true); // Create a circle path
            context.closePath();
            context.clip(); // Clip to the circle

            // Draw the avatar within the circle
            context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

            context.restore(); // Restore state to draw outside the clip
            // Avatar is now a circle

            // Draw invoice
            context.font = '120px Poppins Bold';
            context.fillStyle = '#F5F5F5';
            context.fillText(user.globalName, 500, 250);
            // Draw invoice

            // Draw invoice
            context.font = '80px Poppins Semi Italic';
            context.fillStyle = '#7F7F7F';
            context.fillText(`${product.name}`, 500, 350);
            // Draw invoice

            context.font = "80px Poppins";
            context.fillStyle = "#F5F5F5";
            context.fillText(addNewLines(`${message}`, 85), 70, 700);

            const makeRating = (rate = 0) => {
                Array.from({ length: 5 }).forEach((_, index) => {
                    context.font = "150px Poppins Bold";
                    context.fillStyle = "#7F7F7F"; // Grey color
                    if (index < rate) {
                        context.fillStyle = "#FFD700"; // Gold color
                    }
                    context.fillText("★", 2900 + index * 200, 250);
                });
            };

            makeRating(rating);

            const attachment = new AttachmentBuilder(canvas.toBuffer(), {
                name: "rating.png",
            });

            const stars = '⭐️'.repeat(rating);
            const text = `**${guild.name} mendapatkan ${stars} dari ${user.globalName}**`

            await channel.send({ content: text, files: [attachment] });

            await interaction.editReply({ content: `Terima kasih telah memberikan kami review, kamu bisa melihat pada channel ${channel}` });
        } catch (error) {
            console.error(error);
            return;
        }
    }
}
