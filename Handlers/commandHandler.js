function loadCommands(client) {
    const ascii = require('ascii-table')
    const fs = require('fs')
    const table = new ascii().setHeading("Commands", "Status", "Server")
    const {TLRID, LCID, WoWID, ClientID} = require("../config.json")

    let commandsArray = [];
    let TLR = [];
    let LC = [];
    let WoW = [];

    const commandsFolder = fs.readdirSync('./Commands')
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'))

        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`)

            const properties = {folder, ...commandFile}
            client.commands.set(commandFile.data.name, properties)

            if (commandFile.team === "LC") {
                LC.push(commandFile.data.toJSON())
            //} else if (commandFile.team === "TLR") {
                //TLR.push(commandFile.data.toJSON())
            } else if (commandFile.team === "WoW") {
                WoW.push(commandFile.data.toJSON())
            } else if (commandFile.team === "non") {
                continue
            } else {
                commandsArray.push(commandFile.data.toJSON())
            }
            
            if(commandFile.team === undefined) commandFile.team = "all"
            table.addRow(file, "loaded", commandFile.team)
            continue
        }
    }
    //client.guilds.cache.get(TLRID).commands.set(TLR)
    client.guilds.cache.get(LCID).commands.set(LC)
    client.guilds.cache.get(WoWID).commands.set(WoW)
    client.application.commands.set(commandsArray)
    return console.log(table.toString(), "\n Loaded Commands")
}

module.exports = {loadCommands}