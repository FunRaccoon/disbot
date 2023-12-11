const { SlashCommandBuilder, PermissionFlagsBits, WebhookClient, EmbedBuilder } = require('discord.js')
const { avatarBandits, avatarTorg, avatarCS, avatarDOLG, avatarVSU, avatarGrech, avatarMerc, avatarMonolith, avatarNeutrals, avatarRenegats, avatarSientis, avatarStalker, avatarSvoboda, avatarUN } = require('../../avatar.json')
const { stalker, bandit, msop, neutrals, clearsky, renegats, duty, freedom, un, grech, mercenaries, sientist, monolith } = require('../../config.json')

module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("pdaadmin")
        .setDescription("Отправление сообщения в общую сеть PDA")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Имя отправителя")
                .setRequired(true)
                .setMaxLength(30)
        )
        .addStringOption(option =>
            option.setName("text")
                .setDescription("Cообщение")
                .setRequired(true)
                .setMaxLength(255)
        )
        .addRoleOption(option =>
            option.setName("group")
                .setDescription("Выберите роль гп")
                .setRequired(false)
        )
        .addAttachmentOption(option =>
            option.setName("avatarfile")
                .setDescription("Добавьте аватар")
                .setRequired(false)
        )
        //.addBooleanOption(option =>
        //    option.setName("fraction")
        //        .setDescription("От лица группировки или нет")
        //        .setRequired(false)
        //)
        ,
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
        const { options, member, channel, command, guild } = interaction
        try {

            if (channel.id != "1075573366091677776")
                return interaction.reply({ content: "Кпк не тут!", ephemeral: true })
            let ava
            const format = ["png", "jpg", "jpeg"]
            const name = options.getString("name")
            const text = options.getString("text")
            const group = options.getRole("group")
            const avatarfile = options.getAttachment("avatarfile")
            //const fraction = options.getBoolean("fraction")
            const WebHook = new WebhookClient({ url: "https://discord.com/api/webhooks/1114901120695930888/qZOCMNmstcixN9Fo5XUCtrr2axgElgpjLPe-xi3pI-6GPsKb3ZJDSWIpT96MtWFc-_C6" })
            const embed = new EmbedBuilder()
                //.setAuthor({ name: 'Lost Chance Team', iconURL: 'https://i.imgur.com/pbxfMTI.png'})
                .setTitle(name)
                .setDescription(text)
                .setThumbnail(ava)
                //.setFooter({ text: "При любых ошибка в работе бота обращайтесь в личные сообщения bubs#1339"})
                .setTimestamp()
            
            if (group && avatarfile) return interaction.reply({ content: "Либо гп, либо картинка.", ephemeral: true })
            if (group) {
                for (i = 0; i < groupsID.length; i++) {
                    if (group.id == groupsID[0]) {
                        return interaction.reply({ content: "Нельзя писать от сталкеров", ephemeral: true })
                    }
                    if (group.id === groupsID[i]) {
                        let fractionname = guild.roles.cache.find(r => r.id == groupsID[i])
                        
                        embed.setTitle(fractionname.name.substring(4, fractionname.length))

                        avaid = avatarsID[i]
                        ava = avaid[Math.floor(Math.random() * avaid.length)]
                    }
                }
            }
            if (avatarfile) {
                if (!format.includes(avatarfile.name.split(/\.(?=[^\.]+$)/)[1])) return interaction.reply({ content: `Не верный формат вложения. Доступные: ${format}`, ephemeral: true });
                ava = avatarfile.url
            }


            interaction.reply({ content: "Сообщение отправлено", ephemeral: true })

            embed.setThumbnail(ava)
            embed.setColor('Random')
            await WebHook.send({
                embeds: [embed]
            })
        } catch (err) {
            console.log(err)
        }
    }
}