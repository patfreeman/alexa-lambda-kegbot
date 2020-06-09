// Alexa Lambda Kegbot Integration
// Copyright 2016-2020 Pat Freeman <github@e2r4.com>
// https://github.com/patfreeman/alexa-lambda-kegbot

const config = require("../config/default");
const https = require("https");

// If https is used, allow default and self signed SSL certificates
var req = { method: "GET", timeout: config.timeout };
if (config.KB_protocol === "https") {
  var agentOptions;
  agentOptions = {
    host: config.KB_host,
    path: "/",
    rejectUnauthorized: false,
  };
  if (config.KB_port) {
    agentOptions.port = config.KB_port;
  }
  req.agent = new https.Agent(agentOptions);
}

// If apikey is provided
if (config.KB_apikey) {
  req.headers = { "X-Kegbot-Api-Key": config.KB_apikey };
}

const getCurrentKegs = (kegs) => {
  var url = config.KB_server + "/api/taps/";
  return new Promise((resolve, reject) => {
    https
      .get(url, req, (res) => {
        let data = "";
        res.on("data", (d) => {
          data += d;
        });
        res.on("end", function (res) {
          var obj = JSON.parse(data);
          var kegs = [];
          obj.objects.forEach(function (tap) {
            kegs.push(tap.current_keg);
          });
          resolve(kegs);
        });
      })
      .on("error", (e) => {
        console.error(e);
        resolve("Error");
      });
  });
};

function getCurrentDrinks() {
  var url = config.KB_server + "/api/drinks/";
  return new Promise((resolve, reject) => {
    https
      .get(url, req, (res) => {
        let data = "";
        res.on("data", (d) => {
          data += d;
        });
        res.on("end", function (res) {
          var obj = JSON.parse(data);
          var drinks = [];
          var target_session = obj.objects[0].session_id;
          obj.objects.forEach(function (drink) {
            if (drink.session_id == target_session) {
              drinks.push(drink);
            }
          });
          resolve(drinks);
        });
      })
      .on("error", (e) => {
        console.error(e);
        resolve("Error");
      });
  });
}

module.exports.getCurrentKegs = getCurrentKegs;
module.exports.getCurrentDrinks = getCurrentDrinks;
