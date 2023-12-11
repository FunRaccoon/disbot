const { EmbedBuilder } = require('discord.js')
const Request = require('../../Models/Request')

module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        const { guildId, member, message, guild  } = interaction
        if (interaction.customId === 'decelineModal') {
            Request.findOne({ MessageID: message.id, GuildID: guildId }, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({ content: "Данные не найдены", ephemeral: true })

                const embed = message.embeds[0]

                if (!embed)
                    return interaction.reply({ content: "Эмбид не найдены", ephemeral: true })
                await interaction.reply({ content: "Заявка отклонена", ephemeral: true })
                let modalresponce = interaction.fields.getTextInputValue('cause')
                embed.data.fields[4] = { name: "Статус", value: "Отказано", inline: true }
                embed.data.timestamp
                const decelineEmbed = EmbedBuilder.from(embed).setColor("Red").setFooter({ text: `Отказал: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) }).addFields({ name: "Отказано по причине", value: modalresponce, inline: false })

                embedOsn = new EmbedBuilder()
                    .setTitle("Заявка отклонена ⛔")
                    .setDescription(`Заявку отклонил: <@${member.id}>, по причине: ${modalresponce}`)
                    .setTimestamp()
                    .setColor("Red")

                let memberId = guild.members.cache.get(data.DisID)
                try {
                    await memberId.send({ embeds: [embedOsn] })
                }
                catch(err) {
                    return interaction.reply({ content: 'Пользователь не может принять сообщение от бота', ephemeral: true })
                }
                await message.edit({ embeds: [decelineEmbed], components: [] })
                await Request.updateOne({ MessageID: message.id, GuildID: guildId }, {
                    Check: true
                })
            })
        }
    },
}