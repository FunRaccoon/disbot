const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, WebhookClient } = require('discord.js')
const { avatarBandits, avatarCS, avatarDOLG, avatarVSU, avatarGrech, avatarMerc, avatarMonolith, avatarNeutrals, avatarRenegats, avatarSientis, avatarStalker, avatarSvoboda, avatarUN } = require('../../avatar.json')
const { stalker, bandit, msop, neutrals, clearsky, renegats, duty, freedom, un, grech, mercenaries, sientist, monolith } = require('../../config.json')


module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("pda")
        .setDescription("Отправление сообщения в общую сеть PDA")
        .setDMPermission(false)
        //.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("text")
                .setDescription("Cообщение")
                .setRequired(true)
                .setMaxLength(4096)
        )
        .addBooleanOption(option =>
            option.setName("anonim")
                .setDescription("Анонимно или нет")
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option.setName("file")
                .setDescription("Добавьте файл")
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName("fraction")
                .setDescription("От лица группировки или нет")
                .setRequired(false)
        ),
    async execute(interaction) {
        const groupsID = [
            `${stalker}`,
            `${bandit}`,
            `${msop}`,
            `${neutrals}`,
            `${clearsky}`,
            `${renegats}`,
            `${duty}`,
            `${freedom}`,
            `${un}`,
            `${grech}`,
            `${mercenaries}`,
            `${sientist}`,
            `${monolith}`
        ]
        const avatarsID = [
            avatarStalker,
            avatarBandits,
            avatarVSU,
            avatarNeutrals,
            avatarCS,
            avatarRenegats,
            avatarDOLG,
            avatarSvoboda,
            avatarUN,
            avatarGrech,
            avatarMerc,
            avatarSientis,
            avatarMonolith

        ]
        const { options, member, channel, command, guildId, guild, client } = interaction
        try {
            if (channel.id != "1075573366091677776")
                return interaction.reply({ content: "Кпк не тут!", ephemeral: true })

            const name = member.nickname.split("|")[1].trim()
            const anon = options.getBoolean("anonim")
            const text = options.getString("text")
            const file = options.getAttachment("file")
            const fraction = options.getBoolean("fraction")
            let i = 0, j = 0
            let ava
            if (member.nickname == null)
                return interaction.reply({ content: "У тебя проблема с ником", ephemeral: true })
            while (!member._roles.includes(groupsID[i])) {
                i++
                if(i == groupsID.length) return interaction.reply({ content: "У тебя не указана группировка", ephemeral: true })
            }
            while (member._roles.includes(groupsID[j])) {
                j++
                if(j > 1) return interaction.reply({ content: "У тебя больше чем 1 группировка", ephemeral: true})
            }
            const WebHook = new WebhookClient({ url: "https://discord.com/api/webhooks/1114901120695930888/qZOCMNmstcixN9Fo5XUCtrr2axgElgpjLPe-xi3pI-6GPsKb3ZJDSWIpT96MtWFc-_C6"})
            const embed = new EmbedBuilder()
                //.setAuthor({ name: 'Lost Chance Team', iconURL: 'https://i.imgur.com/pbxfMTI.png'})
                .setTitle(name)
                .setDescription(text)
                .setThumbnail(ava)
                //.setFooter({ text: "При любых ошибка в работе бота обращайтесь в личные сообщения bubs#1339"})
                .setTimestamp()

            const format = ["gif", "png", "jpg", "jpeg"]
            if(file != null) {
                if(!format.includes(file.name.split(/\.(?=[^\.]+$)/)[1])) return interaction.reply({content: `Не верный формат вложения. Доступные: ${format}`, ephemeral: true });
                embed.setImage(file.url)
            }
            if (anon) {
                ava = "https://steamuserimages-a.akamaihd.net/ugc/80345569855693596/625F74CBD54E707C9C4589C60288416A098143B3/"
                embed.setThumbnail(ava)
                embed.setTitle("Аноним")
                await WebHook.send({
                    embeds: [embed]
                })
            } else {
                for(i = 0; i < groupsID.length;i++) {
                    if (member.roles.cache.has(groupsID[i])) {
                        if(fraction && groupsID[i] == groupsID[0]) {
                            return interaction.reply({ content: "Ты не во фракции", ephemeral: true })
                        } else if (fraction) {
                            let fractionname = member.roles.cache.find(r => r.id === groupsID[i])
                            embed.setTitle(fractionname.name.substring(4,fractionname.length))
                        }
                        avaid = avatarsID[i]
                        ava = avaid[Math.floor(Math.random() * avaid.length)]
                    }
                }
                embed.setThumbnail(ava)
                embed.setColor('Random')
                await WebHook.send({
                    embeds: [embed] 
                })
            }
            embed.setTitle(name)
            await client.channels.cache.get('1115533531754545193').send({embeds: [embed]})
            return interaction.reply({ content: "Сообщение отправлено", ephemeral: true})

        } catch (err) {
            console.log(err)
        }
    }
}