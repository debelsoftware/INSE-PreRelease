const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const http = require('http');
const https = require('https');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('REDACTED');
const randomColor = require('randomcolor');
const shortid = require('shortid');
const FastRateLimit = require("fast-ratelimit").FastRateLimit;
const emailer = require('./modules/emailer');
const messageLimiter = new FastRateLimit({
  threshold : 10,
  ttl       : 60
});

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

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
  	host: '212.47.240.232',
  	user: 'nodeconnect',
  	database: 'MAKER',
  	password: 'REDACTED',
  	multipleStatements: true,
  	supportBigNumbers: true
  });

  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    else {
      console.log("----- SQL CONNECTION ESTABLISHED -----");
    }
  });

  connection.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('REBOOTING SQL CONNECTION...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

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
app.get('/status', getStatus);
app.post('/userteams', getUserTeams);
app.post('/tasks', getTasks);
app.post('/taskdetails', getTaskDetails);
app.post('/taskfiles', getTaskFiles);
app.post('/members', getMembers);
app.post('/taskmembers', getTaskMembers);
app.post('/registered', getRegistered);
app.post('/register', register);
app.post('/join', joinTeam);
app.post('/notifications', getNotif);
app.post('/respondrequest', respondRequest);
app.post('/createtask', createTask);
app.post('/deletetask', deleteTask);
app.post('/removemembers', removeMembers);
app.post('/deleteteam', deleteTeam);
app.post('/leaveteam', leaveTeam);
app.post('/deleteaccount', deleteAccount);
app.post('/createteam', createTeam);
app.post('/isadmin', isAdmin);
app.post('/messages', getMessages);

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
    let email = payload['email']
    return [userid, profilePic, name, payload, email];
  }
  catch(e){
    return "error"
  }
}

function getStatus(req, res, next){
  res.json('🔴 Running on: Vigorous Johnson');
}

/*-- getRegistered --
	DESCRIPTION: checks if a user is registered on the database
	PARAMS: idToken
	RETURNS: BOOLEAN value (true if user is registered)
*/
async function getRegistered(req, res, next){
	let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID FROM USERS WHERE userID = ?',
		[googleData[0]],
    function(err, results, fields) {
      if (err) {
        res.sendStatus(400);
      }
			else if (results.length == 0){
				res.json({
					isRegistered: false
				})
			}
      else {
        res.json({
					isRegistered: true
				})
      }
    }
  );
}

/*-- register --
	DESCRIPTION: registers the user into the database
	PARAMS: idToken
	RETURNS: HTTP status code (200 if success and 400 if fail)
*/
async function register(req, res, next){
	let googleData = await verify(req.body.token);
	if (googleData[0] != "e"){
		connection.query(
	    'INSERT INTO USERS VALUES(?,?,?)',
			[googleData[0],googleData[2],randomColor()],
	    function(err, results, fields) {
	      if (err) {
	        res.sendStatus(400);
	      }
	      else {
          emailer.sendEmailNotif(googleData[4],googleData[2]).catch(console.error);
	        res.sendStatus(200);
	      }
	    }
	  );
	}
	else {
		res.sendStatus(400);
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
    'SELECT USERTEAMS.teamID, TEAMS.name, USERTEAMS.verified, USERTEAMS.isAdmin FROM USERTEAMS INNER JOIN TEAMS ON USERTEAMS.teamID = TEAMS.teamID WHERE userID = ? ORDER BY USERTEAMS.verified DESC',
		[googleData[0]],
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
	DESCRIPTION: Checks user is authorised and then gets all of the tasks that a team have.
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of tasks that are linked to the teamID provided
*/
async function getTasks(req, res, next){
  let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			else if (results.length == 0){
				res.sendStatus(401);
			}
			else {
				connection.query(
				  'SELECT taskID, name, dateSet, dateDue FROM TASKS WHERE teamID = ?',
					[req.body.teamID],
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
    }
  );
}

/*-- GET TASK DETAILS --
	DESCRIPTION: Checks user is authorised and then gets all of the task details except files.
	PARAMS: req(the request data from the client, contains token, taskID and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of task details
*/
async function getTaskDetails(req, res, next){
  let googleData = await verify(req.body.token);
  connection.query(
    'SELECT teamID FROM TASKS WHERE taskID = ?',
		[req.body.taskID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
      else if (results.length == 0) {
        res.sendStatus(400);
      }
			else if (results[0].teamID != req.body.teamID){
				res.sendStatus(401);
			}
			else {
        connection.query(
          'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
      		[googleData[0],req.body.teamID],
          function(err, results, fields) {
      			if (err){
      				res.sendStatus(400);
      			}
      			else if (results.length == 0){
      				res.sendStatus(401);
      			}
      			else {
      				connection.query(
      				  'SELECT name, dateSet, dateDue, details FROM TASKS WHERE taskID = ?',
      					[req.body.taskID],
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
          }
        );
      }
    }
  );
}

/*-- GET TASK FILES --
	DESCRIPTION: Checks user is authorised and then gets all of the task files.
	PARAMS: req(the request data from the client, contains token, taskID and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of files that are linked to the teamID provided
*/
async function getTaskFiles(req, res, next){
  let googleData = await verify(req.body.token);
  connection.query(
    'SELECT teamID FROM TASKS WHERE taskID = ?',
		[req.body.taskID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
      else if (results.length == 0) {
        res.sendStatus(400);
      }
			else if (results[0].teamID != req.body.teamID){
				res.sendStatus(401);
			}
			else {
        connection.query(
          'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
      		[googleData[0],req.body.teamID],
          function(err, results, fields) {
      			if (err){
      				res.sendStatus(400);
      			}
      			else if (results.length == 0){
      				res.sendStatus(401);
      			}
      			else {
      				connection.query(
      				  'SELECT name, url FROM FILES WHERE taskID = ?',
      					[req.body.taskID],
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
          }
        );
      }
    }
  );
}

async function isAdmin(req, res, next){
  let googleData = await verify(req.body.token);
  connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1 AND isAdmin = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			else if (results.length == 0){
        res.json({
          isAdmin: false
        });
			}
			else {
        res.json({
          isAdmin: true
        });
			}
		}
	)
}

/*-- GET MEMBERS --
	DESCRIPTION: Checks user is authorised and then gets all of the members that a team have.
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of team members that are linked to the teamID provided
*/
async function getMembers(req, res, next){
  let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			else if (results.length == 0){
				res.sendStatus(401);
			}
			else {
				connection.query(
			    'SELECT USERS.userID, USERS.name, USERS.colour FROM USERTEAMS INNER JOIN USERS ON USERTEAMS.userID = USERS.userID WHERE USERTEAMS.teamID = ? AND verified = 1',
					[req.body.teamID],
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
		}
	)
}

/*-- GET TASK MEMBERS --
	DESCRIPTION: Checks user is authorised and then gets all of the members that a task has.
	PARAMS: req(the request data from the client, contains token, taskID and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of team members that are linked to the taskID provided
*/
async function getTaskMembers(req, res, next){
  let googleData = await verify(req.body.token);
  connection.query(
    'SELECT teamID FROM TASKS WHERE taskID = ?',
		[req.body.taskID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
      else if (results.length == 0) {
        res.sendStatus(400);
      }
			else if (results[0].teamID != req.body.teamID){
				res.sendStatus(401);
			}
			else {
        connection.query(
          'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
      		[googleData[0],req.body.teamID],
          function(err, results, fields) {
      			if (err){
      				res.sendStatus(400);
      			}
      			else if (results.length == 0){
      				res.sendStatus(401);
      			}
      			else {
      				connection.query(
      			    'SELECT USERS.userID, USERS.name, USERS.colour FROM USERTASKS INNER JOIN USERS ON USERTASKS.userID = USERS.userID WHERE USERTASKS.taskID = ?',
      					[req.body.taskID],
      			    function(err, results, fields) {
      			      if (err) {
      			        res.sendStatus(400);
      			      }
      			      else {
                    let containsSelf = false;
                    results.forEach(function(user){
                      if (user.userID == googleData[0]){
                        containsSelf = true;
                      }
                    });
      			        res.json({
                      users: results,
                      containsSelf: containsSelf
                    });
      			      }
      			    }
      			  );
      			}
      		}
      	);
      }
    }
  );
}

/*-- joinTeam --
	DESCRIPTION: adds a user to a team as unverified
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success and 400 if fail)
*/
async function joinTeam(req, res, next){
	let googleData = await verify(req.body.token);
	connection.query(
    'INSERT INTO USERTEAMS VALUES(?,?,?,?,?)',
		[googleData[0],req.body.teamID,0,0,0],
    function(err, results, fields) {
      if (err) {
        res.sendStatus(400);
      }
      else {
				connection.query(
			    'INSERT INTO NOTIFICATIONS (notificationName,details,teamID,dateCreated) VALUES("NEW USER REQUEST",?,?,?)',
					[JSON.stringify({
						userID: googleData[0],
						username: googleData[2]
					}),req.body.teamID,Date.now()],
			    function(err, results, fields) {
			      if (err) {
			        res.sendStatus(400);
			      }
			      else {
			        res.sendStatus(200);
			      }
			    }
			  );
      }
    }
  );
}

/*-- getNotif --
	DESCRIPTION: Checks user is authorised and then gets all of the notifications that a team have.
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: JSON string of notifications that are linked to the teamID provided
*/
async function getNotif(req, res, next){
  let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			else if (results.length == 0){
				res.sendStatus(401);
			}
			else {
				connection.query(
				  'SELECT * FROM NOTIFICATIONS WHERE teamID = ? ORDER BY dateCreated DESC',
					[req.body.teamID],
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
    }
  );
}

/*-- respondRequest --
	DESCRIPTION: Responds to joining request by either verifiying users or removing there requests
							In both situations the notification of their request is removed
	PARAMS: req(the request data from the client, contains token, teamID, userID, notifID and isAccepted)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success and 400 if fail)
*/
async function respondRequest(req, res, next){
	let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1 AND isAdmin = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			if (results.length == 0){
				res.sendStatus(401);
			}
			else {
				if (req.body.isAccepted == true) {
					connection.query(
					  'UPDATE USERTEAMS SET verified = 1 WHERE `teamID` = ? AND `userID` = ?; DELETE FROM NOTIFICATIONS WHERE notificationID = ?',
						[req.body.teamID, req.body.userID,req.body.notifID],
					   function(err, results, fields) {
					   	if (err) {
					    	res.sendStatus(400);
					    }
					    else {
				      	res.sendStatus(200);
					   	}
				  	}
					);
				}
				else {
					connection.query(
					  'DELETE FROM USERTEAMS WHERE teamID = ? AND userID = ?; DELETE FROM NOTIFICATIONS WHERE notificationID = ?',
						[req.body.teamID, req.body.userID,req.body.notifID],
					   function(err, results, fields) {
					   	if (err) {
					    	res.sendStatus(400);
					    }
					    else {
				      	res.sendStatus(200);
					   	}
				  	}
					);
				}
			}
    }
  );
}

/*-- deleteTask --
	DESCRIPTION: Checks user is authorised and then deletes the task based on the data given.
	PARAMS: req(the request data from the client)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success and 400 if fail)
*/
async function deleteTask(req, res, next){
  let googleData = await verify(req.body.token);
  connection.query(
    'SELECT USERTEAMS.userID FROM TASKS INNER JOIN USERTEAMS ON TASKS.teamID = USERTEAMS.teamID WHERE TASKS.taskID = ? AND USERTEAMS.userID = ? AND USERTEAMS.isAdmin = 1 AND USERTEAMS.verified = 1',
		[req.body.taskID,googleData[0]],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			else if (results.length == 0){
        connection.query(
          'SELECT * FROM USERTASKS WHERE taskID = ? AND userID = ?',
      		[req.body.taskID, googleData[0]],
          function(err, results, fields) {
      			if (err){
      				res.sendStatus(400);
      			}
      			if (results.length == 0){
      				res.sendStatus(401);
      			}
      			else {
      				connection.query(
      					'DELETE FROM TASKS WHERE taskID = ?',
      					[req.body.taskID],
      					 function(err, results, fields) {
      						 if (err) {
      							 res.sendStatus(400);
      						 }
      						 else {
      							 res.sendStatus(200)
      						 }
      					}
      				);
            }
          }
        );
			}
			else {
        connection.query(
          'DELETE FROM TASKS WHERE taskID = ?',
          [req.body.taskID],
           function(err, results, fields) {
             if (err) {
               res.sendStatus(400);
             }
             else {
               res.sendStatus(200)
             }
          }
        );
      }
    }
  );

}

/*-- createTask --
	DESCRIPTION: Checks user is authorised and then creates the task based on the data given.
	PARAMS: req(the request data from the client)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success and 400 if fail)
*/
async function createTask(req, res, next){
  let googleData = await verify(req.body.token);
  let taskID = shortid.generate();
	connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			if (results.length == 0){
				res.sendStatus(401);
			}
			else {
				if (validateTaskInputs(req.body.name,req.body.details,req.body.users,req.body.dateDue)) {
					connection.query(
					  'INSERT INTO TASKS (taskID,teamID,name,details,dateSet,dateDue) VALUES (?,?,?,?,?,?)',
						[taskID,req.body.teamID,req.body.name,req.body.details,new Date().getTime(), req.body.dateDue],
					   function(err, results, fields) {
					   	if (err) {
					    	res.sendStatus(400);
					    }
					    else {
								for (user of req.body.users){
									connection.query(
									  'INSERT INTO USERTASKS VALUES (?,?)',
										[user,taskID],
									   function(err, results, fields) {
									   	if (err) {
									    	res.sendStatus(400);
									    }
								  	}
									);
								}
								for (file of req.body.files){
									connection.query(
									  'INSERT INTO FILES (taskID,name,url) VALUES (?,?,?)',
										[taskID, file[0], file[1]],
									   function(err, results, fields) {
									   	if (err) {
									    	res.sendStatus(400);
									    }
								  	}
									);
								}
								res.sendStatus(200);
					   	}
				  	}
					);
				}
				else {
					res.sendStatus(400);
				}
			}
    }
  );
}

/*-- REMOVE MEMBERS --
	DESCRIPTION: Checks user is authorised and admin. Then removes members from the team.
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success,400 if fail and 403 if trying to remove self)
*/
async function removeMembers(req, res, next){
  let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND isAdmin = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			if (results.length == 0){
				res.sendStatus(401);
			}
			else {
				if (req.body.members.indexOf(googleData[0]) != -1) {
					res.sendStatus(403);
				}
				else {
					for (member of req.body.members){
						connection.query(
						  'DELETE FROM USERTEAMS WHERE teamID = ? AND userID = ?',
							[req.body.teamID,member],
						   function(err, results, fields) {
						   	if (err) {
						       res.sendStatus(400);
						     }
					  	}
						);
					}
					res.sendStatus(200);
				}
			}
    }
  );
}

/*-- DELETE TEAM --
	DESCRIPTION: Checks user is authorised and admin. Then removes team from the database.
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success, and 400 if fail)
*/
async function deleteTeam(req, res, next){
  let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND isAdmin = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			if (results.length == 0){
				res.sendStatus(401);
			}
			else {
				connection.query(
					'DELETE FROM TEAMS WHERE teamID = ?',
					[req.body.teamID],
					 function(err, results, fields) {
						if (err) {
							res.sendStatus(400);
						}
						else {
							res.sendStatus(200);
						}
					}
				);
			}
    }
  );
}

/*-- LEAVE TEAM --
	DESCRIPTION: Checks user is authorised. Then removes them from the team.
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success, 403 if trying to remove self as admin and 400 if fail)
*/
async function leaveTeam(req, res, next){
  let googleData = await verify(req.body.token);
	connection.query(
    'SELECT userID, isAdmin FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			else if (results.length == 0){
				res.sendStatus(401);
			}
			else if (results[0].isAdmin == 1){
				res.sendStatus(403);
			}
			else {
				connection.query(
					'DELETE FROM USERTEAMS WHERE userID = ? AND teamID = ?',
					[googleData[0],req.body.teamID],
					 function(err, results, fields) {
						if (err) {
							res.sendStatus(400);
						}
						else {
							res.sendStatus(200);
						}
					}
				);
			}
    }
  );
}

/*-- DELETE ACCOUNT --
	DESCRIPTION: Checks user is authorised. Then removes them from the database and any teams they're admins of
	PARAMS: req(the request data from the client, contains token and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success and 400 if fail)
*/
async function deleteAccount(req, res, next){
  let googleData = await verify(req.body.token);
	connection.query(
    'SELECT teamID FROM USERTEAMS WHERE userID = ? AND isAdmin = 1',
		[googleData[0]],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			else {
				if (results.length > 0){
					for (team of results){
						connection.query(
							'DELETE FROM TEAMS WHERE teamID = ?',
							[team.teamID],
							 function(err, results, fields) {
								if (err) {
									res.sendStatus(400);
								}
							}
						);
					}
				}
				connection.query(
					'DELETE FROM USERS WHERE userID = ?',
					[googleData[0]],
					 function(err, results, fields) {
						if (err) {
							res.sendStatus(400);
						}
						else {
							res.sendStatus(200);
						}
					}
				);
			}
    }
  );
}

/*-- CREATE TEAM --
	DESCRIPTION: creates a team using the data provided by the client
	PARAMS: req(the request data from the client, contains token, name and teamID)
					res(handles response)
					next(applys CORS headers)
	RETURNS: HTTP status code (200 if success, 401 if unauthorised and 400 if fail)
*/
async function createTeam(req, res, next){
	let googleData = await verify(req.body.token);
  const teamID = shortid.generate();
	let validationResults = validateTeamInputs(req.body.name)
	if (validationResults == "pass") {
		connection.query(
	    'SELECT userID FROM USERS WHERE userID = ?',
			[googleData[0],teamID],
	    function(err, results, fields) {
				if (err){
					res.sendStatus(400);
				}
				else if (results.length == 0){
					res.sendStatus(401);
				}
				else {
					connection.query(
				    'INSERT INTO TEAMS VALUES(?,?)',
						[teamID,req.body.name],
				    function(err, results, fields) {
				      if (err) {
				        res.sendStatus(400);
				      }
				      else {
								connection.query(
							    'INSERT INTO USERTEAMS VALUES(?,?,?,?,?)',
									[googleData[0],teamID,1,1,0],
							    function(err, results, fields) {
							      if (err) {
							        res.sendStatus(400);
							      }
							      else {
											res.sendStatus(200)
										}
									}
								);
				      }
				    }
				  );
				}
	    }
	  );
	}
	else {
		res.sendStatus(400);
	}
}

async function getMessages(req, res, next){
  let googleData = await verify(req.body.token);
  connection.query(
    'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ? AND verified = 1',
		[googleData[0],req.body.teamID],
    function(err, results, fields) {
			if (err){
				res.sendStatus(400);
			}
			if (results.length == 0){
				res.sendStatus(401);
			}
			else {
        connection.query(
          'DELETE FROM MESSAGE WHERE teamID = ? AND messageID NOT IN (SELECT messageID FROM (SELECT messageID FROM MESSAGE WHERE teamID = ? ORDER BY messageTime DESC LIMIT 20) AS x)',
          [req.body.teamID, req.body.teamID],
          function(err, results, fields) {
            if (err){
              res.sendStatus(400);
            }
            else {
              connection.query(
                'SELECT USERS.name, USERS.colour, MESSAGE.messageText, MESSAGE.messageType, IF(USERS.userID = ?,"true","false") AS isSelf FROM MESSAGE INNER JOIN USERS ON MESSAGE.userID = USERS.userID WHERE MESSAGE.teamID = ? ORDER BY messageTime',
                [googleData[0],req.body.teamID],
                function(err, results, fields) {
                  if (err){
                    res.sendStatus(400);
                  }
                  else {
                    res.json(results);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
}

/*-- validateTaskInputs --
	DESCRIPTION: Validates the inputs given by the user to create a task with
	PARAMS: name,details,users,dateDue
	RETURNS: BOOLEAN (true if pass validation)
*/
function validateTaskInputs(name,details,users,dateDue){
	if (name.length > 0 && name.length <= 20){
    if (details.length <= 1000) {
      if (dateDue != "") {
        if (dateDue > new Date().getTime()) {
          if (users.length>0) {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  else{
    return false;
  }
}

/*-- validateTeamInputs --
	DESCRIPTION: Validates the inputs given by the user to create a team with
	PARAMS: teamID, name
	RETURNS: String (error message or pass)
*/
function validateTeamInputs(name){
  const regex = /^[a-zA-Z0-9\s]+$/g
  if (name.length == 0) {
    return "Please fill out both inputs";
  }
  else if (name.length>20) {
    return "name must be less than 20 characters";
  }
  else {
    return "pass";
  }
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
io.set('origins', '*:*');

async function getChatUser(token){
  let googleData = await verify(token);
  return googleData[2]
}

io.on('connection', function(socket){
  socket.on('joinroom', async function(data){
    let googleData = await verify(data.user);
  	connection.query(
      'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ?',
  		[googleData[0], data.room],
      function(err, results, fields) {
        if (err) {
          socket.emit('fail', {
            data: "Failed to auth for chat"
          });
        }
  			else if (results.length == 0){
          socket.emit('fail', {
            data: "Failed to auth for chat"
          });
  			}
        else {
          socket.join(data.room);
        }
      }
    );
  })
  socket.on('message', async function(data){
    let googleData = await verify(data.user);
  	connection.query(
      'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ?',
  		[googleData[0], data.room],
      function(err, results, fields) {
        if (err) {
          socket.emit('fail', {
            data: "Failed to auth for chat"
          });
        }
  			else if (results.length == 0){
          socket.emit('fail', {
            data: "Failed to auth for chat"
          });
  			}
        else {
          let namespace = socket.handshake.address;
          messageLimiter.consume(namespace).then(async() => {
            if (charLimitCheck(data.data)){
              connection.query(
                'DELETE FROM MESSAGE WHERE teamID = ? AND messageID NOT IN (SELECT messageID FROM (SELECT messageID FROM MESSAGE WHERE teamID = ? ORDER BY messageTime DESC LIMIT 20) AS x)',
                [data.room, data.room],
                function(err, results, fields) {
                  if (err){
                    res.sendStatus(400);
                  }
                  else {
                    connection.query(
          				    'INSERT INTO MESSAGE VALUES(?,?,?,?,?,?)',
          						[shortid.generate(),"txt",new Date().getTime(),data.data,googleData[0],data.room],
          				    function(err, results, fields) {
          				      if (err) {
                          socket.emit('fail', {
                            data: "Failed to store message"
                          });
          				      }
          				      else {
                          socket.broadcast.to(data.room).emit('message', {
                            data: data.data,
                            user: googleData[2]
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
            else {
            }
          })
          .catch(() => {
          });
        }
      }
    );
  })
  socket.on('image', async function(data){
    let googleData = await verify(data.user);
  	connection.query(
      'SELECT userID FROM USERTEAMS WHERE userID = ? AND teamID = ?',
  		[googleData[0], data.room],
      function(err, results, fields) {
        if (err) {
          socket.emit('fail', {
            data: "Failed to auth for chat"
          });
        }
  			else if (results.length == 0){
          socket.emit('fail', {
            data: "Failed to auth for chat"
          });
  			}
        else {
          let namespace = socket.handshake.address;
          messageLimiter.consume(namespace).then(async() => {
            if (charLimitCheck(data.data)){
              connection.query(
                'DELETE FROM MESSAGE WHERE teamID = ? AND messageID NOT IN (SELECT messageID FROM (SELECT messageID FROM MESSAGE WHERE teamID = ? ORDER BY messageTime DESC LIMIT 20) AS x)',
                [data.room, data.room],
                function(err, results, fields) {
                  if (err){
                    res.sendStatus(400);
                  }
                  else {
                    connection.query(
          				    'INSERT INTO MESSAGE VALUES(?,?,?,?,?,?)',
          						[shortid.generate(),"img",new Date().getTime(),data.data,googleData[0],data.room],
          				    function(err, results, fields) {
          				      if (err) {
                          socket.emit('fail', {
                            data: "Failed to store message"
                          });
          				      }
          				      else {
                          socket.broadcast.to(data.room).emit('image', {
                            data: data.data,
                            user: googleData[2]
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
            else {
            }
          })
          .catch(() => {
          });
        }
      }
    );
  })
})
