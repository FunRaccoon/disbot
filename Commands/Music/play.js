const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const client = require("../../index")

module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption(option =>
            option
                .setName("url")
                .setDescription("url music")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild, channel } = interaction

        const url = options.getString("url")
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
            client.distube.play(voiceChannel, url, { textChannel: channel, member: member })
            return interaction.reply({ content: "🎵 Request received" })
        } catch (err) {
            console.log(err)

            embed.setColor("Red").setDescription("⛔ | Something went wrong...")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}