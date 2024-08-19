#!/usr/bin/env node
const path = require('path');
const dayjs = require('dayjs');
const { encrypt, decrypt } = require("../utils/encrypt")
const { Command } = require('commander');
const rootPath = path.resolve(__dirname, '../')
const pkg = require(`${rootPath}/package.json`)
const logger = require("../utils/log");
const program = new Command();
program.version('encrypt-v' + pkg.version)
program.command('encrypt').option('-s,--string <string to encrypt>').option('-k,--secret-key [secret key]').action(({ string, secretKey }) => {
    console.log(logger.warn('密文'), logger.log(encrypt(string, secretKey)))
});
program.command('decrypt').option('-s,--string <string to decrypt>').option('-k,--secret-key [secret key]').action(({ string, secretKey }) => {
    console.log(logger.info('明文'), logger.log(decrypt(string, secretKey)))
});


program.parse();