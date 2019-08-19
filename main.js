/***************************************************
  _____  ______          _____    __  __ ______ 
 |  __ \|  ____|   /\   |  __ \  |  \/  |  ____|
 | |__) | |__     /  \  | |  | | | \  / | |__   
 |  _  /|  __|   / /\ \ | |  | | | |\/| |  __|  
 | | \ \| |____ / ____ \| |__| | | |  | | |____ 
 |_|  \_\______/_/    \_\_____/  |_|  |_|______|

Before adding new features or making changes, read this: https://electronjs.org/docs/tutorial/application-architecture

That said, we are currently using the following technologies:
1) https://electronjs.org/ 
2) https://nodejs.org/en/ 
3) https://getbootstrap.com/
4) https://knockoutjs.com/
5) JQuery

Before start changing stuff, be aware:
1) jQuery is a JS library for the browser, eg DOM manipulating, etc. You shouldn't use that in the main process, since the main process is running in NodeJS.
2) Do not add stuff in the main.js. Create a new file inside /main-process and it will be automatically loaded
3) Try to use the current structure: /views /viewmodels /main-process

To run the app, use 'npm start'
To build the app, use 'electron-build'

Maintainability first!

***************************************************/

const { app, BrowserWindow, Tray, Menu  } = require("electron");
const glob = require('glob')
const path = require('path');

let mainWindow = null;
let tray = null;

// App setup
function createWindow() {
  if (mainWindow == null)
  {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      resizable: true,
      show: false,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js')
      }
    })
    mainWindow.loadFile('index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', function (event) {
    mainWindow.hide();
    event.preventDefault();
    return false;
  });

}

// Tray setup
function setupTray(){   
  tray = new Tray(path.join(__dirname, 'images/connectorPaused.png'));

  tray.on('double-click', function () { mainWindow.show(); });

  let template = [
    {
      label: 'Manage',
      click: function () { mainWindow.show(); }
    },
    {
      label: 'Exit',
      click: function () { tray.destroy(); app.quit(); }
    }
  ]

  const contextMenu = Menu.buildFromTemplate(template);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Metris Connector');
}

// Make this app a single instance app
function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir / CommonJS modules
function loadFiles () {
  const files = glob.sync(path.join(__dirname, 'main-process/*.js'))
  files.forEach((file) => { require(file) })
}

// Startup
app.on('ready', function () {
  makeSingleInstance();
  createWindow();
  setupTray();
  loadFiles();
  mainWindow.on('ready-to-show', () => { mainWindow.show(); });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

module.exports.setImage = function(path) {
  tray.setImage(path);
};