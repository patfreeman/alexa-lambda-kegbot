# Alexa-Lambda-Kegbot
Alexa-Lambda-Kegbot is an Alexa Skill for communication with your Kegbot. Currently it supports questions the following:
* What's on tap?
* How much is left?
* Who has been drinking recently?
See [intent_schema.json](./intent_schema.json) for all the sample utterances.


For a more home friendly setup, maybe the alexa-app version is better: [alexa-app-kegbot](https://github.com/patfreeman/alexa-app-kegbot)

### Requirements
* node - NodeJS http://nodejs.org
* AWS account with a connection to your Kegbot server to run the lambda
* AWS Developer account from https://developer.amazon.com to create skill

### Setup
1. Setup a new *custom* Alexa Skill on https://developer.amazon.com/alexa/console/ask/create-new-skill
	1. Login
	1. Enter a Skill Name
	1. Select a language, although a lot of this is english...
	1. Choose *Custom* model
	1. Choose "Provision your own" method of hosting
	1. Click "Create Skill"
	1. Select the "Start from scratch" template
	1. Click "Choose"
	1. Go to the "JSON Editor" in the left nav
	1. Drag and drop a .json file, or click it and upload [intent_schema.json](./intent_schema.json)
	1. Click "Build Model"
	1. Click "Your Skills" to return to the skill listing
	1. Click on "View Skill ID" under your Skill Name
	1. **Save the Alexa Skill ID** We'll come back to this later
1. Grab the code:
	1. Clone Repo: `git clone https://github.com/patfreeman/alexa-lambda-kegbot.git`
	1. `cd alexa-lambda-kegbot`
	1. `npm install`
	1. `cp config/default_example.js config/default.js`
	1. `vi config/default.js`
		1. Set your Kegbot configuration. Protocol, host, port, API key (if required)
	1. `zip -r ../alk.zip .` NOTE: Make sure you are in the directory with the index.js file.
1. Create Lambda
	1. In the AWS Lambda console https://console.aws.amazon.com/lambda/home?region=us-east-1#/
	1. Create a Lambda Function in us-east-1
		1. Choose "Author from scratch"
		1. Name - Give it a name
		1. Runtime - Choose Node.js 12.x
		1. Role - Choose a role or create a new one from templates(s)
		1. Role name - Enter if required
		1. Policy templates - leave blank
		1. Click "Create Function"
	1. Configure the Lambda Function
		1. Under Function code, change Code entry type to Upload a .zip file
		1. Click "Upload" and select the ZIP you created above
		1. Defaults on everything else should be good enough.
		1. Handler needs to stay as index.handler
		1. Environment variables - leave blank because we don't need any
		1. Tags - leave blank, or don't. that's up to you
		1. Description - if you care
		1. Memory - 128MB is more than enough
		1. Timeout - Set this to 10s
		1. Network - Leave as "No VPC" or if you know you need it, then you probably don't need these step by step instructions.
		1. Concurrency - Use unreserved account concurrency
		1. etc ...
		1. Click "Save" in the top-right corner of the screen.
	1. Add Alexa Skill Trigger
		1. Expand the Lambda Designer window
		1. Under Add triggers, select Alexa Skills Kit
		1. Paste in the Alexa Skill ID you saved from above
		1. Click Add
	1. Test your Lambda Function
		1. Select "Select a test event..." in the drop-down in the top-right corner
		1. Select "Configure test events"
		1. Give the test a name
		1. Paste in the code in the [alexa_test_script.json](./alexa_test_script.json) file
		1. Click Create
		1. Click "Test"
		1. You should see success and the JSON response should show what is on tap on your kegbot
	1. **Note ARN in upper right corner**
1. Finalize Setup
	1. Go back to Alexa Skill setup on https://developer.amazon.com/alexa/console/ask
	1. Select the Alexa Skill you created earlier
	1. Under Endpoint
		1. Choose AWS Lambda ARN
		1. Paste the ARN for your Lambda created above under Default Region
		1. Click "Save Endpoint"
	1. Test
		1. Click on the Test Tab
		1. Click the switch to enable Testing
		1. Type in phrases (or speak them) into the test interface.
		1. "ask keg bot what is on tap"
		1. "ask keg bot how much beer is left"
		1. Replace "keg bot" with your Invocation phrase you configured earlier
		1. Try talking to Alexa
