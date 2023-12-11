const { CommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'messageUpdate',

    async execute(oldMessage, newMessage) {

        if (oldMessage.author.bot) return;//message
        if (oldMessage.guildId != "1054804473224110080") return

        let msgEditEmb = new EmbedBuilder()
            .setColor("Fuchsia")
            .setTitle("❗ Изменение сообщения")
            .setDescription(`**Сообщение изменено в канале:** <#${oldMessage.channelId}>.\nАвтор: ${oldMessage.author}`)
            .setTimestamp()
        let msgEditEmb2 = new EmbedBuilder()
            .setColor("Fuchsia")
            .setTitle("❗ Изменение сообщения")
            .setDescription(`**Сообщение изменено в канале:** <#${oldMessage.channelId}>.\nАвтор: ${oldMessage.author}`)
            .setTimestamp()

        if (oldMessage.content != '' && newMessage.content != '') {
            if(oldMessage.content.length + newMessage.content.length > 4000) {
                await msgEditEmb.setDescription(`**Сообщение изменено в канале:** <#${oldMessage.channelId}>.\nАвтор: ${oldMessage.author}\n**Было:** ${oldMessage}`)
                await msgEditEmb2.setDescription(`**Сообщение изменено в канале:** <#${oldMessage.channelId}>.\nАвтор: ${oldMessage.author}\n**Стало:** ${newMessage}`)
                return oldMessage.guild.channels.cache.get('1055855150012563538').send({ embeds: [msgEditEmb, msgEditEmb2] })
            }
            await msgEditEmb.setDescription(`**Сообщение изменено в канале:** <#${oldMessage.channelId}>.\nАвтор: ${oldMessage.author}\n**Было:** ${oldMessage}\n**Стало:** ${newMessage}`)
            return oldMessage.guild.channels.cache.get('1055855150012563538').send({ embeds: [msgEditEmb] })
        }
        if (oldMessage.attachments.size > 0 && newMessage.attachments.size > 0) {
            await msgEditEmb.setDescription(`**Сообщение изменено в канале:** <#${oldMessage.channelId}>.\nАвтор: ${oldMessage.author}\nБыли удалены вложения выше`)
            let finishAtt = oldMessage.attachments.map(el => el.attachment).filter(el => !newMessage.attachments.map(el => el.attachment).includes(el))
            //let attach = []
            //console.log(finishAtt)
            //for (let i = 0; i < finishAtt.length; i++) {
            //    let msgAtt = newMessage.attachments.map(el => el.url)[i]
            //    attach.push(`${msgAtt}`)
            //} не работает
            return oldMessage.guild.channels.cache.get('1055855150012563538').send({ embeds: [msgEditEmb], files: finishAtt })
        }

    }
}