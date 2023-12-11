const { PermissionFlagsBits, EmbedBuilder, ModalBuilder, InteractionType, TextInputBuilder, TextInputStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js')
const Request = require('../../Models/Request')
const { CFToolsClientBuilder, SteamId64, CFToolsId, Authorization, LoginCredentials, } = require('cftools-sdk')

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const { member, guildId, customId, message, guild } = interaction

        if (!interaction.isButton()) return;

        if (customId == "Request-accept" || customId == "Request-deceline" || customId == "Request-process") {

            Request.findOne({ MessageID: message.id, GuildID: guildId }, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({ content: "Данные не найдены", ephemeral: true })

                const embed = message.embeds[0]

                if (!embed)
                    return interaction.reply({ content: "Эмбид не найдены", ephemeral: true })

                await guild.members.fetch()
                let memberId = guild.members.cache.get(data.DisID)
                let embedOsn;
                let roleremove;
                let roleadd;
                let nickname;
                const cfclient = new CFToolsClientBuilder()
                    .withServerApiId('d410feeb-2edd-4819-be36-ddc661e28738') //server api id
                    .withCredentials('64379e89a6386cd481cd08a5', 'nThR9uJbVDM4R3TkxQO/JMKiH8I+1Ae9LEcswXYawug=') //app id, secret
                    .build();



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

                if (guildId == "1054804473224110080") { //1054804473224110080 lost chance
                    roleremove = ["1054804473224110081"] //гость
                    roles = ['1097191602625187923', '1054804473240879207', '1054804473224110088'] // группировки, сталкерр
                    //whitelistpath = WLLS
                    channelids = '1073229612592660530'
                    nickname = "Сталкер | "
                }
                else if (guildId == "1042147167588065330") { //1042147167588065330 tlr
                    roleremove = ['1042626341008314479']
                    roles = ['1042776411611615315', '1079447311941382204']
                    //whitelistpath = WLTLR
                    channelids = '1042497069014859858'//////////////////// Основатель | Певец
                    nickname = "• Житель Метро | "
                }

                switch (customId) {
                    case "Request-accept":
                        embed.data.fields[4] = { name: "Статус", value: "Одобрено", inline: true }
                        embed.data.timestamp
                        const acceptedEmbed = EmbedBuilder.from(embed).setColor("Green").setFooter({ text: `Одобрил: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        embedOsn = new EmbedBuilder()
                            .setTitle("Заявка одобрена ✅")
                            .setDescription("Добро пожаловать на сервер.")
                            .setTimestamp()
                            .setColor("Green")

                        //const attach = new AttachmentBuilder(embed.data.fields[5].value)
                        //await interaction.editReply({ files: [attach] })
                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        await message.edit({ embeds: [acceptedEmbed], components: [] })
                        try {
                            await memberId.send({ embeds: [embedOsn] })
                        }
                        catch (err) {
                            return interaction.reply({ content: 'Пользователь не может принять сообщение от бота', ephemeral: true })
                        }
                        await memberId.setNickname(`${nickname}` + `${embed.data.fields[0].value}`)
                        await memberId.roles.remove(roleremove)
                        if(embed.data.fields[5] == "Анкета") {
                            roles.push('1125145752092540928')
                        }
                        else {roles.push('1125146608691073085')}
                        await memberId.roles.add(roles)

                        //cfclient.getWhitelist({
                        //    id: CFToolsId.of(`${data.SteamID}`)
                        //}).t
                        await Request.updateOne({ MessageID: message.id, GuildID: guildId }, {
                            Check: true
                        })
                        //interaction.reply({content: "Заявка одобрена и добавлена в whitelist", ephemeral: true})
                        //return cfclient.getPlayerDetails({id: `${data.SteamID}`}).then(i => {console.log(i)})
                        return cfclient.putWhitelist({
                            id: SteamId64.of(`${data.SteamID}`),
                            comment: "Added for Bot"
                        }).catch(console.log("Added to wl"))
                    case "Request-deceline":
                        if (embed.data.fields[4].value == "Отказано") return interaction.reply({ content: "Заявка уже отклонена", ephemeral: true })
                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        return interaction.showModal(modal)
                    case "Request-process":
                        embed.data.fields[4] = { name: "Статус", value: "Приглашён на собеседование", inline: true }
                        const processEmbed = EmbedBuilder.from(embed).setColor("Blurple").setFooter({ text: `Вызвал: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })

                        embedOsn = new EmbedBuilder()
                            .setTitle("Вас пригласили на собеседование👋")
                            .setDescription(`Перейдите в канал -> <#${channelids}>, проверящий: <@${member.id}>`)
                            .setTimestamp()
                            .setColor("Blurple")

                        if (memberId == undefined) interaction.reply({ content: "Пользователь не распознан", ephemeral: true })
                        await message.edit({ embeds: [processEmbed] })
                        try {
                            await memberId.send({ embeds: [embedOsn] })
                        }
                        catch (err) {
                            return interaction.reply({ content: 'Пользователь не может принять сообщение от бота', ephemeral: true })
                        }
                        return interaction.reply({ content: "Игрок вызван на собеседование", ephemeral: true })
                }
            })
        }
    }
}