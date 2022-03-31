import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { Service } from 'typedi'
import Main from '..'
import ILoginInfo from '../Data/Interfaces/ILoginInfo'
import LoginError from '../Services/Abstractions/Errors/LoginError'
import UserDataHandler from '../Services/UserData/Handlers/UserDataHandler'
import ILoginSubscriber from './Interfaces/EventsSubscribers/ILoginSubscriber'

@Service()
export default class EletronStartup {
  private LoginSubscribers : Array<ILoginSubscriber> = []

  /**
   *
   */
  constructor(
    private readonly UserDataHandler : UserDataHandler,
  ) {}

  async Run() {
    this.LoadApp()
  }

  private async TryLogin() : Promise<boolean> {
    const hasToken = await this.UserDataHandler.HasToken()

    if (hasToken) {
      await this.UserDataHandler.ValidateToken()
      return true
    } else {
      return false   
    }
  }

  private LoadApp() : BrowserWindow {
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

      mainWindow.loadFile('./WebPage/index.html')

      mainWindow.on('closed', function () {
        mainWindow = null
      })

      mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify()
      })
    }

    
    app.on('ready', async () => {
      createWindow()
      this.SetAutoUpdateEvents(mainWindow)
      this.SetIpcEvents(mainWindow)

      try {
        const isLogged = await this.TryLogin()
        console.log({isLogged})

        if (!isLogged) {
          mainWindow.webContents.send('request_login', "Favor logar com sua credenciais.")
        } else {
          for (const subscriber of this.LoginSubscribers) {
            subscriber.ReceiveLogin()
          }
          mainWindow.webContents.send('logged_in', 'Sua sessão é válida.')
        }
      } catch (error) {
        const e = error as LoginError

        mainWindow.webContents.send('invalid_token', error.message)

        if (e.retryLogin) {
          mainWindow.webContents.send('request_login', error.message)
        }
      }
    })
    
    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    
    app.on('activate', async () => {
      if (mainWindow === null) {
        createWindow()
        this.SetAutoUpdateEvents(mainWindow)
        this.SetIpcEvents(mainWindow)

        try {
          const isLogged = await this.TryLogin()
          console.log({isLogged})
  
          if (!isLogged) {
            mainWindow.webContents.send('request_login', "Favor logar com sua credenciais.")
          } else {
            for (const subscriber of this.LoginSubscribers) {
              subscriber.ReceiveLogin()
            }
            mainWindow.webContents.send('logged_in', 'Sua sessão é válida.')
          }
        } catch (error) {
          const e = error as LoginError
  
          mainWindow.webContents.send('invalid_token', error.message)
  
          if (e.retryLogin) {
            mainWindow.webContents.send('request_login', error.message)
          }
        }
      }
    })


    return mainWindow
  }

  private SetIpcEvents(mainWindow : BrowserWindow) {
    ipcMain.on('app_version', (event) => {
      console.log({version: app.getVersion() })
      event.sender.send('app_version', { version: app.getVersion() })
    })

    ipcMain.on('receive_input', async (_message, loginInfo : ILoginInfo) => {

      try {
        await this.UserDataHandler.Login(loginInfo)
        for (const subscriber of this.LoginSubscribers) {
          subscriber.ReceiveLogin()
        }
        mainWindow.webContents.send('logged_in')
      } catch(error) {
        const e = error as LoginError

        mainWindow.webContents.send('invalid_token', error.message)

        if (e.retryLogin) {
          mainWindow.webContents.send('request_login', error.message)
        }
      }
    })
    
    ipcMain.on('restart_app', () => {
      autoUpdater.quitAndInstall()
    })
    
  }

  private SetAutoUpdateEvents(mainWindow : BrowserWindow) {
    autoUpdater.on('update-available', () => {
      mainWindow.webContents.send('update_available')
    })
    
    autoUpdater.on('update-downloaded', () => {
      mainWindow.webContents.send('update_downloaded')
    })
  }

  public SubscribeForLogin(subscriber: Main) {
    this.LoginSubscribers.push(subscriber)
  }
}