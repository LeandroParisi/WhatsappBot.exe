import 'reflect-metadata';
import Container from 'typedi';
import BotStartup from './src/Domain/Flow/Startup/BotStartUp'
import UserDataHandler from './src/Services/UserData/UserDataHandler';

const venom = require('venom-bot')

class Main {
  botStartup : BotStartup

  constructor() {
    this.botStartup = Container.get(BotStartup);
  }

  async createBot() {
    try {
      await this.botStartup.InitialLoad();
      
      const bot = await venom.create({
        session: 'session-name', // name of session
        multidevice: false, // for version not multidevice use false.(default: true)
      });
      this.botStartup.SetBot(bot);

      await this.botStartup.LoadUserInfo();

      this.botStartup.Start();

      console.log("Bot Running")
    } catch (error) {
      // Enviar log do erro para um servidor
      console.log(error);
    }
  }
}


new Main().createBot();
