import 'reflect-metadata';
import Container from 'typedi';
import Config from './src/config';
import BotStartup from './src/Domain/Flow/Startup/BotStartUp'
import UserDataHandler from './src/Services/UserData/UserDataHandler';
import SessionHandler from './src/Services/SessionManagement/SessionHandler'
import DaysUtils from './src/Shared/Utils/DaysUtils';

const venom = require('venom-bot')

class Main {
  BotStartup : BotStartup
  SessionHandler : SessionHandler

  constructor() {
    this.BotStartup = Container.get(BotStartup);
    this.SessionHandler = Container.get(SessionHandler)
  }

  async Run() {
    try {
      await this.Startup()

      const bot = await this.CreateBot()

      await this.InitialLoad(bot)

      this.BotStartup.Start();
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

  private async Startup() {
    const startupDate = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
    await this.BotStartup.ValidateUser(startupDate);
    await this.SessionHandler.ValidateCurrentSessions(startupDate);
  }

  private async InitialLoad(bot : any) : Promise<void> {
    this.BotStartup.SetBot(bot);

    await this.BotStartup.LoadUserInfo();
  }
  
}


new Main().Run();
