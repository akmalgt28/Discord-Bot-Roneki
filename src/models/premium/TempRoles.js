const { model, Schema } = require("mongoose");

let tempRoleSchema = new Schema({
    Guild: String,       // ID dari guild/server
    User: String,        // ID dari pengguna yang diberi role
    Role: String,        // ID dari role yang diberikan sementara
    Expiration: Date     // Waktu kadaluarsa role
});

module.exports = model('TempRoles', tempRoleSchema);
