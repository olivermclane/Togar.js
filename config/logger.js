const pino = require('pino'); // Pino module instance to allow us to create loggers in the application.
const fs = require('fs');
const logStream = fs.createWriteStream('/Users/olivermclane/Desktop/Togar.js/logs/app.log', { flags: 'a' });


const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
    stream: logStream
});

module.exports = logger;