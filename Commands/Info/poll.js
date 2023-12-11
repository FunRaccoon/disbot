const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js')
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDMPermission(false)
        .setDescription("Создаёт опрос и отправляет его в определенный канал")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("title")
                .setDescription("Заголовок опроса")
                .setMaxLength(256)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Текст опроса")
                .setMaxLength(4096)
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Куда вы хотите отправить опрос?")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(interaction) {
        const { options } = interaction

        const channel = options.getChannel("channel")                     
        const description = options.getString("description")
        const title = options.getString("title")

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        try {
            const m = await channel.send({ embeds: [embed] })
            await m.react("✅")
            await m.react("❌")
            await interaction.reply({ content: "Опрос был успешно отправлен на канал", ephemeral: true })
        } catch (err) {                   
            console.log(err)
        }
    }
}