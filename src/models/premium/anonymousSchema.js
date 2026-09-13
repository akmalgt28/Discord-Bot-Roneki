const { model, Schema } = require('mongoose');

let anonymousSchema = new Schema({
    guildID: String,
    channelID: String
});

module.exports = model('Anonymous', anonymousSchema);