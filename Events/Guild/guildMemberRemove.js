const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { CFToolsClientBuilder, SteamId64, CFToolsId, } = require('cftools-sdk')
const Request = require('../../Models/Request')
const fs = require('fs')
const ticketSchema = require('../../Models/Ticket')
const { channel } = require('diagnostics_channel')

module.exports = {
    name: "guildMemberRemove",
    execute(member) {
        try {
            const { user, guild } = member
            Request.findOne({ DisTag: user.id, GuildID: guild.id }, async (err, obj) => {
                if (err) throw err
                if (!obj) return
                else {
                    const cfclient = new CFToolsClientBuilder()
                        .withServerApiId('d410feeb-2edd-4819-be36-ddc661e28738') //server api id
                        .withCredentials('64379e89a6386cd481cd08a5', 'nThR9uJbVDM4R3TkxQO/JMKiH8I+1Ae9LEcswXYawug=') //app id, secret
                        .build();
                    
                        ticketSchema.find({ MembersID: [user.id], GuildID: guild.id }, async (err, data) => {
                            if (err) throw err;
                            if (!data) return
                            //let count = data.count({MembersID: [user.id], GuildID: guild.id})
                            //console.log(count)
                            
                            await ticketSchema.deleteMany({ MembersID: [user.id], GuildID: guild.id })
                        })    

                    return cfclient.deleteWhitelist({
                        playerId: SteamId64.of(`${obj.SteamID}`)
                    }).then(console.log(console.log(`${user.username}, долбаеб вышел с сервера`)))
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
}
