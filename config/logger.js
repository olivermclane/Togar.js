const pino = require('pino');
const transports = pino.transport({
    targets: [
        {
            target: "pino-pretty",
        }, // Console logging
        {
            target: "pino/file",
            options: {
                destination: '/Users/olivermclane/Desktop/Togar.js/logs/app.log'
            },
        } // File logging
    ]
});

const logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    },
    transports
);

module.exports = logger;
