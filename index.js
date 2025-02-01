const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));

app.get('/words', (req, res) => {
  const filePath = path.join(__dirname, 'words.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
