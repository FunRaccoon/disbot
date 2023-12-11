const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const ticketSchema = require('../../Models/Ticket')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription("Функции в тикете")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Добавить или удалить участников из тикета")
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
            const {guildId, options, channel} = interaction

            const action = options.getString("action")
            const member = options.getUser("member")

            const embed = new EmbedBuilder()

            switch (action) {
                case "add":
                    ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, data) => {
                        if (err) throw err
                        if (!data)
                            return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Что-то пошло не так. Попробуйте позже.")], ephemeral: true})
                
                        if (data.MembersID.includes(member.id))
                            return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Что-то пошло не так. Попробуйте позже.")], ephemeral: true})

                        data.MembersID.push(member.id)

                        channel.permissionOverwrites.edit(member.id, {
                            SendMessages: true,
                            ViewChannel: true,
                            ReadMessageHistory: true
                        })

                        interaction.reply({ embeds: [embed.setColor("Green").setDescription(`${member} был добавлен в тикет.`)]})

                        data.save()
                    })
                    break
                case "remove":
                    ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, data) => {
                        if (err) throw err
                        if (!data)
                            return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Что-то пошло не так. Попробуйте позже.")], ephemeral: true})
                        
                        if (!data.MembersID.includes(member.id))
                            return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Что-то пошло не так. Попробуйте позже.")], ephemeral: true})

                        data.MembersID.remove(member.id)

                        channel.permissionOverwrites.edit(member.id, {
                            SendMessages: false,
                            ViewChannel: false,
                            ReadMessageHistory: false
                        })

                        interaction.reply({ embeds: [embed.setColor("Green").setDescription(`${member} был удален из тикета.`)]})

                        data.save()
                    })
            }
        }
}