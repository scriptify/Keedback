const express = require(`express`);
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
const { v4 } = require(`uuid`);
const { hash, compare } = require(`bcrypt`);
const path = require(`path`);

const { query, error, handleQueryPromise, requireLogin } = require(`./util.js`);

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(`unicorns like red black'n'red cookies. unicors know what they do`));
app.use(`/admin`, express.static(path.join(__dirname, `../client/build`)));

function generateKeys(num, res) {
  const promises = [];
  const keys = [];
  for (let i = 0; i < num; i++) {
    const currKey = v4();
    const obj = {
      value: currKey,
      takenBy: null
    };
    keys.push(obj);
    const promise = query(`INSERT INTO AccessKey SET ?;`, obj);
    promises.push(promise);
  }
  handleQueryPromise(Promise.all(promises), res, () => {
    res.json(keys);
  });
}

function login(res, isAdmin = false, UID) {
  res.cookie(`session`, {
    UID,
    isAdmin
  },
  { maxAge: 48 * 60 * 60 * 1000 });
}

app.post(`/api/:method`, (req, res) => {
  const { method } = req.params;
  switch (method) {

    case `login`: {
      const { username, password } = req.body;
      const promise = query(`SELECT pwHash, isAdmin, UID FROM User WHERE username = ?;`, [username]);
      handleQueryPromise(promise, res, (rows) => {
        if (rows.length === 0)
          error(res, `No such user.`);
        const { pwHash, isAdmin, UID } = rows[0];

        compare(password, pwHash.toString(`ascii`))
          .then((isAuth) => {
            if (!isAuth)
              error(res, `Wrong password.`);
            else {
              login(res, isAdmin, UID);
              res.json({ success: true, isAdmin });
            }
          });
      });
      break;
    }

    case `getVersion`: {
      requireLogin(req, res);
      const promise = query(`SELECT version FROM Version ORDER BY VID DESC LIMIT 1;`);
      handleQueryPromise(promise, res, (rows) => {
        res.json(rows[0]);
      });
      break;
    }

    case `getVersionInfo`: {
      requireLogin(req, res);
      const promise = query(`SELECT version, title, description FROM Version ORDER BY VID DESC LIMIT 1;`);
      handleQueryPromise(promise, res, (rows) => {
        res.json(rows[0]);
      });
      break;
    }

    case `setVersion`: {
      requireLogin(req, res, true);
      const { version, title, description } = req.body;
      const promise = query(`INSERT INTO Version SET ?;`, {
        version,
        title,
        description
      });
      handleQueryPromise(promise, res);
      break;
    }

    case `generateKeys`: {
      requireLogin(req, res, true);
      const { num } = req.body;
      generateKeys(num, res);
      break;
    }

    case `getKeys`: {
      requireLogin(req, res, true);
      const promise = query(`SELECT value, username AS takenBy FROM AccessKey AS ak LEFT OUTER JOIN User AS u ON (ak.takenBy = u.UID);`);
      handleQueryPromise(promise, res, (rows) => {
        res.json(rows);
      });
      break;
    }

    case `register`: {
      const { username, password, accessKey } = req.body;
      const promise = query(`SELECT * FROM AccessKey WHERE value = ? AND takenBy IS NULL;`, [accessKey]);
      handleQueryPromise(promise, res, (rows) => {
        if (rows.length === 0) {
          error(res, `Invalid access key!`);
          return;
        }

        hash(password, 5)
          .then((pwHash) => {
            const insertPromise = query(`INSERT INTO User SET ?;`, {
              username,
              pwHash
            });
            handleQueryPromise(insertPromise, res, ({ insertId }) => {
              const setKeyPromise = query(`UPDATE AccessKey SET takenBy = ? WHERE value = ?;`, [insertId, accessKey]);
              handleQueryPromise(setKeyPromise, res, () => {
                const keyManagementPromise = query(`SELECT * FROM KeyManagement;`);
                const numKeysPromise = query(`SELECT COUNT(KID) AS keyNum FROM AccessKey;`);
                Promise.all([keyManagementPromise, numKeysPromise])
                  .then(([keyManagement, numKeys]) => {
                    const { returnOnRegister, maxKeys } = keyManagement[keyManagement.length - 1];
                    const { keyNum } = numKeys[0];
                    if (keyNum < maxKeys) {
                      login(res, false, insertId);
                      generateKeys(returnOnRegister, res);
                    } else
                      error(res, `Sorry, maximum numbers of keys reached. But registered successfully!`);
                  });
              });
            });
          });
      });
      break;
    }

    case `setMaxKeys`: {
      requireLogin(req, res, true);
      const { num } = req.body;
      const promise = query(`UPDATE KeyManagement SET maxKeys = ?;`, [num]);
      handleQueryPromise(promise, res);
      break;
    }

    case `setReturnOnRegisterKeyNum`: {
      requireLogin(req, res, true);
      const { num } = req.body;
      const promise = query(`UPDATE KeyManagement SET returnOnRegister = ?;`, [num]);
      handleQueryPromise(promise, res);
      break;
    }

    case `addDevelopmentFeature`: {
      requireLogin(req, res, true);
      const { title, description } = req.body;
      const promise = query(`INSERT INTO Feature SET ?;`, {
        title,
        description
      });
      handleQueryPromise(promise, res, (rows) => {
        const promise1 = query(`INSERT INTO DevelopmentFeature SET FID = ?;`, [rows.insertId]);
        handleQueryPromise(promise1, res, (rows1) => {
          const DFID = rows1.insertId;
          res.json({
            DFID,
            title,
            description
          });
        });
      });
      break;
    }

    case `getDevelopmentFeatures`: {
      requireLogin(req, res);
      const promise = query(`SELECT DFID, title, description  FROM DevelopmentFeature NATURAL JOIN Feature;`);
      handleQueryPromise(promise, res, rows => res.json(rows));
      break;
    }

    case `addNewFeature`: {
      requireLogin(req, res, true);
      const { title, description } = req.body;
      const promise = query(`INSERT INTO Feature SET ?;`, {
        title,
        description
      });
      handleQueryPromise(promise, res, (rows) => {
        const promise1 = query(`INSERT INTO NewFeature SET FID = ?;`, [rows.insertId]);
        handleQueryPromise(promise1, res, (rows1) => {
          const NFID = rows1.insertId;
          res.json({
            NFID,
            title,
            description,
            votes: 0,
            hasVoted: false
          });
        });
      });
      break;
    }

    case `getNewFeatures`: {
      requireLogin(req, res);
      const promise = query(`SELECT NFID, title, description, COUNT(VID) AS votes FROM Vote AS v NATURAL RIGHT OUTER JOIN (SELECT * FROM NewFeature NATURAL JOIN Feature) AS temp GROUP BY NFID;`);
      handleQueryPromise(promise, res, (features) => {
        const promise1 = query(`SELECT NFID FROM Vote WHERE UID = ?;`, [req.cookies.session.UID]);
        handleQueryPromise(promise1, res, (votes) => {
          features = features.map((feature) => {
            const filtered = votes.filter(v => v.NFID === feature.NFID);
            let hasVoted = false;
            if (filtered.length > 0)
              hasVoted = true;
            return Object.assign({}, feature, {
              hasVoted
            });
          });
          res.json(features);
        });
      });
      break;
    }

    case `moveNewFeatureToDevelopmentStage`: {
      requireLogin(req, res, true);
      const { NFID } = req.body;
      const promise = query(`SELECT FID FROM NewFeature WHERE NFID = ?;`, [NFID]);
      handleQueryPromise(promise, res, (rows) => {
        if (rows.length === 0)
          error(res, `No such new feature!`);
        const { FID } = rows[0];
        const promise1 = query(`DELETE FROM NewFeature WHERE NFID = ?;`, [NFID]);
        handleQueryPromise(promise1, res, () => {
          const promise2 = query(`INSERT INTO DevelopmentFeature SET FID = ?;`, [FID]);
          handleQueryPromise(promise2, res, (rows1) => {
            res.json({ DFID: rows1.insertId });
          });
        });
      });
      break;
    }

    case `deleteDevelopmentFeature`: {
      requireLogin(req, res, true);
      const { DFID } = req.body;
      const promise = query(`DELETE FROM DevelopmentFeature WHERE DFID = ?;`, [DFID]);
      handleQueryPromise(promise, res);
      break;
    }

    case `deleteNewFeature`: {
      requireLogin(req, res, true);
      const { NFID } = req.body;
      const promise = query(`DELETE FROM NewFeature WHERE NFID = ?;`, [NFID]);
      handleQueryPromise(promise, res);
      break;
    }

    case `upvoteFeature`: {
      requireLogin(req, res);
      const { NFID } = req.body;
      const { UID } = req.cookies.session;

      const promise = query(`INSERT INTO Vote SET ?;`, { NFID, UID });
      handleQueryPromise(promise, res);
      break;
    }

    case `createFeedback`: {
      requireLogin(req, res);
      const { title, text, type, email } = req.body;

      const promise = query(`INSERT INTO Feedback SET ?;`, {
        UID: req.cookies.session.UID,
        title,
        userText: text,
        type,
        email
      });
      handleQueryPromise(promise, res);
      break;
    }

    case `processFeedback`: {
      requireLogin(req, res, true);
      const { FBID } = req.body;
      const promise = query(`UPDATE Feedback SET processed = TRUE WHERE FBID = ?;`, [FBID]);
      handleQueryPromise(promise, res);
      break;
    }

    case `getFeedback`: {
      requireLogin(req, res, true);
      const promise = query(`SELECT * FROM Feedback;`);
      handleQueryPromise(promise, res, rows => res.json(rows));
      break;
    }

    case `isLoggedIn`: {
      res.json({
        isLoggedIn: (req.cookies && req.cookies.session && req.cookies.session.UID !== null && req.cookies.session.UID !== undefined)
      });
      break;
    }

    case `getKeyMetadata`: {
      requireLogin(req, res, true);
      const promise = query(`SELECT * FROM KeyManagement;`);
      handleQueryPromise(promise, res, rows => res.json(rows[0]));
      break;
    }

    case `logout`: {
      requireLogin(req, res);
      res.clearCookie(`session`);
      res.json({ success: true });
      break;
    }

    default:
      error(res, `Unkown method: ${method}`);
  }
});

app.listen(3000);
