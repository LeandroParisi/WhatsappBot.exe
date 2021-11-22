const SessionRepository = require('../../services/sessionDb/Repository');

async function start(bot) {
  bot.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      console.log(message);

      bot
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          // const test = SessionRepository.GetClientCurrentStep();

          // console.log({ test });

          // console.log('Result: ', result); // return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); // return object error
        });
    }
  });
}

module.exports = start;
