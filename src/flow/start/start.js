const checkClientSession = require('../../services/sessionDb/queries/checkClientSession');

async function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          const test = checkClientSession(message.from);

          console.log({ test });

          // console.log('Result: ', result); // return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); // return object error
        });
    }
  });
}

module.exports = start;
