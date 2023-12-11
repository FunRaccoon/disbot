const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
const { DisTube } = require("distube")
const { YtDlpPlugin } = require("@distube/yt-dlp")
//const gamedig = require("gamedig");

const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember, Channel } = Partials

const { loadEvents } = require('./Handlers/eventHandler')
const { loadCommands } = require('./Handlers/commandHandler');

const client = new Client({
    fetchAllMembers: true,
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates],
    Partials: [User, Message, GuildMember, ThreadMember],
})

module.exports = client


/*async function online() {
    gamedig.query({
        type: 'dayz', host: '92.38.222.102', port: '2302'
    }).then((state) => {
        //client.user.setActivity(`Онлайн: ${state.raw.numplayers}/${state.maxplayers}`, { type: 3 }); // call 1055767844136161340
        //client.user.setActivity('test 1\ntest 2', {type: 3})
    }).catch((err) => {
        client.user.setActivity('команду /serversonline', {type: 3})
        //client.user.setStatus('dnd')
    });
}*/

client.commands = new Collection()

client.config = require('./config.json')
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddListWhenCreatingQueue: false,
    plugins: [new YtDlpPlugin()]
})
client.login(client.config.token).then(() => {
    loadEvents(client)
    loadCommands(client)
})

client.on('ready', async () => {
    //client.user.setActivity('', {type: 3})
    //online()
    //setInterval(online, 1000)
})
    //.on("debug", console.log)
    //.on("warn", console.log)