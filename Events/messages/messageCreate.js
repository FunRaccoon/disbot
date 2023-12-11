const { CommandInteraction } = require('discord.js')

module.exports = {
    name: 'messageCreate',

    async execute(message) {

        if(message.author.bot) return;

        

        if(message.channel.id == '1054804474926993469' && message.webhookId == null) message.delete() // подача заявок LC
        if(message.channel.id == '1042495328231899157' && message.webhookId == null) message.delete() // подача заявок метро
        if(message.channel.id == '1118964865365721119' && message.webhookId == null) message.delete()
        /*if (message.channel.id == '1054804474926993471' && message.webhookId == null) {
            let msg = (`${message.content}`)
            if (msg.startsWith('https')) {
                message.delete()
                return
            }
            message.startThread({
                name: 'Обсуждение',
                autoArchiveDuration: 60,
	            reason: 'Обсуждение идеи',
            })
        }*/
    }  
}