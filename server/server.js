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

/*-- SSL ENCRYPTION KEYS (MUST BE STORED IN 'sslcert' FOLDER) --*/
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

/*-- SERVER STARTERS (PORT 80 FOR DEBUG, PORT 443 FOR SECURE PRODUCTION CONNECTION) --*/
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

/*-- MYSQL CONNECTION (SERVER HOSTED AT makerapi.host) --*/
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

/*-- CROSS ORIGIN DOMAIN HEADERS (TO ALLOW teammaker.app TO COMMUNICATE WITH makerapi.host) --*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// --------------- ROUTES -----------------
app.post('/userteams', getUserTeams);
app.post('/tasks', getTasks);

// ----------------------------------------

// -------------- MAKER API --------------

/*-- GOOGLE AUTH --
	DESCRIPTION: converts the google token to a user id that we can store in the database.
							Also gives us their user profile data such as profile pictures and names.
	PARAMS: idToken
	RETURNS: Array of user data including userid, profilePic and name
*/
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

/*-- GET USER TEAMS --
	DESCRIPTION: gets a list of teams that a user is associated with (even if not a memeber yet).
							User token is converted through the google auth function to get a user id first.
	PARAMS: req(the request data from the client, contains token)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of teams that the user is associated with
*/
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

/*-- GET TASKS --
	DESCRIPTION: Gets all of the tasks that a team have.
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of tasks that are linked to the teamID provided
*/
async function getTasks(req, res, next){
  //let googleData = await verify(req.body.token);
  connection.query(
    'SELECT taskID, name FROM TASKS WHERE teamID = "'+req.body.teamID+'"',
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

/*-- charLimitCheck --
	DESCRIPTION: checks the the length of data for a text message is under the system limit
	PARAMS: data
	RETURNS: BOOLEAN value (whether or not the text has passed validation)
*/
function charLimitCheck(data){
  if (data.length > 100){
    return false;
  }
  else{
    return true;
  }
}

/*-- SOCKET.IO CONNECTIONS AND CHAT FUNCTIONS (all of below) --
	DESCRIPTION: All of the functions below handle requests through the socket io connections.
							These are designed to take the input from the users chat client and direct them
							to the correct clients that the other team members are using.
							User ids may be taken for some tasks, this is to validate the user and ensure
							that the message being sent to a group is coming fom a genuine approved user.
 --*/

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
