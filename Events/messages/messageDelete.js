const {EmbedBuilder} = require('discord.js')

module.exports = {
    name: 'messageDelete',

    async execute(message) {

        if(message.author.bot ^ message.channel.id == "1057249152507064330") return;
        if (message.guildId != "1054804473224110080") return

        let y = 1;
        let attach = []
        let logs = await message.guild.fetchAuditLogs({type: 72})
        let entry = logs.entries.first()
        let msgDeleteEmb = new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ Удаление сообщений")
            .setDescription(`**Сообщение удалено в канале:** <#${message.channel.id}>.\n**Кто удалил: ${entry.executor}**\n**Автор:** ${message.author}.`)
            .setTimestamp();
        if (message.attachments.size > 0) {
            for (let i = 0; i < message.attachments.size; i++) {
                let msgAtt = message.attachments.map(el => el.url)[i]
                attach.push(`${msgAtt}`)
            }
            message.guild.channels.cache.get('1055808031310499921').send({embeds: [msgDeleteEmb], files: attach})
        }
        if (message.content != "") {
            await msgDeleteEmb.setDescription(`**Сообщение удалено в канале:** <#${message.channel.id}>.\n**Кто удалил: ${entry.executor}**\n**Автор сообщения:** ${message.author}.\n**Содержимое:** ${message.content}.`)
            message.guild.channels.cache.get('1055808031310499921').send({embeds: [msgDeleteEmb]})
        }
    }
}