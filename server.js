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
//console.log(myEdf);

// Get the number of signals, usually it is equivalent to the number of sensors
const numberOfSignals = myEdf.getNumberOfSignals();

// get the number of record
// note that each signal can have multiple records. A classic case is to have 1-second-long records
const numberOfRecords = myEdf.getNumberOfRecords();

// Get the signal, but you need to specify which signal and the index of the record
let signalIndex = 0;
let recordIndex = 0;

// for (let i=0; i<numberOfRecords; i++){
//     console.log(myEdf.getPhysicalSignal( signalIndex, recordIndex ));
// }
//console.log(myEdf.getPhysicalSignal( signalIndex, recordIndex ));
const aSignal1 = myEdf.getPhysicalSignal(signalIndex, recordIndex);
const aSignal2 = myEdf.getPhysicalSignal(signalIndex, recordIndex+1);

const eegData1 = Object.keys(aSignal1).map(function(key) {              
    return aSignal1[key];
});
const eegData2 = Object.keys(aSignal2).map(function(key) {              
  return aSignal2[key];
});
console.log(eegData1.length);
//var textFile;
// console.log that your server is up and running
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