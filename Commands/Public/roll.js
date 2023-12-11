const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const { CFToolsClientBuilder, SteamId64, CFToolsId, } = require('cftools-sdk')
//const cfclient = require("../../index")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Ты сегодня везучий?')
    .addNumberOption(option =>
        option.setName("min")
            .setDescription("min value")
            .setRequired(true)
    )
    .addNumberOption(option =>
        option.setName("max")
            .setDescription("max value")
            .setRequired(true)
    )
    ,
    async execute(interaction) {    
        const {options} = interaction
        const min = Math.ceil(options.getNumber("min"))
        const max = Math.floor(options.getNumber("max"))
        if(min <= 0 || max <= 0)
            return interaction.reply({ content: "Значения не могут быть меньше 0", ephemeral: true})
        await interaction.reply({ content: `${Math.floor((Math.random() * (max - min + 1)) + min)}`, ephemeral: true })
        //const cfclient = new CFToolsClientBuilder()
        //    .withServerApiId('d410feeb-2edd-4819-be36-ddc661e28738') //server api id
        //    .withCredentials('64379e89a6386cd481cd08a5', 'nThR9uJbVDM4R3TkxQO/JMKiH8I+1Ae9LEcswXYawug=') //app id, secret
        //    .build();
        //cfclient.getWhitelist({
        //    playerId: CFToolsId.of('a38a0c0e-7f6a-413c-8776-e618692e4cce')
        //}).then(function (r) {
        //    console.log(r)
        //})
        //let id64 = "76561198132670381"
        //cfclient.putWhitelist({  //добавление
        //    comment: "Added for Bot",
        //    expires: "Permanent",
        //    id: CFToolsId.of(`${id64}`)
        //})
        //let id64 = "76561198132670381"
        //cfclient.deleteWhitelist({ //удаление
        //    playerId: CFToolsId.of(`${id64}`)
        //})
        //cfclient.getGameServerDetails({
        //    game: "1",
        //    ip: "95.217.47.20",
        //    port: 2402
        //}).then(function(r) {
        //    console.log(r)
        //})
    }
}