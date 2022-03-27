/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata'
import Container from 'typedi'
import BotCore from './Domain/Flow/Startup/BotCore'
import BotStartup from './Domain/Flow/Startup/BotStartup'
import ElectronStartup from './Electron/EletronStartup'
import ILoginSubscriber from './Electron/Interfaces/EventsSubscribers/ILoginSubscriber'
const venom = require('venom-bot')

export default class Main implements ILoginSubscriber {
  BotCore : BotCore
  BotStartup : BotStartup
  ElectronStartup : ElectronStartup

  constructor() {
    this.BotCore = Container.get(BotCore)
    this.BotStartup = Container.get(BotStartup)
    this.ElectronStartup = Container.get(ElectronStartup)
    this.ElectronStartup.SubscribeForLogin(this)
  }


  async Run() {
    try {
      await this.ElectronStartup.Run()

      this.BotStartup.InstallServices()
      
    } catch (error) {
      // Trace
      console.log(error)
    }
  }

  public async ReceiveLogin(): Promise<void> {
    await this.BotStartup.Startup(this.BotCore)

    const bot = await this.CreateBot()

    this.BotCore.SetBot(bot)

    await this.BotStartup.LoadUserInfo(bot, this.BotCore)

    this.BotCore.Start()
  }

  private async CreateBot() : Promise<any> {
    const bot = await venom.create({
      session: 'teste', // name of session
      multidevice: true , // for version not multidevice use false.(default: true)
      // mkdirFolderToken: '/node_modules', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory,
      headless: false, // Headless chrome
      useChrome: true,
    })
    return bot  
  }
}


new Main().Run()
