/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const foodslifespan = require('./foodslifespan');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            FLS: foodslifespan.FLS,
            SKILL_NAME: 'Fresh Keep Food Life Span',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the life span for fish? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Life Span for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the Life Span, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, what\'s the life span, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            FLS_REPEAT_MESSAGE: 'Try saying repeat.',
            FLS_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            FLS_NOT_FOUND_WITH_FOOD_NAME: 'the life span for %s. ',
            FLS_NOT_FOUND_WITHOUT_FOOD_NAME: 'that life span. ',
            FLS_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'FoodLifeSpanIntent': function () {
        const foodSlot = this.event.request.intent.slots.Food;
        let foodName;
        if (foodSlot && foodSlot.value) {
            foodName = foodSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), foodName);
        const myFoodsLifeSpan = this.t('FLS');
        const foodLifeSpan = myFoodsLifeSpan[foodName];

        if (foodLifeSpan) {
            this.attributes.speechOutput = foodLifeSpan;
            this.attributes.repromptSpeech = this.t('FLS_REPEAT_MESSAGE');
            this.emit(':askWithCard', foodLifeSpan, this.attributes.repromptSpeech, cardTitle, foodLifeSpan);
        } else {
            let speechOutput = this.t('FLS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('FLS_NOT_FOUND_REPROMPT');
            if (foodName) {
                speechOutput += this.t('FLS_NOT_FOUND_WITH_FOOD_NAME', foodName);
            } else {
                speechOutput += this.t('FLS_NOT_FOUND_WITHOUT_FOOD_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
