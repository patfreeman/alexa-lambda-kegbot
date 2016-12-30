# Alexa-Lambda-KegBot
Alexa-Lambda-KegBot is an Alexa Skill for communication with your KegBot. Currently is supports the following:
* What's on tap?
* How much is left?

### Requirements
* node - NodeJS http://nodejs.org
* request - NodeJS package https://www.npmjs.com/package/request
* alexa-sdk - NodeJS package https://www.npmjs.com/package/alexa-sdk
* AWS account with a connection to your KegBot server to run the lambda
* AWS Developer account from https://developer.amazon.com to create skill

### Setup
1. Setup a new *custom* Alexa Skill on https://developer.amazon.com/
  1. Login
  1. In the ALEXA tab, choose Alexa Skills Kit
  1. Add a New Skill
    1. Skill Information
    1. Skill Type as Custom Interaction Model
    1. Name - Give it a name
    1. Invocation Name - Give it an Invocation Name. For "Alexa, Ask KegBot..." use KegBot.
    1. Next
  1. Note ID at the top of the page
  1. We'll come back to this later
1. Clone Repo: `git clone https://github.org/patfreeman/alexa-lambda-kegbot.git`
1. `cd alexa-lambda-kegbot`
1. `npm install`
1. `cp config_example.js config.js`
1. `vi config.js`
  1. Set your KegBot configuration. Protocol, host, port, API key (if required)
1. `zip -r ../alk.zip ./`
1. Create Lambda
  1. In the AWS Lambda console https://console.aws.amazon.com/lambda/home?region=us-east-1#/
  1. Create a Lambda Function
    1. Choose a blank function
    1. Click the box and choose Alexa Skills Kit, then Next
    1. Name - Give it a name
    1. Description - if you care
    1. Runtime - Choose NodeJS 4.3
    1. Upload a .ZIP file
    1. Function Package - Choose the ZIP you created above
    1. Handler needs to stay as index.handler
    1. Role - lambda_basic_vpc_execution should be enough.
    1. Memory - 128MB is more than enough
    1. Timeout - Set this to greater than the value you defined in config.js
    1. Choose your VPC, Subnet, and Security Groups that have access to your KegBot server
    1. Click Next, then Create Function
  1. Note ARN in upper right corner
1. Go back to Alexa Skill setup on https://developer.amazon.com/
  1. Interation Model
    1. Paste intent_schema.txt into Intent Schema
    1. Paste sample_utterances.txt into Sample Utterances
    1. Next
  1. Configuration
    1. Choose AWS Lambda ARN
    1. Paste the ARN for your Lambda created above
  1. Test
    1. Try it with a sample utterance
1. Try talking to Alexa
