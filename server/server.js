const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const http = require('http');
const https = require('https');
const mysql = require('mysql2');
const bodyParser = require('body-parser')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('353118485015-qerafpisj7krrpuhsuivb7066j3q06d0.apps.googleusercontent.com');
//const FastRateLimit = require("fast-ratelimit").FastRateLimit;
/*var messageLimiter = new FastRateLimit({
  threshold : 10,
  ttl       : 60
});*/

const privateKey = fs.readFileSync('./sslcert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
const ca = fs.readFileSync('./sslcert/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

let app = express();
app.use(bodyParser.json());

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const connection = mysql.createConnection({
	host: 'makerapi.host',
	user: 'remote',
	database: 'MAKER',
	password: 'makerssecretrock'
});

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// --------------- ROUTES -----------------
app.post('/userteams', getUserTeams);

// ----------------------------------------

// -------------- MAKER API --------------

async function verify(token) {
  try{
    let ticket = await client.verifyIdToken({
        idToken: token,
        audience: '353118485015-qerafpisj7krrpuhsuivb7066j3q06d0.apps.googleusercontent.com',
    });
    let payload = ticket.getPayload();
    let userid = payload['sub'];
    let profilePic = payload['picture'];
    let name = payload['name']
    return [userid, profilePic, name, payload];
  }
  catch(e){
    return "error"
  }
}

async function getUserTeams(req, res, next){
  let googleData = await verify(req.body.token);
  connection.query(
    'SELECT USERTEAMS.teamID, TEAMS.name, USERTEAMS.verified, USERTEAMS.isAdmin FROM USERTEAMS INNER JOIN TEAMS ON USERTEAMS.teamID = TEAMS.teamID WHERE userID = '+googleData[0]+' ORDER BY USERTEAMS.verified DESC',
    function(err, results, fields) {
      if (err) {
        res.sendStatus(400);
      }
      else {
        res.json(results);
      }
    }
  );
}

// -------------- CHAT CODE ---------------

function charLimitCheck(data){
  if (data.length > 100){
    return false;
  }
  else{
    return true;
  }
}

let io = socket(httpsServer);

io.on('connection', function(socket){
  socket.on('joinroom', function(data){
    socket.join(data);
  })
  socket.on('message', function(data){
    let namespace = socket.handshake.address;
    messageLimiter.consume(namespace).then(() => {
      if (charLimitCheck(data)){
          socket.broadcast.to(data.room).emit('message', data.data);
      }
      else {
      }
    })
    .catch(() => {
    });
  })
  socket.on('image', function(data){
    let namespace = socket.handshake.address;
    messageLimiter.consume(namespace).then(() => {
      if (charLimitCheck(data)){
          socket.broadcast.to(data.room).emit('image', data.data);
      }
      else {
      }
    })
    .catch(() => {
    });
  })
})
