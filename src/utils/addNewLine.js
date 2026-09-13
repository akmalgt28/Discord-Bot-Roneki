function addNewLines(text, charLimit) {
    let result = '';
    let lineLength = 0;

    for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ' && lineLength >= charLimit) {
            result += '\n';
            lineLength = 0; // Reset line length
        } else {
            result += text[i];
            lineLength++;
        }
    }

    return result;
}

module.exports = {
    addNewLines,
}