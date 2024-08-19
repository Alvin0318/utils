#!/usr/bin/env node
const path = require('path');
const dayjs = require('dayjs');
const { Command } = require('commander');
const rootPath = path.resolve(__dirname, '../')
const pkg = require(`${rootPath}/package.json`)
const program = new Command();
program.version('frp-v' + pkg.version)
program.command('start');
program.command('stop');
program.command('status');


program.parse();