const http = require('http')
const nodemailer = require('nodemailer')
const credentials = require('./credentials')

function getRequest(port, path) {
    const optionsGET = {
        host: "localhost",
        port: port,
        path: path,
    }
    return new Promise((resolve, reject) => {
        http.get(optionsGET, (response) => {
            if (response.statusCode != 200) {
                reject()
            } else {
                response.on('data', (data) => {
                    resolve(JSON.parse(data))
                })
            }
        })
    })
}

function postRequest(port, path, requestData) {
    const optionsPOST = {
        host: "localhost",
        port: port,
        path: path,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(requestData))
        }
    }
    return new Promise((resolve, reject) => {
        const request = http.request(optionsPOST, (response) => {
            if (response.statusCode != 200)
                reject()
            else {
                response.on('data', (data) => {
                    resolve(JSON.parse(data))
                })
            }
        })
        request.write(JSON.stringify(requestData))
        request.end()
    })
}

async function mailTo(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: credentials.email,
            pass: credentials.password
        }

    });
    let mailOptions = {
        from: credentials.email,
        to: to,
        subject: subject,
        text: text
    };
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Invalid Email. ");
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
    transporter.close()
}

module.exports = {
    getRequest, postRequest, mailTo
}