/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata'
import Container from 'typedi'
import BotCore from './Domain/Flow/Startup/BotCore'
import BotStartup from './Domain/Flow/Startup/BotStartup'
import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
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
      
      // this.BotStartup.InstallServices()
      
      // await this.BotStartup.Startup(this.BotCore)

      // const bot = await this.CreateBot()

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


  private TesteElectron() : void {
    let mainWindow : BrowserWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      })

      mainWindow.loadFile('index.html')

      mainWindow.on('closed', function () {
        mainWindow = null
      })

      mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify()
      })
    }
    
    app.on('ready', () => {
      createWindow()
    })
    
    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    
    app.on('activate', function () {
      if (mainWindow === null) {
        createWindow()
      }
    })

    ipcMain.on('app_version', (event) => {
      console.log({version: app.getVersion() })
      event.sender.send('app_version', { version: app.getVersion() })
    })
    
    ipcMain.on('restart_app', () => {
      autoUpdater.quitAndInstall()
    })
    
    autoUpdater.on('update-available', () => {
      mainWindow.webContents.send('update_available')
    })
    
    autoUpdater.on('update-downloaded', () => {
      mainWindow.webContents.send('update_downloaded')
    })
  }
}


new Main().Run()
// new Main().TESTE();
