# Assessment

1 folder
  - backend


requires [Node.js](https://nodejs.org/)  to run.
Install the dependencies and devDependencies and start the server.

```sh
$ cd backend
$ npm install
```

You need to execute command :
create database with name `etiqa`
* STEP 1 - run backend server
```sh
$ cd backend
$ node_modules/.bin/sequelize db:migrate (migration)
$ node index.js (run express API service )
```
* STEP 2 - run app application

```sh
$ http://localhost:2043/
```
