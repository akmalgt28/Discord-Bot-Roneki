function parseDuration(duration) {
    const timeRegex = /(\d+)\s*(detik|menit|jam|hari|minggu|bulan|tahun)/i;
    const match = duration.match(timeRegex);

    if (!match) throw new Error('Format durasi tidak valid.');

    const [, value, unit] = match;
    const multiplier = {
        detik: 1000,
        menit: 60 * 1000,
        jam: 60 * 60 * 1000,
        hari: 24 * 60 * 60 * 1000,
        minggu: 7 * 24 * 60 * 60 * 1000,
        bulan: 30 * 24 * 60 * 60 * 1000,
        tahun: 365 * 24 * 60 * 60 * 1000
    };

    return parseInt(value, 10) * multiplier[unit];
}

module.exports = { parseDuration };
