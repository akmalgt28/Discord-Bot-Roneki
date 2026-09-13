const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-roles-menu')
        .setDescription('🔧 Admin: Set roles untuk dropdown menu.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Pilih channel untuk menampilkan dropdown menu')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Judul untuk menu role')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Deskripsi custom untuk embed')
                .setRequired(true)) // Optional description field
        // Add role options up to 10
        .addRoleOption(option => 
            option.setName('role1')
                .setDescription('Pilih role pertama')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role2')
                .setDescription('Pilih role kedua')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role3')
                .setDescription('Pilih role ketiga')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role4')
                .setDescription('Pilih role keempat')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role5')
                .setDescription('Pilih role kelima')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role6')
                .setDescription('Pilih role keenam')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role7')
                .setDescription('Pilih role ketujuh')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role8')
                .setDescription('Pilih role kedelapan')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role9')
                .setDescription('Pilih role kesembilan')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role10')
                .setDescription('Pilih role kesepuluh')
                .setRequired(false)),
    developer: true,
    async execute(interaction) {
        const { options, member } = interaction;

        // Check if user has ManageRoles permission
        if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        // Collect roles from options (up to 10 roles)
        const roles = [];
        for (let i = 1; i <= 10; i++) {
            const role = options.getRole(`role${i}`);
            if (role) roles.push(role);
        }

        // Ensure there's at least one role
        if (roles.length === 0) {
            return interaction.reply({ content: '⚠️ Setidaknya pilih satu role.', ephemeral: true });
        }

        // Create select menu that allows only 1 role selection
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-roles')
            .setPlaceholder('Pilih role yang kamu inginkan')
            .setMinValues(1)  // Minimum values set to 1 (mandatory to pick one)
            .setMaxValues(1)  // Ensure only 1 role can be selected
            .addOptions(
                roles.map(role => ({
                    label: role.name,
                    value: role.id
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const title = options.getString('title'); // Get title from options
        const customDescription = options.getString('description') || 'Silakan pilih role yang kamu inginkan dari dropdown di bawah ini.'; // Custom description or default

        // Create fields for each role
        const roleFields = roles.map(role => ({
            name: role.name, // Display role name
            value: `<@&${role.id}>`, // Mention role
            inline: true // Set fields to be inline
        }));

        const embed = new EmbedBuilder()
            .setColor('#7452f1')
            .setTitle(`Pilih Role ${title} Kamu`)
            .setDescription(customDescription) // Use custom description
            .addFields(roleFields); // Add fields to the embed

        // Get the channel option
        const channel = options.getChannel('channel');

        // Send the embed and select menu to the specified channel
        await channel.send({ embeds: [embed], components: [row] });

        // Acknowledge the command interaction
        await interaction.reply({ content: '✅ Menu roles telah dikirim ke channel yang dipilih.', ephemeral: true });
    }
};
