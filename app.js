
var express = require('express')
var app = express()
var port = process.env.PORT || 5000;
var path = require('path');
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
// var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
var needle = require('needle');
var config = require("./config.js")
app.use(express.static('public'))

//Auth ----




//test blk
var options = {
  headers: 
  { "Content-Type": "audio/flac",
    "Transfer-Encoding": "chunked"},
  username: config.IBM_STT_USER,
  password: config.IBM_STT_PASS
}


needle.post(config.IBM_STT_URL, fs.createReadStream('audio-file.flac'), options, function(err, resp) {
  console.dir(resp.body.results[0].alternatives)
});








app.get('/', function(req, res){
  
});



server.listen(port, function () {
  console.log("server running on port: " + port.toString())
})
