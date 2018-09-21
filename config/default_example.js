var config = {};

// Name of the application/skill, which does not need to match the skills 'Invocation Name',
// This is what the application calls itself in the voice prompts. The space helps the speech.
config.applicationName = 'Keg Bot';

/***************************** Skills CONFIGURATION ********************************************/
// AWS ASK applicationId, resembles 'amzn1.ask.skill.[your-unique-value-here]'
config.applicationId = 'amzn1.ask.skill.XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';

/***************************** Kegbot CONFIGURATION ********************************************/
// KB server protocol (http/https)
config.KB_protocol = 'https';

// KB server FQDN/IP
// AWS Lambda must be able to reach this IP/URL
config.KB_host = '192.168.0.1';

// KB server port. Can be commented out if using standard ports.
config.KB_port = '443';

// KB server api_key if required
// Required if your Kegbot Server Privacy Setting is not configured as Public
// comment out if not needed
config.KB_apikey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Timeout to wait for a response from Kegbot (in milliseconds)
config.timeout = 500;
/***************************** Kegbot CONFIGURATION END ****************************************/

// KB server URL construction
if ( config.KB_port ) {
    config.KB_server = config.KB_protocol + '://' + config.KB_host + ':' + config.KB_port;
} else {
    config.KB_server = config.KB_protocol + '://' + config.KB_host;
}

// Exports
module.exports = config;
