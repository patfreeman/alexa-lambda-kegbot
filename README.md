# Alexa-Lambda-KegBot
Alexa-Lambda-KegBot is an Alexa Skill for communication with your KegBot. Currently is supports the following:
* What's on tap?
* How much is left?

### Requirements
* node - NodeJS http://nodejs.org
* request - NodeJS package https://www.npmjs.com/package/request
* alexa-sdk - NodeJS package https://www.npmjs.com/package/alexa-sdk
* AWS account with a connection to your KegBot server
* AWS Developer account from https://developer.amazon.com to create skill

### Setup
1. Setup a new *custom* Alexa Skill on https://developer.amazon.com/
 a. Login
 b. In the ALEXA tab, choose Alexa Skills Kit
 c. Add a New Skill
   1. Skill Information
   2. Skill Type as Custom Interaction Model
   3. Name - Give it a name
   4. Invocation Name - Give it an Invocation Name. For "Alexa, Ask KegBot..." use KegBot.
   5. Next
  d. Note ID at the top of the page
  e. We'll come back to this later
2. Clone Repo: `git clone https://github.org/patfreeman/alexa-lambda-kegbot.git`
3. `cd alexa-lambda-kegbot`
4. `npm install`
5. `cp config_example.js config.js`
6. `vi config.js`
 a. Set your KegBot configuration. Protocol, host, port, API key (if required)
7. `zip -r ../alk.zip ./`
8. Create Lambda
 a. In the AWS Lambda console https://console.aws.amazon.com/lambda/home?region=us-east-1#/
 b. Create a Lambda Function
  1. Choose a blank function
  2. Click the box and choose Alexa Skills Kit, then Next
  3. Name - Give it a name
  4. Description - if you care
  5. Runtime - Choose NodeJS 4.3
  6. Upload a .ZIP file
  7. Function Package - Choose the ZIP you created above
  8. Handler needs to stay as index.handler
  9. Role - lambda_basic_vpc_execution should be enough.
  10. Memory - 128MB is more than enough
  11. Timeout - Set this to greater than the value you defined in config.js
  12. Choose your VPC, Subnet, and Security Groups that have access to your KegBot server
  13. Click Next, then Create Function
 c. Note ARN in upper right corner
9. Go back to Alexa Skill setup on https://developer.amazon.com/
 a. Interation Model
  1. Paste intent_schema.txt into Intent Schema
  2. Paste sample_utterances.txt into Sample Utterances
  3. Next
 b. Configuration
  1. Choose AWS Lambda ARN
  2. Paste the ARN for your Lambda created above
 c. Test
  1. Try it with a sample utterance
10. Try talking Alexa
