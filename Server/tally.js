const mysql = require('mysql')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const paillier = require('paillier-js')
const bigInt = require('big-integer')

const app = express()
const server = http.createServer(app)

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tally'
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* Helper Methods */
const getRequest = require('./helper-methods').getRequest
/* End Helper Methods */

// send share and vote sum for election.
app.get("/getshares/:electionid", (req, res) => {
    connection.query(`SELECT share, vote FROM shares WHERE electionid = ${req.params.electionid}`, (err, rows, _) => {
        if (err || rows[0] === undefined)
            res.status(404).send()
        else
            res.status(200).send(rows[0])
    })
})

// initialize share and vote for share table.
app.post("/insert", (req, res) => {
    connection.query(`INSERT INTO shares (share, electionid, vote) VALUES (${req.body.share}, ${req.body.electionid}, ${req.body.vote})`, function (err, rows, fields) {
        if (err)
            res.status(500).send(err)
    })
    res.status(200).send()
})

// add getRequest for public key. add share after voting. update shares.
app.post("/add/share", (req, res) => {
    getRequest(3002, "/pk/1").then((data) => {
        let key = new paillier.PublicKey(bigInt(data.n), bigInt(data.g))
        let promise = new Promise((resolve, reject) => {
            connection.query(`SELECT share,vote FROM shares WHERE electionid=${req.body.electionid}`, function (err, rows, fields) {
                if (err)
                    res.status(500).send()
                let oldShare = rows[0].share
                let oldVote = rows[0].vote
                let addedSum = {
                    share: key.addition(oldShare, req.body.share).toString(),
                    vote: key.addition(oldVote, req.body.vote).toString()
                }
                resolve(addedSum)
            })
        })
        promise.then((data) => {
            connection.query(`UPDATE shares SET share =${data.share}, vote =${data.vote} WHERE electionid = ${req.body.electionid}`, function (err, rows, fields) {
                if (err)
                    res.status(500).send()
                res.status(200).send()
            })
        })
    })
})

process.on('uncaughtException', function (err) {
    //console.log(err)
})

server.listen(3001, '0.0.0.0', () => {
    console.log("Tally Server listening on: " + server.address().address + ":" + server.address().port)
})