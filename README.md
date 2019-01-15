# sElect 0.0.8

sElect implements a Three-way Secure and Verifiable E-Voting system, in which voters remain anonymous, including to whom the voter elects, using these technologies.

  - Paillier homomorphic encrpytion.
  - Database decentralization and distribution.
  - Magic

### Technology

sElect uses a number of open source projects to work properly:

* [Handlebars]- View engine used for templating pages server-side.
* [node.js] - evented I/O for the backend.
* [Express] - fast node.js network app framework.
* [jQuery] - duh.

### Installation

sElect requires [node.js] v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd FYP-Paillier-Voting\Server
$ npm i
$ npm run dev
```

For production environments...

```sh
$ npm install --production
$ npm start
```

### Development

sELect uses Nodemon + Concurrently for quick development.
Make a change in your file and instantanously see your updates!
In order to change ports for severs independently open webserver.js, authverifier.js, and authcount.js and modify these:

```js
server.listen(3000, '0.0.0.0', () => {
    console.log("... listening on: " + server.address().address + ":" + server.address().port)
})
```
### Todos

 - [ ] ***Write test cases and pen-test***.
 - [x] _Add process environment variable to set ports simultaneously_.
 - [x] Optimize mobile views.
 - [x] Add more Todos.
 - [x] **Restructure Database for voting validation**.
 - [x] **Add encryption server-side**.
 - [x] **Refactor and Complete authcount and authverifier**.
 - [x] **Add check tally for admin page**.
 - [x] **Setup Node-Mailer**.
 - [x] Add password for admin.
 - [x] Database Optimizations.
 - [ ] Documentation.
 - [x] Build on the shoulders of giants.
 - [x] Update to-do list.

License
----

- Apache License, Version 2.0


### Credit
- ***Mohammed Mardini*** - Maintainer/Developer.
- ***Bassel Rawda*** - Developer/Contributer.
- ***Dr. Nassar*** - Developer/Reporter.


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen.)


   [node.js]: <http://nodejs.org>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
   [Handlebars]: <http://gulpjs.com>
