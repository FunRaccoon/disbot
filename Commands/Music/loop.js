const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const client = require("../../index")

module.exports = {
    team: "LC",
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Play a song")
        .addStringOption(option =>
            option
                .setName("loop")
                .setDescription("Loop options: off, song, queue")
                .setChoices(
                    { name: "off", value: "off" },
                    { name: "song", value: "song" },
                    { name: "queue", value: "queue" },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild, channel } = interaction

        const option = options.getString("loop")
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

            let mode = null

            switch (option) {
                case "off":
                    mode = 0
                    break
                case "song":
                    mode = 1
                    break
                case "queue":
                    mode = 2
                    break
            }
            console.log(1)
            mode = await queue.setRepeatMode(mode)
            console.log(2)
            mode = mode ? (mode === 2? "Repeat queue" : "Repeat song") : "Off"

            embed.setColor("Orange").setDescription(`Set repeat mode to \`${mode}\``)
            return interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (err) {
            console.log(err)

            embed.setColor("Red").setDescription("⛔ | Something went wrong...")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}