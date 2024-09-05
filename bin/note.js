#!/usr/bin/env node
const path = require('path');
const dayjs = require('dayjs');
const { Command } = require('commander');
const { default: inquirer } = require('inquirer');
const fs = require('fs');
const crossspawn = require('cross-spawn');
const logger = require("../utils/log");
const { EOL } = require('os');
const { error } = require('console');
const program = new Command();

program
    .option('-e, --edit', '启用编辑模式')
    .option('-a, --add [快速添加记录]', '快速添加记录')
    .option('-td, --todo [快速添加待办]', '快速添加待办')
    .option('-d, --delete', '快速删除记录')
    .option('-c,--createNew [文件名称]', '创建新的记录文件')
    .option('-o,--open <文件名称>', '打开指定文件')
    // .option('-s,--show', '全局查看')
    .action(async (data) => {
        const filePath = path.resolve(__dirname, '../note', 'note.md');
        const date = `**[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]**${EOL}`;
        const { edit, add, delete: _delete, todo, createNew, open } = data;
        if (_delete) {
            if (fs.existsSync(filePath)) {
                try {
                    fs.rename(filePath, filePath.replace('note.md', `note[${dayjs().format('YYYY-MM-DD')}].bak.md`), err => {
                        if (err) {
                            console.log(logger.error(err.message))
                        } else {
                            console.log(logger.info('删除成功'))
                        }
                    })
                } catch (error) {
                    console.log(logger.error(error.message))
                }
            } else {
                console.log(logger.warn('文件不存在'))
            }
        } else if (open) {
            const fileList = fs.readdirSync(path.resolve(__dirname, '../note'))
                .filter(file => file.endsWith('.md'));
            
                const fileName = fileList.find(file => file.includes(open));
                if (!fileName) {
                    console.log(logger.warn(`文件不存在,可使用 '-c ${open}' 创建新文件`))
                }else{
                    openFileWithDefaultEditor(path.resolve(__dirname, '../note', fileName))
                }
                
        } else if (edit) {
            // const promptList = [{
            //     type: "editor",
            //     message: "请记录:",
            //     name: "content",
            //     default: date
            //     // }, {
            //     //     type: "confirm",
            //     //     message: "是否确认保存？",
            //     //     name: "confirm",
            //     //     // prefix: "前缀"
            // }
            // ]
            // const answers = await inquirer.prompt(promptList);
            // // if (answers.confirm) {
            // fs.appendFileSync(filePath, `${EOL}${EOL}${answers.content}`);
            // }
            fs.appendFileSync(filePath, `${EOL}${EOL}${date}${EOL}`);
            openFileWithDefaultEditor(filePath)
        } else if (add) {
            // 快速添加
            fs.appendFileSync(filePath, `${EOL}${EOL}${date}- ${add}`);
            console.log(logger.info('添加成功:' + add))
        } else if (todo) {
            // 快速添加todoList
            fs.appendFileSync(filePath, `${EOL}${EOL}${date}- [ ] ${todo}`);
            console.log(logger.info('添加待办成功:' + todo))
        } else if (createNew) {
            const fileName = createNew === true ? 'note' : createNew;
            const date = dayjs().format('YYYY-MM-DD');
            openFileWithDefaultEditor(path.join(__dirname, '../note', `${fileName}[${date}].md`))
        } else if (!edit && !add && !todo && !createNew) {
            // 查看
            // fs.appendFileSync(filePath, `${EOL}${EOL}${date}${EOL}`);
            openFileWithDefaultEditor(filePath)
        }
    })
function openFileWithDefaultEditor(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '', { encoding: 'utf-8' });
    }
    const command = process.platform === 'win32' ? 'Typora' : 'open';
    const cs = crossspawn(command, [filePath], { stdio: 'inherit' });
    cs.addListener('error', error => console.log(logger.error(error.message)))
}



program.parse(process.argv);