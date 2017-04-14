const mysql = require(`mysql`);
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

const connection = mysql.createConnection({
  host: `localhost`,
  user: `root`,
  password: `1234`,
  database: `UserManagement`,
  multipleStatements: true
});

connection.connect((err) => {
  if (err)
    console.log(`Could not connect to database: ${err}`);
});

connection.query(sqlDump);

module.exports = {
  query: query.bind(null, connection),
  handleQueryPromise,
  connection,
  error,
  queryError,
  requireLogin
};
