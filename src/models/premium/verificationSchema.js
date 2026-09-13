const { model, Schema } = require("mongoose");

let verificationSchema = new Schema({
    Guild: String,
    Channel: String,
    Role: String,
    Message: String,
    Verified: Array
})

module.exports = model('Verifications', verificationSchema);