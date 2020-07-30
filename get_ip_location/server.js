// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var fetch = require('node-fetch');
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//fetching location from ip
async function getLoc(ip){
  let loc = await fetch("https://www.iplocate.io/api/lookup/"+ip.toString());
  let locjson = await loc.json();
  return {latitude:locjson.latitude,longitude:locjson.longitude}
}

//responding with ip,location,software
app.get("/api/whoami",async (req,res)=>{
  var ip =req.header('x-forwarded-for').split(',')[0]
  var lang = req.header('Accept-Language')
  var software = req.header('User-Agent')
  var loc = await getLoc(ip);
  var resp = {ipaddress:ip,language:lang,software:software,latitude:loc.latitude,longitude:loc.longitude} 
  console.log(resp)
  res.json(resp)
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
