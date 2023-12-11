const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const client = require("../../index")

module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Complete music system.")
    ,
    async execute(interaction) {
        const { member, guild } = interaction
        const voiceChannel = member.voice.channel

        const embed = new EmbedBuilder()

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("You must be in a voicce channel to execute music commands.")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`You can't use the music player as it is already acitve in <#${guild.members.me.voice.channelId}>`)
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        try {

            const queue = await client.distube.getQueue(voiceChannel)

            if (!queue) {
                embed.setColor("Red").setDescription("There is no active queue")
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }
            console.log(queue.songs.length)
            await queue.skip(voiceChannel)
            embed.setColor("Blue").setDescription("⏩ The song has been skipped")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (err) {
            console.log(err)

            embed.setColor("Red").setDescription("⛔ | Something went wrong...")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}