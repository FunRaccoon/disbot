const {model, Schema} = require('mongoose')

let radioSchema = new Schema({
    GuildID: String,
    MembersID: [String],
    HandlerID: String,
    ChannelID: String,
})

module.exports = model("RadioSchema", radioSchema)