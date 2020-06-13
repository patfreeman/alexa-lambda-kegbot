// Alexa Lambda Kegbot Integration
// Copyright 2016-2020 Pat Freeman <github@e2r4.com>
// https://github.com/patfreeman/alexa-lambda-kegbot

"use strict";

const Alexa = require("ask-sdk-core");
const config = require("./config/default");
const kegbot = require("./lib/kegbot");
const helper = require("./lib/helper");
const i18n = require("i18next");
const sprintf = require("i18next-sprintf-postprocessor");

// Pull in time package
var javascript_time_ago = require("javascript-time-ago");
javascript_time_ago.locale(require("javascript-time-ago/locales/en"));
const time_ago_english = new javascript_time_ago("en-US");

const languageStrings = {
  "en-US": {
    translation: {
      SKILL_NAME: "Kegbot",
      HELP_MESSAGE:
        "You can ask questions such as, what's on tap, or, how much is left...Now, what can I help you with?",
    },
  },
};

const OnTapHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return (
      request.type === "IntentRequest" && request.intent.name === "OnTapIntent"
    );
  },
  async handle(handlerInput) {
    var TapNumber = undefined;
    if (handlerInput.requestEnvelope.request.intent.slots) {
      if (handlerInput.requestEnvelope.request.intent.slots.TapNumber) {
        TapNumber =
          handlerInput.requestEnvelope.request.intent.slots.TapNumber.value;
      }
    }
    const kegs = await kegbot.getCurrentKegs();
    console.log(kegs);
    var speechOutput = config.applicationName;
    if (TapNumber && (TapNumber > kegs.length || TapNumber < 1)) {
      speechOutput += " only has " + kegs.length + " tap";
      if (kegs.length > 1) {
        speechOutput += "s";
      }
    } else if (TapNumber && TapNumber <= kegs.length) {
      var keg = kegs[TapNumber - 1];
      if (keg == undefined) {
        speechOutput += " has nothing on tap number " + TapNumber;
      } else {
        speechOutput += " has " + keg.type.name + " on tap number " + TapNumber;
      }
    } else if (kegs) {
      kegs.forEach(function (keg, index) {
        if (keg == undefined) {
          speechOutput += " has nothing on tap number " + (index + 1);
          return;
        }
        if (kegs.length > 1 && index === kegs.length - 1) {
          speechOutput += " and ";
        }
        speechOutput += " has " + keg.type.name + " on tap";
        if (kegs.length > 1) {
          speechOutput += " number " + (index + 1);
        }
      });
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(speechOutput)
      .getResponse();
  },
};

const RecentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return (
      request.type === "IntentRequest" && request.intent.name === "RecentIntent"
    );
  },
  async handle(handlerInput) {
    try {
      await callDirectiveService(handlerInput, "Wow! That's a lot of drinks.");
    } catch (err) {
      console.log("Directive failed: " + err);
    }
    const drinks = await kegbot.getCurrentDrinks();
    console.log(drinks);
    var speechOutput = config.applicationName;
    if (drinks) {
      var keg = {};
      drinks.forEach(function (drink, index) {
        if (drink == undefined) {
          return;
        }
        if (!keg[drink.keg.id]) {
          keg[drink.keg.id] = {};
          keg[drink.keg.id].user_ids = [];
          keg[drink.keg.id].volume = 0;
        }
        keg[drink.keg.id].name = drink.keg.beverage.name;
        keg[drink.keg.id].user_ids[drink.user_id] += 1;
        keg[drink.keg.id].volume += drink.volume_ml;
        keg[drink.keg.id].start = drink.session.start_time;
      });

      for (var key in keg) {
        speechOutput += " poured " + helper.volume(keg[key].volume);
        speechOutput += " of " + keg[key].name + " for user";
        var plural = 0;
        if (Object.keys(keg[key].user_ids).length > 1) {
          speechOutput += "s";
          plural = Object.keys(keg[key].user_ids).length - 1;
        }
        Object.keys(keg[key].user_ids).forEach(function (user, index) {
          if (plural >= 1 && plural == index) {
            speechOutput += " and";
          }
          speechOutput += " " + user;
        });
        // Convert the date format to epoch then realtive
        var parts = keg[key].start.match(
          /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
        );
        var date = Date.UTC(
          +parts[1],
          parts[2] - 1,
          +parts[3],
          +parts[4],
          +parts[5]
        );
        speechOutput += " " + time_ago_english.format(date) + ". ";
      }
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(speechOutput)
      .getResponse();
  },
};

const VolumeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return (
      request.type === "IntentRequest" && request.intent.name === "VolumeIntent"
    );
  },
  async handle(handlerInput) {
    var TapNumber = undefined;
    var VolumeUnits = undefined;
    if (handlerInput.requestEnvelope.request.intent.slots) {
      if (handlerInput.requestEnvelope.request.intent.slots.TapNumber) {
        TapNumber =
          handlerInput.requestEnvelope.request.intent.slots.TapNumber.value;
      }
      if (handlerInput.requestEnvelope.request.intent.slots.VolumeUnits) {
        VolumeUnits =
          handlerInput.requestEnvelope.request.intent.slots.VolumeUnits.value;
      }
    }
    const kegs = await kegbot.getCurrentKegs();
    console.log(kegs);
    if (VolumeUnits == undefined && config.units == "imperial") {
      VolumeUnits = "pints";
    }
    var speechOutput = config.applicationName;
    if (TapNumber && (TapNumber > kegs.length || TapNumber < 1)) {
      speechOutput += " only has " + kegs.length + " taps";
    } else if (TapNumber && TapNumber <= kegs.length) {
      var keg = kegs[TapNumber - 1];
      if (keg == undefined) {
        speechOutput += " has nothing on tap number " + TapNumber;
      } else {
        if (VolumeUnits === "pints") {
          speechOutput +=
            " has " +
            (keg.volume_ml_remain / 473.176).toPrecision(2) +
            " pints";
        } else if (VolumeUnits === "percent" || VolumeUnits === "percentage") {
          speechOutput +=
            " has " + keg.percent_full.toPrecision(2) + " percent";
        } else {
          speechOutput +=
            " has " + (keg.volume_ml_remain / 1000).toPrecision(2) + " liters";
        }
        speechOutput += " of " + keg.type.name + " on tap number " + TapNumber;
      }
    } else if (kegs) {
      kegs.forEach(function (keg, index) {
        if (keg == undefined) {
          speechOutput += " has nothing remaining on tap number " + (index + 1);
          return;
        }
        if (kegs.length > 1 && index === kegs.length - 1) {
          speechOutput += " and ";
        }
        if (VolumeUnits === "pints") {
          speechOutput +=
            " has " +
            (keg.volume_ml_remain / 473.176).toPrecision(2) +
            " pints";
        } else if (VolumeUnits === "percent" || VolumeUnits === "percentage") {
          speechOutput +=
            " has " + keg.percent_full.toPrecision(2) + " percent";
        } else {
          speechOutput +=
            " has " + (keg.volume_ml_remain / 1000).toPrecision(2) + " liters";
        }
        speechOutput += " of " + keg.type.name + " on tap";
        if (kegs.length > 1) {
          speechOutput += " number " + (index + 1);
        } else {
          speechOutput += ".";
        }
      });
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(speechOutput)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("ERROR_MESSAGE"))
      .reprompt(requestAttributes.t("ERROR_MESSAGE"))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: "sprintf",
        sprintf: values,
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

function callDirectiveService(handlerInput, message) {
  const requestEnvelope = handlerInput.requestEnvelope;
  const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient();

  const requestId = requestEnvelope.request.requestId;
  const endpoint = requestEnvelope.context.System.apiEndpoint;
  const token = requestEnvelope.context.System.apiAccessToken;

  const directive = {
    header: {
      requestId,
    },
    directive: {
      type: "VoicePlayer.Speak",
      speech: message,
    },
  };

  return directiveServiceClient.enqueue(directive, endpoint, token);
}

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(OnTapHandler)
  .addRequestHandlers(RecentHandler)
  .addRequestHandlers(VolumeHandler)
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
