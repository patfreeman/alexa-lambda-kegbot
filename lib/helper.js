// Alexa Lambda Kegbot Integration
// Copyright 2016-2020 Pat Freeman <github@e2r4.com>
// https://github.com/patfreeman/alexa-lambda-kegbot

var config = require("../config/default");

function volume(ml) {
  if (config.units == "imperial") {
    return (ml / 473.176).toPrecision(2) + " pints";
  } else if (ml >= 1000) {
    return (ml / 1000).toPrecision(2) + " litres";
  } else {
    return ml + " millilitres";
  }
}

module.exports.volume = volume;
