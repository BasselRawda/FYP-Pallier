const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const handlebars = require('express-handlebars')
const credentials = require('./credentials.js')
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
const paillier = require('paillier-js')
const bigInt = require('big-integer')

const key = new Cryptr(credentials.key)
const app = express()
const server = http.createServer(app)

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webserver'
})
/* Body Parser Middleware */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
/* View Engine and static folder serving */
app.set('views', path.join(__dirname, 'views'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.engine('handlebars', handlebars({ defaultLayout: 'template', extname: 'handlebars' }))
app.set('view engine', 'handlebars')

/* Helper Methods */
const mailTo = require('./helper-methods').mailTo
const getRequest = require('./helper-methods').getRequest
const postRequest = require('./helper-methods').postRequest
/* End Helper Methods */

// Homepage.
app.get("/", (_, res) => {
    res.render('index')
})
// ABOUT page
app.get("/about", (_, res) => {
    res.render('about')
})
// FAQ page
app.get("/faq", (_, res) => {
    res.render('faq')
})
// Help page
app.get("/help", (_, res) => {
    res.render('help')
})
// Create election form page.
app.get("/create", (_, res) => {
    res.render('election')
})
// Enter vote id page: submit your vote button.
app.get("/vote", (_, res) => {
    res.render('vote')
})
// Enter election id and password to view your results.
app.get("/results", (_, res) => {
    res.render('resultform')
})
app.get("/error/results", (_, res) => {
    res.render('error', { error: "Data entered is invalid" })
})
// Thank you page. 
app.get("/thankyou/:id", (req, res) => {
    if (req.params.id == 'e')
        res.render('thankyou', { text: "Your election has been created. Please check your email for more details. " })
    else if (req.params.id == 'v')
        res.render('thankyou', { text: "Your vote has been submitted. " })
})

// Get results for election.
app.get("/results/:electionid", (req, res) => {
    let electionid = key.decrypt(req.params.electionid)
    postRequest(3002, "/verify", { electionid: electionid }).then((data) => {
        connection.query(`SELECT option0, option1 FROM elections WHERE electionid = '${electionid}'`, function (err, rows, _) {
            try {
                if (rows == null || data.option0 == data.option1 && data.option0 == 0)
                    res.render('error', { error: "Nobody Voted yet." })
                res.status(200).render('results', {
                    option0: rows[0].option0,
                    option1: rows[0].option1,
                    votesCount0: data.option0,
                    votesCount1: data.option1
                })
            } catch (err) {
                res.status(500).render('error', { error: "Database Error: " + err.message })
            }
        })
    }).catch(() => {
        res.render('error', { error: "Election is cancelled due to complications." })
    })
})

// get election details for voting page
app.get("/vote/:voterid", (req, res) => {
    let voterid = key.decrypt(req.params.voterid)
    getRequest(3002, "/" + voterid).then((data) => {
        connection.query(`SELECT electionName, question, option0, option1, startdate, enddate FROM elections WHERE electionid = '${data.electionid}'`, function (err, rows, _) {
            try {
                if (err || new Date(rows[0].enddate) < Date.now())
                    res.status(404).render('error', { error: "Election expired, you're late!" })
                else if (data.voted) res.render('error', { error: "You already voted" })
                else {
                    res.status(200).render('voting', {
                        electionName: rows[0].electionName,
                        question: rows[0].question,
                        option0: rows[0].option0,
                        option1: rows[0].option1,
                        voterid: voterid
                    })
                }
            } catch (err) {
                res.status(500).render('error', { error: "Database Error" })
            }
        })
    }).catch(() => { // reject promise handler
        res.render('error', { error: "You are not eligable for voting, go back home." })
    })
})

// Add election after submission of creation form.
app.post("/election/add", async (req, res) => {
    try {
        const electionid = Date.now()
        let recipients = req.body.recipients.split(";").filter(n => n).filter((value, index, self) => self.indexOf(value) === index)
        // Data to send to trustee server
        const requestData = {
            electionid: electionid,
            numberOfVotes: recipients.length
        }
        let passHash = bcrypt.hashSync(req.body.password, 10)
        let query = `INSERT INTO elections 
        (electionid, electionName, email, recipients, password, option0, option1, question, startdate, enddate) 
        VALUES (
            "${electionid}", 
            "${req.body.electionName}", 
            "${req.body.email}", 
            "${req.body.recipients}", 
            "${passHash}", 
            "${req.body.option0}", 
            "${req.body.option1}", 
            "${req.body.question}", 
            "${req.body.startdate}", 
            "${req.body.enddate}"
            )`.replace(/(\n)/gm, " ").replace(/\s{2,} /gm, " ")

        connection.query(query, function (err, _, _) {
            if (err || new Date(req.body.enddate) < Date.now()) {
                res.status(500).send("Check your inputs." + err.message)
            }
        })
        getRequest(3002, "/pk/1").then((data) => {
            let key = new paillier.PublicKey(bigInt(data.n), bigInt(data.g))
            let encryptedData = {
                electionid: electionid,
                share: key.encrypt(0).toString(),
                vote: key.encrypt(0).toString()
            }
            postRequest(3001, "/insert", encryptedData).catch(() => res.render('error'))
        }).catch(() => {
            res.status(500).send()
        })
        postRequest(3002, "/insert", requestData).catch(() => res.render('error'))
        mailTo(req.body.email, "Your sElection has been Created.", `ElectionID: ${electionid}, Password: ${req.body.password}`)
        getRequest(3002, "/mail/" + electionid).then((data) => {
            for (let i = 0; i < recipients.length; i++) {
                mailTo(recipients[i], "You have been chosen to vote on an important issue", `Here is your VoterID: ${data[i].voterid}`)
            }
        }).catch(() => {
            res.render('error')
        })
        res.status(200).send()
    } catch (err) {
        res.render('error', { error: "Failed. Try again later." })
    }
})

// send post request after voting.
app.post("/voted/:voterid", (req, res) => {
    getRequest(3002, "/pk/1").then((data) => {
        let key = new paillier.PublicKey(bigInt(data.n), bigInt(data.g))
        getRequest(3002, "/" + req.params.voterid).then((voterData) => {
            if (!data.voted) {
                let EncryptedVote = key.encrypt(req.body.share).toString()
                let shareResult = (parseInt(req.body.share) - parseInt(voterData.sharecommon)) * -1
                let EncryptedShare = key.encrypt(shareResult).toString()
                const requestData = {
                    voterid: req.params.voterid,
                    electionid: voterData.electionid,
                    share: EncryptedShare,
                    vote: EncryptedVote
                }
                const { voterid, ...shareData } = requestData;
                postRequest(3001, "/add/share", shareData).catch(() => res.render('error'))
                postRequest(3002, "/voted", { voterid }).catch(() => res.render('error'))
            }
            res.status(200).send()
        }).catch(() => {
            // Something went wrong data not sent properly.
            res.status(500).send()
        })
    }).catch()
})

// check password authorization to allow results view. generate token for electionid.
app.post("/auth/election", (req, res) => {
    let password = req.body.password
    let electionid = req.body.electionid
    connection.query(`SELECT password FROM elections WHERE electionid = '${electionid}'`, function (err, rows, _) {
        try {
            if (err || rows == null) res.status(500).send()
            if (bcrypt.compareSync(password, rows[0].password))
                res.status(200).send({ electionid: key.encrypt(electionid) })
            else res.status(404).send()
        } catch (error) {
            res.status(500).send()
        }
    })
})

// generate token for voterid.
app.post("/auth/voter", (req, res) => {
    let voterid = req.body.voterid
    res.status(200).send({ voterid: key.encrypt(voterid) })
})

// Sends any other routes back to error
app.get("*", (_, res) => {
    res.render('error', { error: "Page not found!" })
})

process.on('uncaughtException', function (err) {
    //console.error(err)
})

server.listen(3000, '0.0.0.0', () => {
    console.info("Webserver listening on: " + server.address().address + ":" + server.address().port)
})