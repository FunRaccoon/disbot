const {model, Schema} = require('mongoose')

let TeamRequest = new Schema({
    GuildID: String,
    MessageID: String,
    DisID: String
})

module.exports = model("TeamRequest", TeamRequest)