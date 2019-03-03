const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const http = require('http');
const https = require('https');
const FastRateLimit = require("fast-ratelimit").FastRateLimit;
var messageLimiter = new FastRateLimit({
  threshold : 10,
  ttl       : 60
});

const privateKey = fs.readFileSync('./sslcert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
const ca = fs.readFileSync('./sslcert/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

let app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

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
