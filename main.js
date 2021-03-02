const {app, BrowserWindow} = require('electron');
const fs = require("fs");
const { decodeEvent } = require('./src/Activity')

let dataPath = "C:\\Users\\varun\\Documents\\ActivityMonitor.org";
let configPath = "C:\\Users\\varun\\Documents\\config.json";
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
//      webSecurity: false,
      nodeIntegration: true,
    }
  });

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools()
  mainWindow.webContents.once('did-finish-load', async () => { 
    let config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    let data = fs.readFileSync(dataPath, { encoding: "utf8", flags: "r"})
    data = data.split('\n').map(num=>decodeEvent(BigInt(num),config));
    mainWindow.webContents.send('data', {
      config: config,
      data: data
    })
    console.log('sent')
  })
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
