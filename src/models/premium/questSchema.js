const { model, Schema } = require('mongoose');

const giveawaySchema = new Schema({
    reward: { type: String, required: true },
    pesan: { type: String, required: true },
    role: { type: String, required: true },
    winnersCount: { type: Number, required: true },
    duration: { type: Number, required: true },
    endTime: { type: Number, required: true },
    hostId: { type: String, required: true },
    gambar: { type: String },
    thumbnail: { type: String },
    messageId: { type: String },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    participants: { type: [String], default: [] },
    ended: { type: Boolean, default: false }
});

module.exports = model('giveaway', giveawaySchema);