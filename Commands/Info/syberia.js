const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('syberia')
        .setDescription('Описание модификации Syberia.')
    ,
    async execute(interaction) {  
        const embed = new EmbedBuilder()
            .setTitle("Полная таблица с медикаментами") 
            .setDescription("Обозначния:")
            .addFields(
                {name: "LvL", value: "Уровень мощности медикамента"},
                {name: "Наименования", value: "Название медикамента"},
                {name: "Время", value: "Время действия медикамента"}
            )
            .setImage("https://cdn.discordapp.com/attachments/1054865811304611850/1061590890684104745/MED.png")
            .setColor('Random')
        const embed2 = new EmbedBuilder()
            .setTitle("Полная таблица с повреждениями и состояниями") 
            .setImage("https://cdn.discordapp.com/attachments/1054865811304611850/1109446247359709204/2.png")
            .setColor('Random')
        return interaction.reply({
            embeds: [embed, embed2],
            ephemeral: true
        })
    }
}