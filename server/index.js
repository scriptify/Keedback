const express = require(`express`);
const path = require(`path`);

const { query, queryError, error } = require(`./util.js`);

const app = express();

app.use(`/admin`, express.static(path.join(__dirname, `../client/build`)));

app.post(`/api/:method`, (req, res) => {
  const { method } = req.params;
  switch (method) {
    case `getVersion`:
      query(`SELECT version FROM Version ORDER BY VID DESC LIMIT 1;`)
        .then((rows) => {
          res.json(rows[0]);
        })
        .catch(err => queryError(err, res));
      break;

    case `getVersionInfo`:
      query(`SELECT version, title, description FROM Version ORDER BY VID DESC LIMIT 1;`)
      .then((rows) => {
        res.json(rows[0]);
      })
      .catch(err => queryError(err, res));
      break;

    /* case `setVersion`: {
      const { version, title, description } = req.params;
      preparedQuery(`INSERT INTO Version (version, title, description) VALUES (??, ??, ??)`, [
        version,
        title,
        description,
        true
      ])
      .then(() => res.json({ message: `success` }));
      break;
    }*/

    default:
      error(`Unkown method: ${method}`);
  }
});

app.listen(3000);
