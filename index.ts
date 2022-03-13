/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata'
import Container from 'typedi'
import BotCore from './src/Domain/Flow/Startup/BotCore'
import BotStartup from './src/Domain/Flow/Startup/BotStartup'
import { app, BrowserWindow } from 'electron'
const venom = require('venom-bot')

class Main {
  BotCore : BotCore
  BotStartup : BotStartup

  constructor() {
    this.BotCore = Container.get(BotCore)
    this.BotStartup = Container.get(BotStartup)
  }

  async Run() {
    try {
      this.TesteElectron()
      
      this.BotStartup.InstallServices()
      
      await this.BotStartup.Startup(this.BotCore)

      const bot = await this.CreateBot()

      this.BotCore.SetBot(bot)

      await this.BotStartup.LoadUserInfo(bot, this.BotCore)

      this.BotCore.Start()

      // fs.readFile('./test.html', function (err, html) {
      //   if (err) {
      //       throw err; 
      //   }       
      //   http.createServer(function(request, response) {  
      //       response.writeHead(200, {"Content-Type": "text/html"});  
      //       response.write(html);  
      //       response.end();  
      //   }).listen(8000);
    // });
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

  private TesteElectron() : void {
    app.on('ready', () => {
      console.log('App is ready')

      const win = new BrowserWindow({
        width: 600,
        height: 400
      })

      const indexHTML = './index.html'

      win.loadFile(indexHTML).then(() => {
        // IMPLEMENT FANCY STUFF HERE
      })
    })
  }
}

new Main().Run()
// new Main().TESTE();
