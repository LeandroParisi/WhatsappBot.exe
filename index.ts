import 'reflect-metadata';
import Container from 'typedi';
import BotCore from './src/Domain/Flow/Startup/BotCore'
import DaysUtils from './src/Shared/Utils/DaysUtils';
import Installer from './src/Domain/Flow/Startup/Installer';
import BotStartup from './src/Domain/Flow/Startup/BotStartup';

const venom = require('venom-bot')

class Main {
  BotCore : BotCore
  BotStartup : BotStartup

  constructor() {
    this.BotCore = Container.get(BotCore);
    this.BotStartup = Container.get(BotStartup)
  }

  async Run() {
    try {
      await this.BotStartup.Startup(this.BotCore)

      const bot = await this.CreateBot()

      this.BotCore.SetBot(bot);

      await this.BotStartup.LoadUserInfo(bot, this.BotCore)

      this.BotCore.Start();
    } catch (error) {
      // Trace
      console.log(error);
    }
  }

  private async CreateBot() : Promise<any> {
    const bot = await venom.create({
      session: 'session-name', // name of session
      multidevice: false, // for version not multidevice use false.(default: true)
    });

    return bot
  }
}

new Main().Run();
// new Main().TESTE();
