const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require("fs");

var textFile;
// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

fs.readFile( __dirname + '/Z001.txt', function (err, data) {
    if (err) {
      throw err; 
    }
    console.log(data.toString());
    textFile = data.toString();
  });
// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: textFile });
});