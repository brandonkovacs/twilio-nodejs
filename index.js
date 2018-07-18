'use strict';
var express = require('express');           // Express
var fs = require('fs');                     // Filestream
var https = require('https');               // SSL Support

// Load settings from environment variables
const PORT = process.env.PORT || 8080;
const SSL_KEY= process.env.SSL_KEY || '';
const SSL_CERT= process.env.SSL_CERT || '';

// SSL Certificates
var sslOptions = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT)
};

// Initialize express
var app = express();

// Method to handle a GET Request on the default index route
app.get('/', function (req, res) {
    res.send('Nothing to see here.');
});

// Begin Application and listen on an SSL enabled port.
var server = https.createServer(sslOptions, app).listen(PORT, function(){
    console.log("Application listening on port " + PORT + " [SSL ENABLED].");
});