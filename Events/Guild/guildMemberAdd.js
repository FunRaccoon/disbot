const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Request = require('../../Models/Request')

module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        let memberRole = []
        if (member.guild.id == "1054804473224110080") memberRole = ['1054804473224110081'] //1054804473224110080 lost chance 
        else if (member.guild.id == "1042147167588065330") memberRole = ['1042626341008314479'] //1042147167588065330 tlr

        try {
            const { user, guild } = member
            Request.findOne({ DisID: user.id, GuildID: guild.id }, async (err, obj) => {
                if (err) throw err
                if (!obj) member.roles.set(memberRole)
                else {
                    let rls = obj.Roles.map((r) => r.replace(memberRole))
                    member.roles.set(rls)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
}
