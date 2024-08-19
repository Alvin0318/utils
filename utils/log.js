const chalk = require("chalk");

function warn(str) {
    return chalk.yellowBright.bold(str)
}
function info(str) {
    return chalk.green.bold(str)
}
function error(str) {
    return chalk.redBright.bold(str)
}
function log(str) {
    return chalk.gray.bold(str)
}
function debug(str) {
    return chalk.bgYellowBright.bold(str)
}

module.exports = {
    log,
    info,
    warn,
    error,
    debug
}