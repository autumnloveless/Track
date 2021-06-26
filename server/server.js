const express = require('express');
const api = require('../routes/api');

const server = express();
server.use(express.json());

server.use('/api', api);

module.exports = server;