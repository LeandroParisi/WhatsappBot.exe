import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { Service } from 'typedi'

@Service()
export default class EletronStartup {
  Run() {
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

    ipcMain.on('receive_input', (p) => {
      console.log(p)
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