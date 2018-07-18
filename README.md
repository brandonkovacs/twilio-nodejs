# twilio-nodejs
Forward calls and SMS messages from your Twilio number to a real number w/ NodeJS + Express

#### Requirements
1. SSL Certificate ([LetsEncrypt](http://letsencrypt.com/))
2. Valid Twilio API Credentials

#### Installation
1. ``git clone https://github.com/brandonkovacs/manychat-dynamic``
2. ``npm install``

#### Usage
1. Set Environment Variables (See Below)
2. Configure Twilio Endpoints (See Below)
3. ``node index.js``

#### Environment Variables
* ``export PORT=8080``
* ``export SSL_KEY=/path/to/privkey.pem``
* ``export SSL_CERT=/path/to/certificate.pem``
* ``export TWILIO_ACCOUNT_SID=twilio_account_sid``
* ``export TWILIO_AUTH_TOKEN=twilio_auth_token``
* ``export TWILIO_NUMBER=+10000000000``
* ``export USER_FORWARDING_NUMBER=+10000000000``

## Twilio Setup

Set Twilio Voice + SMS Webhooks for this number to our SSL Endpoints.

#### Voice & Fax
When A Call Comes In:
  * Handler: `Webhook`
  * URL: `https://example.com:8080/voice`
  * Request Type: `HTTP POST`

#### Voice & Fax
When A Message Comes In:
  * Handler: `Webhook`
  * URL: `https://example.com:8080/sms`
  * Request Type: `HTTP POST`