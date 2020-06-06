# Alexa-Lambda-Kegbot
Alexa-Lambda-Kegbot is an Alexa Skill for communication with your Kegbot. Currently is supports the following:
* What's on tap?
* How much is left?

For a more home friendly setup, maybe the alexa-app version is better: [alexa-app-kegbot](https://github.com/patfreeman/alexa-app-kegbot)

### Requirements
* node - NodeJS http://nodejs.org
* request - NodeJS package https://www.npmjs.com/package/request
* config - NodeJS package https://www.npmjs.com/package/config
* alexa-sdk - NodeJS package https://www.npmjs.com/package/alexa-sdk
* AWS account with a connection to your Kegbot server to run the lambda
* AWS Developer account from https://developer.amazon.com to create skill

### Setup - Updated 9/20/2018
1. Setup a new *custom* Alexa Skill on https://developer.amazon.com/alexa/console/ask
	1. Login
  	1. In the ALEXA Skills tab, click Create Skill
    	1. Enter a Skill Name
	1. Select a language
	1. Choose Custom model
	1. Click "Create Skill"
  	1. Select the "Start from scratch" template
  	1. Click "Choose"   
  	1. In the main developer window, click the "Your Skills" button to return to the list of your skills
  	1. Click on "View Skill ID" under your Skill Name
  	1. **Save the Alexa Skill ID** We'll come back to this later
1. Setup Github Code
	1. Clone Repo: `git clone https://github.com/patfreeman/alexa-lambda-kegbot.git`
	1. `cd alexa-lambda-kegbot`
	1. `npm install`
	1. `cp config/default_example.js config.js`
	1. `vi config.js`
  		1. Set your Kegbot configuration. Protocol, host, port, API key (if required)
		1. 'cp config.js config/default.js'
  		1. **Make sure to set the ALEXA SKILL ID in the default.js file - this is required**
	1. `zip -r ../alk.zip .` NOTE: Make sure you are in the directory with the index.js file.
1. Create Lambda
  	1. In the AWS Lambda console https://console.aws.amazon.com/lambda/home?region=us-east-1#/
  	1. Create a Lambda Function
		1. Choose "Author from scratch
		1. Name - Give it a name
		1. Runtime - Choose NodeJS 4.3
		1. Role - Choose a role or create a new one from templates(s)
		1. Role name - Enter if required
		1. Policy templates - leave blank
		1. Click "Create Function"
 	1. Configure the Lambda Function
		1. Under Function code, change Code entry type to Upload a .ZIP file
		1. Click "Upload" and select the ZIP you created above
		1. Leave Node.js 4.3 selected
		1. Handler needs to stay as index.handler
		1. Environment variables - leave blank
		1. Tags - leave blank
		1. Execution role - should already be populated with the role selected above
		1. Basic Settings
	  	1. Description - if you care
      		1. Memory - 128MB is more than enough
      		1. Timeout - Set this to greater than the value you defined in default.js
		1. Network - Leave as "No VPC"
		1. Debugging and Error Handling - Leave as "None"
		1. Concurrency - Use unreserved account concurrency
		1. Auditing and Compliance - No changes
		1. Click "Save" in the top-right corner of the screen.
  	1. Add Alexa Skill Trigger
		1. Expand the Lambda Designer window
    		1. Under Add triggers, select Alexa Skills Kit
	  	1. Paste in the Alexa Skill ID you saved from above
      		1. Click Add
    		1. Clikc "Save" in the top-right corner of the screen.   	
	1. Test your Lambda Function
		1. Select "Select a test event..." in the drop-down in the top-right corner
  		1. Select "Configure test events"
  		1. Give the test a name
  		1. Paste in the code in the `alexa_test_script.json` file
  		1. Update the Alexa skill ID XXXXXX values with your Alexa skill ID
  		1. You can leave the [unique value here] lines as-is
  		1. Click Create
  		1. Click "Test"
  		1. You should see success and the JSON response should show what is on tap on your kegbot
	1. **Note ARN in upper right corner**
1. Finalize Setup
	1. Go back to Alexa Skill setup on https://developer.amazon.com/
  	1. Select the Alexa Skill you created earlier
  	1. Under Endpoint
		1. Choose AWS Lambda ARN
		1. Paste the ARN for your Lambda created above under Default Region
		1. Click "Save Endpoint"
  	1. Under Interation Model
		1. Invocation - set the words you would like to launch your skill (can be different from skill name)
		1. Intents - there are multiple ways to do this, but I've found this to be the easiest
	  		1. Click Add Intent
	  		1. Enter the name `OnTap`
	  		1. Click "Create Custom Intent"
	  		1. Under Sample Utterances, enter the lines found in sample_utterances.txt next to OnTap. NOTE: Do not include the word "OnTap".
	  		1. Repeat this same process creating a new Intent called `Volume`
	1. Click "Save Model"
	1. Click "Build Model"
  	1. Test
    		1. Click on the Test Tab
		1. Click the switch to enable Testing
		1. Type in phrases (or speak them) into the test interface.
	  		1. "ask my kegbot what is on tap"
	  		1. "ask my kegbot how much beer is left"
	  		1. Replace "my kegbot" with your Invocation phrase you configured earlier
		1. Try talking to Alexa
