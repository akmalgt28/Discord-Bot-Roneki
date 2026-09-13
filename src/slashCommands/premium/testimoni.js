const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js');

const color = require('../../colors.json');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testimoni')
        .setDescription('📦 Submit testimonial for specific channels')
        .addIntegerOption(option => option
            .setName('price')
            .setDescription('Price of the product')
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName('product')
            .setDescription('Select the product type')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addAttachmentOption(option => option
            .setName('media')
            .setDescription('Upload media for testimonial')
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('buyer')
            .setDescription('Select the buyer')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('category')
            .setDescription('Select the category')
            .setRequired(false)
        )
        .setDMPermission(false),
    developer: true,
    async execute(interaction) {
        const { options, guild } = interaction;
        const price = options.getInteger('price');
        const harga = `Rp ${price.toLocaleString('id-ID')}`;
        const product = options.getChannel('product');
        const media = options.getAttachment('media');
        const buyer = options.getUser('buyer');
        const category = options.getString('category');

        const testimoniChannel = config.channel.testimoni;
        const channel = guild.channels.cache.get(testimoniChannel) || interaction.channel;

        try {
            const embed = new EmbedBuilder()
                .setColor(color.primary)
                .setTitle('__Order Completed__')
                .setDescription(`> **Produk:** ${product}\n> **Harga: ${harga}**`)
                .setImage(media.url)
                .setFooter({ text: `Terima kasih telah berbelanja di ${guild.name}` });

            if (category) {
                embed.setDescription(`> **Produk:** ${product} **| ${category}**\n> **Harga: ${harga}**\n> **Pembeli:** ${buyer}`)
            }

            if (buyer) {
                embed.setDescription(`> **Produk:** ${product}\n> **Harga: ${harga}**\n> **Pembeli:** ${buyer}`)
            }

            if (category && buyer) {
                embed.setDescription(`> **Produk:** ${product} **| ${category}**\n> **Harga: ${harga}**\n> **Pembeli:** ${buyer}`)
            }

            channel.send({ embeds: [embed] });
            await interaction.reply({ content: `Testimoni berhasil dikirim pada channel ${channel}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return;
        }
    }
}