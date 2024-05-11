// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { CustomQuestionAnswering } = require('botbuilder-ai');

class EchoBot extends ActivityHandler {
    constructor(configuration, qnaOptions) {
        super();

        this.qnaMaker = new CustomQuestionAnswering(configuration.QnAConfiguration, qnaOptions);

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const qnaResults = await this.qnaMaker.getAnswers(context);
            if(qnaResults[0]) {
                console.log(qnaResults[0]);
                await context.sendActivity(`${qnaResults[0].answer}`);
            } else {
                await context.sendActivity(`I'm not sure I found an answer to your question.`);
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome you filthy scum!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
