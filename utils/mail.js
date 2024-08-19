const {env : _env} = require('./env');
const nodemailer = require('nodemailer');
const iconv = require('iconv-lite');
const dayjs = require('dayjs');
const logger = require("./log")
const moment = require("moment-timezone");
const {decrypt} = require("../utils/encrypt")

// const base64Attachments = require('mailie-base64-attachments');

function parseEnvs(obj) {
    return {
        ...obj,
        MAIL_PASSWORD: decrypt(obj.MAIL_PASSWORD)
    }
}
const env = parseEnvs(_env);

// 使用 SMTP 发送邮件
const transporter = nodemailer.createTransport({
    host: env.MAIL_SEND_IP,
    // port: env.MAIL_SEND_PORT || 993,
    secure: true, // 如果你的 SMTP 服务器使用的是 SSL，则为 true
    auth: {
        user: env.MAIL_FROM_ADDRESS,
        pass: env.MAIL_PASSWORD
    }
});

// 使用 base64 编码的附件
// transporter.use('compile', base64Attachments());


const current = dayjs().format('YYYY-MM-DD')
const enCode = function (str) {
    return iconv.encode(str, 'GB2312')
}
const addCodeTail = function (str) {
    return '=?gb2312?B?' + iconv.encode(str, 'GB2312').toString('base64') + '?='
}
const encodeQuotedPrintable = function (str) {
    const arr = str.split(/\r?\n/g);

    let quotedPrintableArr = [];
    for (let j = 0; j < arr.length; j++) {

        // 默认utf-8编码
        const encoded = Buffer.from(arr[j], 'utf8').toString('hex');
        let quotedPrintable = ''
        for (let i = 0; i < encoded.length; i += 2) {
            const hex = encoded.substr(i, 2);
            const charCode = parseInt(hex, 16);
            if ((charCode >= 33 && charCode <= 60) ||
                (charCode >= 62 && charCode <= 126)) {
                // 可打印字符直接转换
                quotedPrintable += String.fromCharCode(charCode);
            } else {
                // 非可打印字符使用=加两位十六进制数表示
                quotedPrintable += `=${hex.toUpperCase()}`;
            }
        }
        quotedPrintableArr.push(quotedPrintable)
    }


    return '<div>' + quotedPrintableArr.join('</div><div>') + '</div>';
}
function sendDailyMail(date = current, type = 'plan', content = '') {
    // const encodedMailContent = enCode(content);
    // 邮件内容及编码设置
    const mailOptions = {
        from: `"${env.MAIL_USERNAME}" <${env.MAIL_SEND_ADDRESS}>`,
        from: `"${env.MAIL_USERNAME}" <${env.MAIL_FROM_ADDRESS}>`,
        to: env.MAIL_TO_ADDRESS,
        // subject: `${type === 'plan' ? '工作计划' : '工作总结'}[${date}]`,
        // subject: iconv.encode('测试邮件24-08-14', 'GBK'),
        text: enCode(content),
        // html: enCode(encodeQuotedPrintable(content)),
        date: moment.tz("Asia/Shanghai"),
        headers: {
            'Content-Transfer-Encoding': 'base64',
            'Content-Type': 'text/plain; charset=GB2312',
            'Subject': addCodeTail(`${type === 'plan' ? '工作计划' : '工作总结'}[${date}]`),
            // 'From': `${addCodeTail(env.MAIL_USERNAME)} <${env.MAIL_SEND_ADDRESS}>`
        }
    };
    if (!content) {
        console.log(logger.error("======不可发送空邮件"))
    } else {
        if (type === 'plan' || type === 'report') {
            // 发送邮件
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(logger.error(error));
                }
                console.log(logger.info('Message sent: '+ info.messageId));
            });
        }
    }
}

module.exports.sendDailyMail = sendDailyMail