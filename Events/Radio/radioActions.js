const { ChannelType, PermissionFlagsBits, VoiceState } = require('discord.js')
const radioSchema = require("../../Models/RadioSchema")

module.exports = {
    name: 'voiceStateUpdate',

    async execute(oldState, newState) {
        const { ViewChannel } = PermissionFlagsBits
        if (newState.channelId == "1117372251747135508" && !newState.member.user.bot) {
            //let target = newState.guild.members.fetch(newState.id)
            await newState.guild.channels.create({
                name: `${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 100)}`,
                type: ChannelType.GuildVoice,
                parent: "1117341588323045446",
                permissionOverwrites: [
                    {
                        id: "1054804473274437720",
                        allow: [ViewChannel]
                    },
                    {
                        id: "1055916796236025926",
                        allow: [ViewChannel]
                    },
                    {
                        id: "1054804473224110080",
                        deny: [ViewChannel],
                    },
                    {
                        id: newState.member.id,
                        allow: [ViewChannel]
                    }
                ],
            }).then(async (channel) => {
                const newRadioSchema = await radioSchema.create({
                    GuildID: newState.guild.id,
                    HandlerID: newState.member.id,
                    ChannelID: channel.id,
                })
                await newState.member.voice.setChannel(channel.id)
            })
            return
        }
        const data = await radioSchema.findOne({ GuildID: newState.guild.id, ChannelID: oldState.channelId })
        if (oldState && data && oldState.channel.members.size == 0) {
                oldState.channel.delete()
                data.remove()
        }
    }
}