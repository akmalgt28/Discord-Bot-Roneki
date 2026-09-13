const { model, Schema } = require("mongoose");

let userSchema = new Schema({
    Guild: String,
    Key: String,
    User: String
})

module.exports = model('VerifiedUser', userSchema);