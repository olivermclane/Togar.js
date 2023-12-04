const pino = require('pino');
const transports = pino.transport({
    targets: [
        {
            target: "pino-pretty",
        }, // Console logging
        {
            target: "pino/file",
            options: {
                destination: 'logs/app.log'
            },
        } // File logging
    ]
});

const logger = pino({
    //Setting Log Level so we can change between debug and info
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    },
    transports
);

module.exports = logger;
