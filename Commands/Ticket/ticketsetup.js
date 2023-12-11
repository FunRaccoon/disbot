const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js')
const TicketSetup = require('../../Models/TicketSetup')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketsetup")
        .setDescription("Создать тикет систему")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Выберите канал, где должны быть созданы тикеты")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName("category")
                .setDescription("Выберите категорию, где следует создавать тикеты")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName("transcripts")
                .setDescription("Выберите канал, куда должны быть отправлены копии тикетов")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option =>
            option.setName("handlers")
                .setDescription("Выберите роль обработчиков тикетов")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("everyone")
                .setDescription("Пометить роль everyone")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Установите описание для embed тикетов")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("firstbutton")
                .setDescription("Формат: (имя кнопки, Emoji)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("secondbutton")
                .setDescription("Формат: (имя кнопки, Emoji)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("thirdbutton")
                .setDescription("Формат: (имя кнопки, Emoji)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("fourthbutton")
                .setDescription("Формат: (имя кнопки, Emoji)")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guild, options } = interaction

        try {
            const channel = options.getChannel("channel")
            const category = options.getChannel("category")
            const transcripts = options.getChannel("transcripts")

            const handlers = options.getRole("handlers")
            const everyone = options.getRole("everyone")

            const description = options.getString("description")
            const firstbutton = options.getString("firstbutton").split(",")
            const secondbutton = options.getString("secondbutton").split(",")
            const thirdbutton = options.getString("thirdbutton").split(",")
            const fourthbutton = options.getString("fourthbutton").split(",")

            const emoji1 = firstbutton[1]
            const emoji2 = secondbutton[1]
            const emoji3 = thirdbutton[1]
            const emoji4 = fourthbutton[1]

            await TicketSetup.findOneAndUpdate(
                { GuildID: guild.id },
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlers.id,
                    Everyone: everyone.id,
                    Desctiprion: description,
                    Buttons: [firstbutton[0], secondbutton[0], thirdbutton[0], fourthbutton[0]]
                },
                {
                    new: true,
                    upsert: true,
                }
            )

            const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId(firstbutton[0]).setLabel(firstbutton[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
                new ButtonBuilder().setCustomId(secondbutton[0]).setLabel(secondbutton[0]).setStyle(ButtonStyle.Secondary).setEmoji(emoji2),
                new ButtonBuilder().setCustomId(thirdbutton[0]).setLabel(thirdbutton[0]).setStyle(ButtonStyle.Primary).setEmoji(emoji3),
                new ButtonBuilder().setCustomId(fourthbutton[0]).setLabel(fourthbutton[0]).setStyle(ButtonStyle.Success).setEmoji(emoji4),
            )

            const embed = new EmbedBuilder()
                .setDescription(description)    


            await guild.channels.cache.get(channel.id).send({
                embeds: ([embed]),
                components: [
                    button
                ]
            })
            interaction.reply({ content: "Система тикетов была создана", ephemeral: true })
        } catch (err) {
            console.log(err)
            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Что-то пошло не так...")

            return interaction.reply({ embeds: [errEmbed], ephemeral: true })
        }
    }
}