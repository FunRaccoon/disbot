const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const client = require("../../index")

module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Complete music system.")
        .addIntegerOption(option =>
            option
                .setName("volume")
                .setDescription("10 = 10%")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, guild, options } = interaction
        const volume = options.getInteger("volume")
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
            client.distube.setVolume(voiceChannel, volume)
            return interaction.reply({ content: `🔉 Volume has been set to ${volume}` })
        } catch (err) {
            console.log(err)

            embed.setColor("Red").setDescription("⛔ | Something went wrong...")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}