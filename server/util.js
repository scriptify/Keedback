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

function query(connection, sqlQuery) {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, rows) => {
      if (!err)
        resolve(rows);
      else
        reject(err);
    });
  });
}

function preparedQuery(connection, sqlQuery, inserts) {
  return query(connection, connection.format(sqlQuery, inserts));
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
  preparedQuery: preparedQuery.bind(null, connection),
  connection,
  error,
  queryError
};
