"use strict";

'use strict';

const Alexa = require('alexa-sdk');
const advice = require('./advice');


const APP_ID = 'amzn1.ask.skill.98820a47-4974-4302-9ab6-8c17338ba5a9'; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            ADVICE: advice.ADVICE_EN_US,
            ACTIONS: advice.ACTIONS_EN_US,
            SKILL_NAME: 'First Aid Advice',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, how do you treat a bee sting? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Treatment for %s.',
            HELP_MESSAGE: "You can ask questions such as, how do you treat a cut, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, how do you cure diarrhea, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            ADVICE_REPEAT_MESSAGE: 'Try saying repeat.',
            ADVICE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            ADVICE_NOT_FOUND_WITH_ITEM_NAME: 'how to treat %s. ',
            ADVICE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that ailment. ',
            ADVICE_NOT_FOUND_REPROMPT: 'What else can I help with?',
            
            ACTION_NOT_FOUND_WITH_ITEM_NAME: 'how to perform %s. ',
            ACTION_NOT_FOUND_WITHOUT_ITME_NAME: 'how to do that. '
        },
    },
    'en-US': {
        translation: {
            ADVICE: advice.ADVICE_EN_US,
            ACTIONS: advice.ACTIONS_EN_US,
            SKILL_NAME: 'First Aid Advice'
        },
    },
    'en-GB': {
        translation: {
            ADVICE: advice.ADVICE_EN_US,
            ACTIONS: advice.ACTIONS_EN_US,
            SKILL_NAME: 'First Aid Advice'
        },
    }
};

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'PerformIntent': function (){
    	const actionSlot = this.event.request.intent.slots.action;
    	let actionName;
    	if (actionSlot && actionSlot.value){
    		actionName = actionSlot.value.toLowerCase();
    	}
    	
    	const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), actionName);
    	const myAction = this.t('ACTIONS');
    	const advice = myAction[actionName];
    	
    	if (advice) {
            this.attributes.speechOutput = advice;
            this.attributes.repromptSpeech = this.t('ADVICE_REPEAT_MESSAGE');

            this.response.speak(advice).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, advice);
            this.emit(':responseReady');
        } else {
            let speechOutput = this.t('ADVICE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ADVICE_NOT_FOUND_REPROMPT');
            if (actionName) {
                speechOutput += this.t('ACTION_NOT_FOUND_WITH_ITEM_NAME', actionName);
            } else {
                speechOutput += this.t('ACTION_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.response.speak(speechOutput).listen(repromptSpeech);
            this.emit(':responseReady');
        }
    	
    
    
    },
    'AidIntent': function () {
        
        const itemSlot = this.event.request.intent.slots.illness;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myAdvice = this.t('ADVICE');
        const advice = myAdvice[itemName];

        if (advice) {
            this.attributes.speechOutput = advice;
            this.attributes.repromptSpeech = this.t('ADVICE_REPEAT_MESSAGE');

            this.response.speak(advice).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, advice);
            this.emit(':responseReady');
        } else {
            let speechOutput = this.t('ADVICE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ADVICE_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('ADVICE_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('ADVICE_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.response.speak(speechOutput).listen(repromptSpeech);
            this.emit(':responseReady');
        }
        
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    }

};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
