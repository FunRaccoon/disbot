const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, WebhookClient } = require('discord.js')
const radioSchema = require("../../Models/RadioSchema")


module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("radio")
        .setDescription("Функции в рации")
        .setDMPermission(false)
        //.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Добавить или удалить участников из рации")
                .setRequired(true)
                .addChoices(
                    { name: "Add", value: "add" },
                    { name: "Remove", value: "remove" }
                )
        )
        .addUserOption(option =>
            option.setName("member")
                .setDescription("Выберите участника на сервере Discord, чтобы выполнить действие.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guildId, options, member, guild } = interaction

        const action = options.getString("action")
        const user = options.getUser("member")
        const embed = new EmbedBuilder()
        let channel
        if(!member.voice.channel) return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Ты не в канале")], ephemeral: true })
        const chid = member.voice.channel.id
        
        switch (action) {
            case "add":
                radioSchema.findOne({ GuildID: guildId, ChannelID: chid }, async (err, data) => {
                    if (err) throw err
                    if (!data)
                        return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Ты не создал рацию или не находишься в ней")], ephemeral: true })
                    if (data.ChannelID != chid && data.HandlerID != member.id)
                        return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Ты не владелец рации")], ephemeral: true })
                    if (data.MembersID.includes(user.id))
                        return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Человек уже добавлен в рацию")], ephemeral: true })
                    data.MembersID.push(user.id)
                    channel = guild.channels.cache.get(data.ChannelID)
                    channel.permissionOverwrites.edit(user.id, {
                        ViewChannel: true
                    })
                    interaction.reply({ embeds: [embed.setColor("Green").setDescription(`${user} был добавлен в рацию.`)], ephemeral: true })

                    data.save()
                })
                break
            case "remove":
                radioSchema.findOne({ GuildID: guildId, ChannelID: chid }, async (err, data) => {
                    if (err) throw err
                    if (!data)
                        return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Ты не создал рацию или не находишься в ней")], ephemeral: true })
                    if (data.ChannelID != chid && data.HandlerID != member.id)
                        return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Ты не владелец рации")], ephemeral: true })
                    if (!data.MembersID.includes(user.id))
                        return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Человека уже удален из рации")], ephemeral: true })
                    let index = data.MembersID.indexOf(user.id)
                    data.MembersID.splice(index, 1)

                    channel = guild.channels.cache.get(data.ChannelID)
                    channel.permissionOverwrites.edit(user.id, {
                        ViewChannel: false
                    })
                    interaction.reply({ embeds: [embed.setColor("Green").setDescription(`${user} был удален из рации.`)], ephemeral: true })

                    data.save()
                })
                break
        }
    }
}