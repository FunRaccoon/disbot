const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const ClanRequest = require('../../Models/ClanRequest')

module.exports = {
    team: "WoW",
    data: new SlashCommandBuilder()
        .setName("clanrequest")
        .setDMPermission(false)
        .setDescription("Заполните анкету")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Напишите название клана")
                .setRequired(true)
                .setMaxLength(20)
        )
        .addStringOption(option =>
            option.setName("tag")
                .setDescription("Напишите тэг клана")
                .setRequired(true)
                .setMaxLength(5)
        )
        .addNumberOption(option =>
            option.setName("amount")
                .setDescription("Напишите колличество игроков в клане")
                .setRequired(true)
                .setMaxValue(100)
        ),
    async execute(interaction) {
        const { options, user, guild } = interaction

        const name = options.getString("name")
        const tag = options.getString("tag")
        const amount = options.getNumber("amount")

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: "Название", value: name, inline: false },
                { name: "Клан ТЭГ", value: tag, inline: false },
                { name: "Колличество игроков в клане", value: amount, inline: true },
                { name: "Discord Tag", value: `<@${user.id}>`, inline: false },
                { name: "Статус", value: "На рассмотрении", inline: true }
            )
            .setTimestamp()

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("clanRequest-accept").setLabel("✅ Одобрить").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("clanRequest-deceline").setLabel("⛔ Отказать").setStyle(ButtonStyle.Danger),
        )
        try {
            const testToRu = /[0-9]/;
            if (testToRu.test(embed.data.fields[0].value) === true)
                return interaction.reply({ content: "Название должено быть без цифр", ephemeral: true })
            if (ClanRequest.findOne({ ClanName: tag, Approve: true}))
                return interaction.reply({ content: "Клан с таким названием уже есть", ephemeral: true })
            if (ClanRequest.findOne({ ClanTag: tag, Approve: true}))
                return interaction.reply({ content: "Клан с таким тэгом уже есть", ephemeral: true })
            if (ClanRequest.findOne({ ClanName: name, ClanTag: tag, Approve: true}))
                return interaction.reply({ content: "Клан с таким тэгом и названием уже есть", ephemeral: true })

            ClanRequest.findOne({ DisID: user.id, GuildID: guild.id, ClanTag: tag, ClanName: name }, async (err, obj) => {
                if (err) throw err
                if (!obj) {
                    let m = await guild.channels.cache.get("1095820327218581655").send({ embeds: [embed], components: [buttons], fetchReply: true })
                    await ClanRequest.create({
                        GuildID: guild.id,
                        MessageID: m.id,
                        DisID: user.id,
                        ClanTag: tag,
                        ClanName: name,
                        Checked: false
                    })
                    await interaction.reply({ content: "Заявка была успешно отправлена, для получения ответа, удостоверьтесь, что получения сообщений от пользователей вне списка друзей, разрешены для получения.", ephemeral: true })
                } else {
                    if (obj.Approve == false) return interaction.reply({ content: "Заявка на рассмотрении", ephemeral: true })
                    await ClanRequest.updateOne({DisID: user.id, GuildID: guild.id}, {
                        MessageID: m.id,
                        ClanTag: tag,
                        ClanName: name,
                        Checked: false
                    })
                    await interaction.reply({ content: "Заявка была успешно отправлена, для получения ответа, удостоверьтесь, что получения сообщений от пользователей вне списка друзей, разрешены для получения.", ephemeral: true })
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
}