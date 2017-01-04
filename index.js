// Alexa Lambda Kegbot Integration
// Written by patfreeman
// https://github.com/patfreeman/alexa-lambda-kegbot

'use strict';

const Alexa = require('alexa-sdk');
const config = require('config');
const request = require('request');

// If https is used, allow default and self signed SSL certificates
var req = { method: 'GET', timeout: config.timeout };
if ( config.KB_protocol === 'https' ) {
    var https = require('https');
    var agentOptions;
    agentOptions = {
        host: config.KB_host,
        path: '/',
        rejectUnauthorized: false
    };
    if ( config.KB_port ) {
        agentOptions.port = config.KB_port;
    }
    req.agent = new https.Agent(agentOptions);
}

// If apikey is provided
if ( config.KB_apikey ) {
    req.headers = { 'X-Kegbot-Api-Key': config.KB_apikey };
}

const handlers = {
    'OnTap': function () {
        var that = this;
        req.url = config.KB_server + '/api/taps/';
        request(req, function (err, response, body) {
            if ( err ) {
                console.log( err );
                that.emit(':tell', config.applicationName + ' was unable to connect to the Keg Bot API');
                return;
            }
            var obj = JSON.parse(body);
            var keg = obj.objects[0].current_keg;
            if ( keg ) {
                that.emit(':tell', config.applicationName + ' has ' + keg.type.name + ' on tap');
            } else {
                that.emit(':tell', config.applicationName + ' has no beer on tap');
            }
        });
    },
    'Volume': function () {
        var that = this; 
        req.url = config.KB_server + '/api/taps/';
        request( req, function (err, response, body) {
            if ( err ) {
                console.log( err );
                that.emit(':tell', config.applicationName + ' was unable to connect to the Keg Bot API');
                return;
            }
            var obj = JSON.parse(body);
            var keg = obj.objects[0].current_keg;
            if ( keg ) {
                that.emit(':tell', config.applicationName + ' has ' + keg.percent_full.toPrecision(2) + ' percent of the ' + keg.type.name + ' keg left');
            } else {
                that.emit(':tell', config.applicationName + ' has no beer on tap');
            }
        });
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Kegbot',
            HELP_MESSAGE: 'You can ask questions such as, what\'s on tap, or, how much is left...Now, what can I help you with?',
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = config.applicationId;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

