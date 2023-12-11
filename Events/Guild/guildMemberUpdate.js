const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Request = require('../../Models/Request')

module.exports = {
    name: "guildMemberUpdate",
    execute(oldMember, newMember) {
        if (oldMember._roles == newMember._roles) return
        try {
            Request.findOne({ DisID: oldMember.id, GuildID: oldMember.guild.id }, async (err, obj) => {
                if (err) throw err
                if (!obj) return
                else {
                    await Request.updateOne({ DisID: oldMember.id, GuildID: oldMember.guild.id }, {
                        Roles: newMember._roles
                    })
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
}
