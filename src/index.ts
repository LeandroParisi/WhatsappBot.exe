/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata'
import Container from 'typedi'
import BotCore from './Domain/Flow/Startup/BotCore'
import BotStartup from './Domain/Flow/Startup/BotStartup'
import ElectronStartup from './Electron/EletronStartup'
const venom = require('venom-bot')

class Main {
  BotCore : BotCore
  BotStartup : BotStartup
  ElectronStartup : ElectronStartup

  constructor() {
    this.BotCore = Container.get(BotCore)
    this.BotStartup = Container.get(BotStartup)
    this.ElectronStartup = Container.get(ElectronStartup)
  }

  async Run() {
    try {
      this.ElectronStartup.Run()

      this.BotStartup.InstallServices()
      
      // await this.BotStartup.Startup(this.BotCore)

      const bot = await this.CreateBot()

      // this.BotCore.SetBot(bot)

      // await this.BotStartup.LoadUserInfo(bot, this.BotCore)

      // this.BotCore.Start()
    } catch (error) {
      // Trace
      console.log(error)
    }
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
