#!/usr/bin/env node
const path = require('path');
const cs = require("cross-spawn");
const os = require('os');
const { isPortInUse } = require("../utils/checkPort");
const logger = require("../utils/log");
const { Command } = require('commander');
const { stderr } = require('process');
const rootPath = path.resolve(__dirname, '../')
const pkg = require(`${rootPath}/package.json`)
const program = new Command();
program.version('frp-v' + pkg.version)
program.command('start')
    .option('-m,--mode [server mode or client mode]')
    .action((data) => {
        const { mode } = data;
        let m = 's'
        if (mode) {
            m = 'c'
        }
        const platform = os.platform();
        const sp = path.resolve(__dirname, `../script/frp_0.58.1/frp${m}-${platform}`);
        const sc = path.resolve(__dirname, `../script/frp_0.58.1/frp${m}.toml`);

        cs.sync(sp, ["-c", sc], { stdio: 'inherit' });

    });
program.command('stop')
    .option('-m,--mode [server mode or client mode]')
    .action((data) => {
        const { mode } = data;
        let m = 's'
        if (mode) {
            m = 'c'
        }
        const [pid, service, result] = checkService(m);
        if (pid === null) {
            console.log(logger.error(result.stderr.toString('utf8') || service + " 服务未启动!"))

        } else if (pid !== 0) {
            if (pid !== 0) {
                const r2 = cs.sync('kill', [pid]);
                if (r2.status) {
                    console.log(logger.error(r2.stderr.toString('utf8')))
                } else {
                    console.log(logger.info("服务关闭成功！pid: " + pid))
                }
            }

        } else {
            console.log(logger.info(service + " 服务未启动!"))
        }
    });
program.command('status')
    .option('-m,--mode [server mode or client mode]')
    .action((data) => {
        const { mode } = data;
        let m = 's'
        if (mode) {
            m = 'c'
        }

        const [pid, service, result] = checkService(m);
        if (pid === null) {
            console.log(logger.error(result.stderr.toString('utf8') || service + " 服务未启动!"))

        } else if (pid !== 0) {
            console.log(logger.info(service + " 服务已启动！pid: " + pid))

        } else {
            console.log(logger.info(service + " 服务未启动!"))
        }

    });

function checkService(m = 's') {
    const service = `frp${m}`;
    const result = cs.sync('pgrep', [service]);
    if (result.status) {
        return [null, service, result];
    } else {
        return [Number(result.stdout.toString('utf8')), service, result];
    }
}
program.parse();