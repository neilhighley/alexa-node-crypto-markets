/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * Retrieves the current stock cap for the top 3 crypto currencies
 **/

'use strict';

const Alexa = require('alexa-sdk');
const Request = require('request');
const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Crypto Markets',
            GET_CURRENCIES_MESSAGE: "Here are the current rates: ",
            HELP_MESSAGE: 'Ask me How are the crypto markets',
            HELP_REPROMPT: 'Use the simple phrase',
            STOP_MESSAGE: 'Thankyou!',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('markets');
    },
    'markets': function () {
        var inThis=this;
        console.log("ENTERING MAIN FUNCTION");
        function EmitCurrencyInfo(jsonData){
            // Create speech output
            var currencyData=[];
            console.log("JsonData Length="+jsonData.length);
            for(var i=0;i<jsonData.length;i++){
                var thisData=jsonData[i];
                console.log("Processing "+thisData.name);
                currencyData.push(
                    {
                        Name:thisData.name,
                        Price:Number(thisData.price_usd).toFixed(2),
                        Rising:thisData.percent_change_24h>0
                });  
            }
            var total_message=inThis.t('GET_CURRENCIES_MESSAGE')+".";
            console.log("Got translation text");
            for(var i=0;i<currencyData.length;i++){
                var currency=currencyData[i];
                total_message+=currency.Name + " is ";
                total_message+=currency.Rising ? "up at ":"down at ";
                total_message+=currency.Price+" US dollars. ";
            }
            console.log("created output message:");
            console.log(total_message);
            inThis.emit(':tell',total_message);
            console.log("sent message");
        }
        Request({
            url: 'https://api.coinmarketcap.com/v1/ticker/?limit=3',
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("request succesful");
                EmitCurrencyInfo(body)
            }else{
                this.emit(':tell', "Sorry, I could not get the current values, try again later");
            }
        });
                
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};