const venom = require('venom-bot');
const start = require('./src/flow/start/start');

async function createBot() {
  try {
    // Validação do cliente
    const bot = await venom.create({
      session: 'session-name', // name of session
      multidevice: false, // for version not multidevice use false.(default: true)
    });
    start(bot);
  } catch (error) {
    console.log(error);
  }
}

createBot();
