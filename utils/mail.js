const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const iconv = require('iconv-lite');
const dayjs = require('dayjs');
const moment = require("moment-timezone");

// const base64Attachments = require('mailie-base64-attachments');

function parseEnvs(obj) {
    return {
        ...obj,
        MAIL_PASSWORD: Buffer.from(obj.MAIL_PASSWORD, 'base64').toString('utf8')
    }
}
const envPath = path.resolve(__dirname, '../', '.env')
const env = parseEnvs(dotenv.config({ path: envPath }).parsed);

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
        date: moment.tz("Asia/Shanghai"),
        headers: {
            'Content-Transfer-Encoding': 'base64',
            'Content-Type': 'text/plain; charset=GB2312',
            'Subject': addCodeTail(`${type === 'plan' ? '工作计划' : '工作总结'}[${date}]`),
            // 'From': `${addCodeTail(env.MAIL_USERNAME)} <${env.MAIL_SEND_ADDRESS}>`
        }
    };
    console.error("====mailOptions:", mailOptions)
    if (!content) {
        console.error("======不可发送空邮件")
    } else {
        if (type === 'plan' || type === 'report') {
            // 发送邮件
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
        }
    }
}

module.exports.sendDailyMail = sendDailyMail