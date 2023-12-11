const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { createTranscript } = require('discord-html-transcripts')
const TicketSetup = require('../../Models/TicketSetup')
const ticketSchema = require('../../Models/Ticket')

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction
        const { ManageChannels, SendMessages } = PermissionFlagsBits

        if (!interaction.isButton()) return

        if (!["close", "lock", "unlock", "claim"].includes(customId)) return

        const docs = await TicketSetup.findOne({ GuildID: guild.id })

        if (!docs) return

        //if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers))
        //return interaction.reply({ content: "У меня нет разрешений на это", ephemeral: true })

        const embed = new EmbedBuilder().setColor("Aqua")

        ticketSchema.findOne({ ChannelID: channel.id, GuildID: guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) return

            const fetchedMember = await guild.members.cache.get(data.MembersID)

            switch (customId) {
                case "close":
                    if (data.Closed == true)
                        return interaction.reply({ content: "Тикет уже удаляется...", ephemeral: true })


                    await guild.members.fetch()
                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        filename: `ID_${data.TicketID}.html` //${guild.members.cache.get(data.MembersID[0]).user.username}-
                    })

                    await ticketSchema.updateOne({ ChannelID: channel.id, GuildID: guild.id }, { Closed: true })

                    const transcriptEmbed = new EmbedBuilder()
                        .setTitle(`Тип жалобы: ${data.Type}\nId: ${data.TicketID}`)
                        .setFooter({ text: guild.members.cache.get(data.MembersID[0]).user.tag, iconURL: guild.members.cache.get(data.MembersID[0]).displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()

                    const transcriptProcess = new EmbedBuilder()
                        .setTitle('Сохранение тикета...')
                        .setDescription("Тикет будет закрыт через 10 секунд, включите получения личных сообщений для получения доступа к копии тикета")
                        .setColor('Red')
                        .setFooter({ text: guild.members.cache.get(data.MembersID[0]).user.tag, iconURL: guild.members.cache.get(data.MembersID[0]).displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()

                    const res = await guild.channels.cache.get(docs.Transcripts).send({
                        embeds: [transcriptEmbed],
                        files: [transcript],
                    })
                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: false })
                    })
                    channel.send({ embeds: [transcriptProcess] })

                    setTimeout(function () {
                        (guild.members.cache.get(data.MembersID[0])).send({
                            embeds: [transcriptEmbed.setDescription(`Ваша копия тикета приложена к данному сообщению.`)], //`Доступ к копии тикета: ${res.url}`)]
                            files: [transcript]
                        }).catch(() => console.log('Не могу отправить стенограмму в прямые сообщения'))
                        channel.delete()
                    }, 10000);
                    await ticketSchema.deleteOne({ ChannelID: channel.id, GuildID: guild.id })
                    return interaction.reply({ content: `Тикет успешно закрывается`, ephemeral: true })

                case "lock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "У вас нет разрешений на это", ephemeral: true })

                    if (data.Locked == true)
                        return interaction.reply({ content: "Тикет уже заблокирован", ephemeral: true })

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: true })
                    embed.setDescription("Тикет был успешно заперт")

                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: false })
                    })

                    return interaction.reply({ embeds: [embed] })

                case "unlock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "У вас нет разрешений на это", ephemeral: true })

                    if (data.Locked == false)
                        return interaction.reply({ content: "Тикет уже разблокирован", ephemeral: true })

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: false })
                    embed.setDescription("Тикет был успешно разблокирован")

                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: true })
                    })

                    return interaction.reply({ embeds: [embed] })

                case "claim":
                    if (!member.roles.cache.has('1062407505851981836'))
                        return interaction.reply({ content: "У вас нет разрешений на это", ephemeral: true })

                    if (data.Claimed == true)
                        return interaction.reply({ content: `Тикет уже взял <@${data.ClaimedBy}>`, ephemeral: true })

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Claimed: true, ClaimedBy: member.id })

                    embed.setDescription(`Тикет был успешно взят ${member}`)

                    interaction.reply({ embeds: [embed] })

                    break
            }
        })
    }
}
