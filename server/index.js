#!/usr/bin/env node

const { getKeedbackRc } = require(`./util.js`);
const createServer = require(`./server.js`);

getKeedbackRc()
  .then(conf => createServer(conf));
