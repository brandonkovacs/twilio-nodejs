'use strict';
var express = require('express');           // Express
var fs = require('fs');                     // Filestream
var https = require('https');               // SSL Support
var MessagingResponse = require('twilio').twiml.MessagingResponse;
var VoiceResponse = require('twilio').twiml.VoiceResponse;
var bodyParser = require('body-parser');

// Load settings from environment variables
const PORT = process.env.PORT || 8080;
const SSL_KEY= process.env.SSL_KEY || '';
const SSL_CERT= process.env.SSL_CERT || '';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_NUMBER = process.env.TWILIO_NUMBER || '';
const USER_FORWARDING_NUMBER = process.env.USER_FORWARDING_NUMBER || '';

// SSL Certificates
var sslOptions = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT)
};

// Initialize twilio client
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize express w/ body parser middleware
var app = express();
app.use(express.urlencoded());

/*
 * Method to handle a GET Request on the default index route.
 *
 */
app.get('/', function (req, res) {
    res.send('Nothing to see here.');
});

/*
 * Method to handle an incoming phone call from Twilio
 *
 * Currently forwards the incoming call to the users forwarding number.
 *
 */
app.post('/voice', (req, res) => {

    // Log the incoming post data
    console.log('Incoming phone call from ' + req.body.From);
    console.log(req.body);

    // TwiML response object
    var twiml = new VoiceResponse();

    // Forward and dial the users forwarding number
    var dial = twiml.dial({
        callerId: TWILIO_NUMBER,
        answerOnBridge: 'true',
    });
    dial.number(FORWARDING_NUMBER);

    // Send the TwiML Response back to Twilio
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

});

/*
 * Method to handle an incoming SMS Message from Twilio
 *
 * Currently relays the incoming message and sends it to the users forwarding number.
 *
 */
app.post('/sms', (req, res) => {

    // Log the incoming post data
    console.log(req.body);

    // Generate a blank TwiML Response back to the user
    var twiml = new MessagingResponse();
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

    // Relay the incoming SMS message to the users forwarding number
    var message = req.body.From + ' : ' + req.body.Body;
    client.messages
        .create({
            body: message,
            from: TWILIO_NUMBER,
            to: FORWARDING_NUMBER
        })
        .then(message => console.log('Forwarded Message. SID: ' + message.sid))
        .done();

});


// Begin Application and listen on an SSL enabled port.
var server = https.createServer(sslOptions, app).listen(PORT, function(){
    console.log("Application listening on port " + PORT + " [SSL ENABLED].");
});