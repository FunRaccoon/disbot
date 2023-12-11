const { EmbedBuilder } = require('discord.js')
const ClanRequest = require('../../Models/ClanRequest')

module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        const { guildId, member, message } = interaction
        if (interaction.customId === 'clanRequest-deceline') {
            ClanRequest.findOne({ MessageID: message.id, GuildID: guildId }, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({ content: "Данные не найдены", ephemeral: true })

                const embed = message.embeds[0]

                if (!embed)
                    return interaction.reply({ content: "Эмбид не найдены", ephemeral: true })

                let modalresponce = interaction.fields.getTextInputValue('cause')
                embed.data.fields[4] = { name: "Статус", value: "Отказано", inline: true }
                const decelineEmbed = EmbedBuilder.from(embed).setColor("Red").setFooter({ text: `Отказал: ${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) }).addFields({ name: "Отказано по причине", value: modalresponce, inline: false })

                embedOsn = new EmbedBuilder()
                    .setTitle("Заявка отклонена ⛔")
                    .setDescription(`Заявку отклонил: <@${member.id}>, по причине: ${modalresponce}`)
                    .setTimestamp()
                    .setColor("Red")

                await data.DisID.send({ embeds: [embedOsn] }).catch(() => interaction.reply({ content: 'Пользователь не может принять сообщение от бота', ephemeral: true }))
                await message.edit({ embeds: [decelineEmbed], components: [] })
                await interaction.reply({ content: "Заявка отклонена", ephemeral: true })
                await ClanRequest.updateOne({ MessageID: message.id, GuildID: guildId }, {
                    Checked: true
                })
            })
        }
    },
}