import 'reflect-metadata';
import Container from 'typedi';
import BotStartup from './src/Domain/Flow/Startup/BotStartUp'

const venom = require('venom-bot')

class Main {
  botStartup : BotStartup

  constructor() {
    this.botStartup = Container.get(BotStartup);
  }

  async createBot() {
    try {
      // Validação do cliente
      const bot = await venom.create({
        session: 'session-name', // name of session
        multidevice: false, // for version not multidevice use false.(default: true)
      });
      this.botStartup.Start(bot);
    } catch (error) {
      console.log(error);
    }
  }
}


new Main().createBot();
