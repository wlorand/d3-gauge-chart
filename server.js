/**
 * File: server.js
 * Desc: simple express server
 */

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3003;

const app = express();

// simple static api to serve index.html (could use express.static instead)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './client/src/'));
});

// listen
app.listen(PORT, () => {
  console.log(`express server started and running on port ${PORT}`);
});
