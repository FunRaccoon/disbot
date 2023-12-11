const { PermissionFlagsBits, EmbedBuilder, ModalBuilder, InteractionType, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')
const ClanRequest = require('../../Models/ClanRequest')

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const { member, guildId, customId, message, guild } = interaction
        
        if (!interaction.isButton()) return;

        if (customId == "clanRequest-accept" || customId == "clanRequest-deceline") {
            ClanRequest.findOne({ MessageID: message.id, GuildID: guildId  }, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({ content: "Данные не найдены", ephemeral: true })

                const embed = message.embeds[0]

                if (!embed)
                    return interaction.reply({ content: "Эмбид не найдены", ephemeral: true })

                await guild.members.fetch()
                let memberId = guild.members.cache.get(data.DisID)
                let embedOsn;

                const modal = new ModalBuilder()
                    .setCustomId('decelineModal')
                    .setTitle('Помощник')
                    .addComponents([
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('cause')
                                .setLabel('Опишите причину отказа для игрока')
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder("Причина")
                                .setRequired(true)
                        )
                    ])
                switch (customId) {
                    case "clanRequest-accept":
                        embed.data.fields[4] = { name: "Статус", value: "Одобрено", inline: true }
                        const acceptedEmbed = EmbedBuilder.from(embed).setColor("Green").setFooter({ text: `Одобрил: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        embedOsn = new EmbedBuilder()
                            .setTitle("Заявка одобрена ✅")
                            .setDescription("Приятной игры.")
                            .setTimestamp()
                            .setColor("Green")
                            .setFooter("Worst of Worsts")

                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        await message.edit({ embeds: [acceptedEmbed], components: [] })
                        await memberId.send({ embeds: [embedOsn] })
                        await memberId.setNickname(`${embed.data.fields[0].value} | ${embed.data.user.username}`)
                        await suggestionSchema.updateOne({MessageID: message.id, GuildID: guildId}, {
                            Checked: true
                        })
                        break
                    case "clanRequest-deceline":
                        if (embed.data.fields[4].value == "Отказано") return interaction.reply({ content: "Заявка уже отклонена", ephemeral: true })
                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        await interaction.showModal(modal)
                        break
                }
            })
        }
    }
}