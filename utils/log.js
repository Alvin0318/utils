const chalk = require("chalk");

const type_color = {
    warn: 'yellowBright',
    info: 'green',
    error: 'redBright',
    log: 'gray',
    debug: 'bgYellowBright'
}
const logger = {}
for (let i in type_color) {
    logger[i] = (...args) => {
        let str = args.join(' ');
        return chalk[type_color[i]].bold(str)
    }
}
module.exports = logger