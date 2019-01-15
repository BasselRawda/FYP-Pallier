const mysql = require('mysql')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const paillier = require('paillier-js')

const app = express()
const server = http.createServer(app)

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trustee'
});

// Get public and private key for encryption/decryption
const keys = require('./paillier-keys').keys
const pk = keys.publicKey
const sk = keys.privateKey

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* Helper Methods */
const getRequest = require('./helper-methods').getRequest
/* End Helper Methods */

// query db to get voter and send.
app.get("/:voterid", (req, res) => {
    connection.query(`SELECT * FROM commons WHERE voterid = ${req.params.voterid}`, (err, rows, _) => {
        if (err || rows[0] === undefined)
            res.status(404).send()
        try {
            res.status(200).send(rows[0])
        } catch (err) {
            res.status(500).send()
        }
    })
})

// send public key for encryption.
app.get("/pk/:id", (req, res) => {
    res.status(200).send(pk)
})

// get all voterids to send to webserver for mailer.
app.get("/mail/:electionid", (req, res) => {
    connection.query(`SELECT voterid FROM commons WHERE electionid = ${req.params.electionid}`, (err, rows, _) => {
        if (err || rows[0] === undefined)
            res.status(404).send()
        try {
            res.status(200).send(rows)
        } catch (err) {
            res.status(500).send()
        }
    })
})

// request shares from tally and compare
app.post("/verify", (req, res) => {
    getRequest(3001, "/getshares/" + req.body.electionid).then((data) => {
        connection.query(`SELECT sharecommon FROM commons WHERE electionid = ${req.body.electionid} AND voted = 1`, function (err, rows, _) {
            if (err || rows === undefined)
                res.status(404).send()
            try {
                let totalEntries = rows.length
                let totalSharecommon = 0
                let decryptedShare = parseInt(sk.decrypt(data.share).toString()) * -1
                let decryptedVote = parseInt(sk.decrypt(data.vote).toString())
                let voteVerification;
                rows.forEach(element => {
                    totalSharecommon += element.sharecommon
                });
                voteVerification = decryptedShare + totalSharecommon
                if (voteVerification != decryptedVote)
                    res.status(500).send()
                let voteCount = {
                    option0: totalEntries - decryptedVote,
                    option1: decryptedVote
                }
                res.status(200).send(voteCount)
            } catch (err) {
                res.status(500).send()
            }
        })
    }).catch(() => {
        res.status(500).send()
    })
})

// initialize the trustee sharecommons.
app.post("/insert", (req, res) => {
    try {
        for (let i = 0; i < req.body.numberOfVotes; i++) {
            let sharecommon = Math.random() * 2000000 + 10
            let voterid = Math.random() * 2000000 + 10
            connection.query(`INSERT INTO commons (electionid, voterid, sharecommon,voted) VALUES ("${req.body.electionid}", "${voterid}", "${sharecommon}",0)`, () => {
                if (err)
                    res.status(500).send()
            })
        }
        res.status(200).send()
    } catch (err) {
        res.status(500).send()
    }
})

// request to be done after voting to mark the voter as voted.
app.post("/voted", (req, res) => {
    try {
        connection.query(`UPDATE commons SET voted = 1 WHERE voterid ="${req.body.voterid}"`, () => {
            if (err)
                res.status(500).send()
        })
        res.status(200).send()
    } catch (err) {
        res.status(500).send()
    }
})

process.on('uncaughtException', function (err) {
    //console.log(err)
})

server.listen(3002, '0.0.0.0', () => {
    console.log("Trustee Server listening on: " + server.address().address + ":" + server.address().port)
})