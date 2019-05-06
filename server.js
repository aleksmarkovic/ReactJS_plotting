const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require("fs");

const buffer = fs.readFileSync("S001R01.edf").buffer;
const edfdecoder = require("edfdecoder");
const decoder = new edfdecoder.EdfDecoder();
decoder.setInput( buffer );
decoder.decode();
const myEdf = decoder.getOutput();

const numberOfSignals = myEdf.getNumberOfSignals();

const numberOfRecords = myEdf.getNumberOfRecords();

let signalIndex = 0;
let recordIndex = 0;

const aSignal1 = myEdf.getPhysicalSignal(signalIndex, recordIndex);
const aSignal2 = myEdf.getPhysicalSignal(signalIndex, recordIndex+1);

const eegData1 = Object.keys(aSignal1).map(function(key) {              
    return aSignal1[key];
});
const eegData2 = Object.keys(aSignal2).map(function(key) {              
  return aSignal2[key];
});
console.log(eegData1.length);

app.listen(port, () => console.log(`Listening on port ${port}`));

/*fs.readFile( __dirname + '/Z001.txt', function (err, data) {
    if (err) {
      throw err; 
    }
    console.log(data.toString());
    textFile = data.toString();
  });*/
// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ signal1: aSignal1, signal2: aSignal2 , length: eegData1.length});
});