const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Request = require('../../Models/Request')

module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("request")
        .setDMPermission(false)
        .setDescription("Заполните анкету")
        .addStringOption(option =>
            option.setName("nick")
                .setDescription("Напишите позывной")
                .setRequired(true)
                .setMaxLength(20)
        )
        .addNumberOption(option =>
            option.setName("age")
                .setDescription("Напишите реальный возраст")
                .setRequired(true)
                .setMaxValue(100)
        )
        .addStringOption(option =>
            option.setName("steamid")
                .setDescription("Напишите ваш SteamID_64")
                .setRequired(true)
                .setMaxLength(17)
                .setMinLength(17)
        )
        .addAttachmentOption(option =>
            option.setName("biografy")
                .setDescription("Добавьте файл с квентой")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName("kventa")
                .setDescription("Является ли ваша заявка квентой?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("recall")
                .setDescription("Напишите, откуда вы узнали о сервере")
                .setRequired(true)
                .setMaxLength(1000)
        )
        //.addBooleanOption(option =>
        //    option.setName("originality")
        //        .setDescription("Является ли квента ваша квента особенной?")
        //        .setRequired(true)
        //),
        ,
    async execute(interaction) {
        const { options, guildId, member, user, guild } = interaction
        let channel
        if (guildId == "1054804473224110080") channel = guild.channels.cache.get("1060933504390676581") //1054804473224110080 lost chance
        else if (guildId == "1042147167588065330") channel = guild.channels.cache.get("1042495524219146261") //1042147167588065330 tlr

        const gameName = options.getString("nick")
        const age = options.getNumber("age")
        const SteamID = options.getString("steamid")
        const Bio = options.getAttachment("biografy")
        //const orig = options.getBoolean("originality")
        const kventa = options.getBoolean("kventa")
        const recall = options.getString("recall")
        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: "Позывной", value: gameName, inline: false },
                { name: "Возраст", value: `${age}`, inline: false },
                { name: "Discord Tag", value: `<@${user.id}>`, inline: false },
                { name: "SteamID64", value: SteamID, inline: true },
                { name: "Статус", value: "На рассмотрении", inline: true },
                //{ name: "Особенности есть?", value: `${orig}`, inline: true},
                { name: "Квента?", value: `${kventa}`, inline: true},
                { name: "Откуда узнали о проекте", value: `${recall}`, inline: true}
            )
            .setTimestamp()

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("Request-accept").setLabel("✅ Одобрить").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("Request-deceline").setLabel("⛔ Отказать").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("Request-process").setLabel("👋 Вызвать на собеседование").setStyle(ButtonStyle.Primary),
        )
        const testToRu = /[a-zA-Z0-9]/;
        const format = ["doc", "docx", "pdf"]
            if(testToRu.test(embed.data.fields[0].value) === true) return interaction.reply({ content: "Позывной должен быть на русском и без цифр", ephemeral: true });
            if(!SteamID.startsWith('7656119')) return interaction.reply({content: "Не верный формат steamid", ephemeral: true });
            if(!format.includes(Bio.name.split(/\.(?=[^\.]+$)/)[1])) return interaction.reply({content: "Не верный формат файла квенты/заявки", ephemeral: true });
        try {
            let rls = member.roles.cache.map(r => r.id)
            rls.pop()
            Request.findOne({ DisID: user.id, GuildID: guildId }, async (err,obj) => {
            if(err) throw err
            
            if (!obj) {
                let m = await guild.channels.cache.get("1060933504390676581").send({ content: `<@${user.id}>`,embeds: [embed], components: [buttons], files: [Bio], fetchReply: true })
                await Request.create({
                    GuildID: guildId, 
                    MessageID: m.id,
                    DisID: user.id, 
                    SteamID: SteamID,
                    Roles: rls,
                    Bio: Bio.url,
                    Check: false
                })
                await interaction.reply({ content: "Заявка была успешно отправлена, для получения ответа, удостоверьтесь, что получения сообщений от пользователей вне списка друзей, разрешены для получения.", ephemeral: true })
            } else {
                if (obj.Check == false) return interaction.reply({ content: "Заявка на рассмотрении", ephemeral: true})
                let m = await guild.channels.cache.get("1060933504390676581").send({ content: `<@${user.id}>`,embeds: [embed], components: [buttons], files: [Bio], fetchReply: true })
                await Request.updateOne({DisID: user.id, GuildID: guildId},{
                    DisID: user.id,
                    SteamID: SteamID,
                    MessageID: m.id,
                    Roles: rls,
                    Bio: Bio.url,
                    Check: false
                })
                await interaction.reply({ content: "Заявка была успешно отправлена, для получения ответа, удостоверьтесь, что получения сообщений от пользователей вне списка друзей, разрешены для получения.", ephemeral: true })
            }
        })
        } catch (err) {
            console.log(err)
        }
    }
}