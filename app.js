var bodyParser = require('body-parser')
var express = require('express')
var app = express()
var port = process.env.PORT || 5000;
var path = require('path');
var server = require('http').createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
var needle = require('needle');
// var config = require("./config.js")
const bcrypt = require('bcrypt')
const saltRounds = 10;
const session = require('express-session')
var redis = require('redis');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.post('/login', function (req, res) {
  var user = req.body.user;
  var pass = req.body.pass;
  checkCred(user, pass, function(isValid) {
    if (isValid) {
      res.send({"status":"SUCCESS"})
      req.session["user"] = user;


    } else {
      res.send({"status":"FAILURE"})
    }

  })

})

var client = redis.createClient(); //creates a new client
client.on('connect', function() {
  console.log('connected Redis');
});


//populate what I want
bcrypt.genSalt(saltRounds, function(err, salt) {
  bcrypt.hash("ddd", salt, function(err, hash) {
      // Store hash in your password DB.
      client.set('creds', JSON.stringify({"dd":hash}));
      console.log(hash)
      
  });
});

//set view perms of dd to dd2 and dd3
client.hset(["hash key", "dd2", "dd3"]);
//inventory of dd

var inventory = [
  {product_name: "red sweater",
   classification: "clothes",
    tags: ["red", "comfortable"]},
  {product_name: "blue sweater",
  classification: "clothes",
    tags: ["blue", "comfortable"]}
]
client.set("dd-inventory", JSON.stringify(inventory))




function checkCred(user, pass, callback) {
  client.get('creds', function(err, reply) {
    if (err) {
      callback(false);
    }
    console.log(reply)
    
    reply = JSON.parse(reply);
    console.log(reply)
    var t_user = reply[user];
    if (t_user == null || t_user == undefined) {
      console.log(t_user)
      callback(false);
    }

    bcrypt.compare(pass,t_user, function(err, res) {
      console.log(t_user);
      console.log(pass);
      console.log(res);
      // res == true
      callback(res)
    });
  });
}
app.get("/lookup", function(req, res) {
  var q = req.query;
  //user is looking up himself
  if (req.session["user"] == q.user) {
    //throw everything at him
    client.get(q.user + "-inventory", function(err, reply) {
      if (err) {
        console.log("error here");
      }
      reply = JSON.parse(reply);
      res.send({"status": "SUCCESS", "data" : reply});

    });
  }
  res.send({"status": "FAIL"});
  
});

app.use(express.static('public'))

app.get('/', function(req, res){
  
});



server.listen(port, function () {
  console.log("server running on port: " + port.toString())
})
