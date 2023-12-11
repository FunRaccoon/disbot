const { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const ticketSchema = require('../../Models/Ticket')
const TicketSetup = require('../../Models/TicketSetup')

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } = PermissionFlagsBits
        const ticketId = Math.floor(Math.random() * 9000) + 10000

        if (!interaction.isButton()) return

        //if(interaction.guild.id == "1013344004743635045") {
        //console.log(interaction.guild.id)
        //return interaction.reply({content: "Бот не оплачен и не будет работать.", ephemeral: true})
        //}

        const data = await TicketSetup.findOne({ GuildID: guild.id })

        if (!data)
            return;

        if (!data.Buttons.includes(customId))
            return

        if (!guild.members.me.permissions.has(ManageChannels))
            interaction.reply({ content: "У меня нет разрешений на это", ephemeral: true })


        try {
            await guild.channels.create({
                name: `${customId}-${member.user.username}-${ticketId}`,
                type: ChannelType.GuildText,
                parent: data.Category,
                permissionOverwrites: [
                    {
                        id: data.Everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory]
                    },
                    {
                        id: data.Handlers,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    }
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MembersID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                    Claimed: false,
                })

                const embed = new EmbedBuilder()
                    .setTitle(`${guild.name} - Тикет: ${customId}`)
                    .setDescription("Наша команда свяжется с вами в ближайшее время. Пожалуйста, опишите вашу проблему.")
                    .setFooter({ text: `${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('Закрыть тикет').setStyle(ButtonStyle.Primary).setEmoji('❌'),
                    new ButtonBuilder().setCustomId('lock').setLabel('Заблокировать тикет').setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
                    new ButtonBuilder().setCustomId('unlock').setLabel('Разблокировать тикет').setStyle(ButtonStyle.Success).setEmoji('🔓'),
                    new ButtonBuilder().setCustomId('claim').setLabel('Забрать тикет').setStyle(ButtonStyle.Secondary).setEmoji('🆙'),
                )

                if (customId == "Жалоба на игрока") {
                    await channel.send({
                        embeds: ([embed]),
                        components: [
                            button
                        ]
                    })
                    await channel.send(`Пример репорта:\nВаш позывной: Певец\nПозывной нарушителя (если знаете): Пророк\nПодробное описание ситуации: текст\nДата и время произошедшего: 06.06.2023\nДоказательства нарушения: https://www.youtube.com/watch?v=xvFZjo5PgG0\nТайм-код нарушения на доказательствах: -`)
                } else {
                    await channel.send({
                        embeds: ([embed]),
                        components: [
                            button
                        ]
                    })
                }


                return interaction.reply({ content: "Тикет успешно создан.", ephemeral: true })
            })
        } catch (err) {
            console.log(err)
        }
    }
}