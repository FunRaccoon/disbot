const {model, Schema} = require('mongoose')

let ClanRequest = new Schema({
    GuildID: String,
    MessageID: String,
    DisID: String,
    ClanTag: String,
    ClanName: String,
    Checked: Boolean
})

module.exports = model("ClanRequest", ClanRequest)