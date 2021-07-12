const path = require('path');

module.exports = {
    entry: './src/main.js',
    mode: 'production',
    output: {
        filename: 'socioscapes.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
};