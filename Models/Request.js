const {model, Schema} = require('mongoose')

let Request = new Schema({
    GuildID: String,
    MessageID: String,
    DisID: String,
    SteamID: String,
    Roles: [String],
    Bio: String,
    Check: Boolean
})

module.exports = model("Request", Request)