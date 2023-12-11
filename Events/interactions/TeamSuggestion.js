/*const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const TSuggestion = require('../../Models/TSuggestion')
const fs = require('fs')

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const { member, guildId, customId, message, guild } = interaction
        
        if (!interaction.isButton()) return;

        if (customId == "teamsuggest-accept" || customId == "teamsuggest-deceline" || customId == "teamsuggest-process") {
            //if (!member.roles.cache.some(r => r.id == 1073228799975628890))
            ///return interaction.reply({ content: "У вас нет разрешений на это", ephemeral: true })

            TSuggestion.findOne({ MessageID: message.id, GuildID: guildId }, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({ content: "Данные не найдены", ephemeral: true })

                const embed = message.embeds[0]

                if (!embed)
                    return interaction.reply({ content: "Эмбид не найдены", ephemeral: true })

                await guild.members.fetch()
                let memberId = guild.members.cache.get(data.DisID)
                let embedOsn;

                switch (customId) {
                    case "teamsuggest-accept":
                        if (embed.data.fields[5].value == "Одобрено") return interaction.reply({ content: "Заявка уже одобрена", ephemeral: true })
                        embed.data.fields[5] = { name: "Статус", value: "Одобрено", inline: true }
                        const acceptedEmbed = EmbedBuilder.from(embed).setColor("Green").setFooter({ text: `Одобрил: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        embedOsn = new EmbedBuilder()
                            .setTitle("Заявка одобрена ✅")
                            .setDescription("Добро пожаловать на сервер.")
                            .setTimestamp()
                            .setColor("Green")

                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        await message.edit({ embeds: [acceptedEmbed], components: [] })
                        await memberId.send({ embeds: [embedOsn] })
                        //await guild.channels.cache.get("1016723207518171267").send({ content: `<@378845259389730816>\n${embed.data.fields[3].value}` }).catch(() => interaction.reply({ content: 'Пользователь не может принять сообщение от бота', ephemeral: true }))
                        await interaction.reply({ content: "Заявка одобрена", ephemeral: true })
                        await data.deleteOne({DisID: memberId})
                        break
                    case "teamsuggest-deceline":
                        if (embed.data.fields[5].value == "Отказано") return interaction.reply({ content: "Заявка уже отклонена", ephemeral: true })
                        embed.data.fields[5] = { name: "Статус", value: "Отказано", inline: true }
                        const decelineEmbed = EmbedBuilder.from(embed).setColor("Red").setFooter({ text: `Отказал: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })

                        embedOsn = new EmbedBuilder()
                            .setTitle("Заявка отклонена ⛔")
                            .setDescription(`Заявку отклонил: <@${member.id}>`)
                            .setTimestamp()
                            .setColor("Red")
                        //.setFooter()

                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        await message.edit({ embeds: [decelineEmbed], components: [] })
                        await memberId.send({ embeds: [embedOsn] }).catch(() => interaction.reply({ content: 'Пользователь не может принять сообщение от бота', ephemeral: true }))
                        await interaction.reply({ content: "Заявка отклонена", ephemeral: true })
                        await data.deleteOne({DisID: memberId})
                        break
                    case "teamsuggest-process":
                        //if(embed.data.fields[5].value == "Приглашён на собеседование") return interaction.reply({content: "Игрока уже вызвали на собеседование", ephemeral:true})
                        embed.data.fields[5] = { name: "Статус", value: "Приглашён на собеседование", inline: true }
                        const processEmbed = EmbedBuilder.from(embed).setColor("Blurple").setFooter({ text: `Вызвал: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })

                        embedOsn = new EmbedBuilder()
                            .setTitle("Вас пригласили на собеседование👋")
                            .setDescription(`Перейдите в канал -> <#1013373321330561045>`)
                            .setTimestamp()
                            .setColor("Blurple")

                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        await message.edit({ embeds: [processEmbed] })
                        await memberId.send({ embeds: [embedOsn] }).catch(() => interaction.reply({ content: 'Пользователь не может принять сообщение от бота', ephemeral: true }))
                        await interaction.reply({ content: "Игрок вызван на собеседование", ephemeral: true })
                        break
                }
            })
        }
    }
}*/