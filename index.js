#!/usr/bin/env node
const dayjs = require('dayjs');
const { Command } = require('commander');
const { default: inquirer } = require('inquirer');
const fs = require('fs')
const { sendDailyMail } = require('./utils/mail');
const { EOL } = require('os');
const program = new Command();
program
    .name('Alvin-Util')
    .description('CLI to do some daily job for Alvin')
    .version('0.0.1');
const current = dayjs().format('YYYY-MM-DD')
program.command('daily').description('send a daily report')
    .option('-d, --date <date>', 'send date', current)
    .action(async ({ date }) => {
        const c = await inputContent();
        const d = dayjs(date).format('YYYY-MM-DD');
        fs.appendFileSync(`daylog/${c.type === 'plan' ? '工作计划' : '工作总结'}${d}.log`,c.content);
        if (c.confirm) {
            sendDailyMail(d, c.type, c.content)
        } else {
            console.error("取消发送：", EOL, c.content)
        }

    })

const inputContent = async () => {
    const promptList = [
        {
            type: "list",
            message: "请选择日志类型:",
            name: "type",
            choices: ["plan", "report"],
            filter: function (val) { // filter 的用法
                // 使用filter将回答变为小写
                return val.toLowerCase();
            }
        }, {
            type: "editor",
            message: "请输入工作计划内容:",
            name: "content",
            default: '',
            when: function (answers) {
                return answers.type === 'plan'
            },
            validate: function (val) { // validate的使用例子
                if (val.trim()) {
                    return true;
                }
                return "日报内容不可为空";
            }
        }, {
            type: "editor",
            message: "请输入工作总结内容:",
            name: "content",
            default: '\n[勤奋时间][17:45][]\n',
            when: function (answers) {
                return answers.type === 'report'
            },
            validate: function (val) { // validate的使用例子
                if (val.trim()) {
                    return true;
                }
                return "日报内容不可为空";
            }
        }, {
            type: "confirm",
            message: "是否确认发送？",
            name: "confirm",
            // prefix: "前缀"
        }
    ]
    const answers = await inquirer.prompt(promptList);
    return answers;
}

program.parse();

