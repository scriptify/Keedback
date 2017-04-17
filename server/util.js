const mysql = require(`mysql`);
const fs = require(`fs`);
const path = require(`path`);
const sqlDump = require(`./sql.js`);

function error(res, msg) {
  res.json({ error: msg });
}

function queryError(errMsg, res) {
  error(res, `There was an unexptected error.`);
  console.log(`SQL error:`);
  console.log(errMsg);
}

function query(connection, sqlQuery, data = {}) {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, data, (err, rows) => {
      if (!err)
        resolve(rows);
      else
        reject(err);
    });
  });
}

function handleQueryPromise(promise, res, resolve = () => res.json({ succes: true })) {
  promise
    .then(resolve)
    .catch(err => queryError(err, res));
}

function requireLogin(req, res, admin = false) {
  if (!req.cookies || !req.cookies.session || !req.cookies.session.UID)
    error(res, `You need to login to perform this action.`);

  if (admin && !req.cookies.session.isAdmin)
    error(res, `You don't have enough permissions to access this functionality.`);
}

function getKeedbackRc() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), `.keedbackrc`), `utf8`, (err, data) => {
      if (err)
        reject(err);

      const obj = JSON.parse(data);

      resolve(obj);
      return true;
    });
  });
}

function connect({ host, user, password, database }) {
  const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true
  });

  connection.connect((err) => {
    if (err)
      console.log(`Could not connect to database: ${err}`);
  });

  connection.query(sqlDump);
  return connection;
}

module.exports = {
  query,
  handleQueryPromise,
  error,
  queryError,
  requireLogin,
  getKeedbackRc,
  connect
};
