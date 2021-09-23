//imports
const path = require('path');
const url = require('url');

//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

//variables for windows
let mainWindow;
let addWindow;


//function to create main window
function createWindow() {
  mainWindow = new BrowserWindow( {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('mainwindow.html')
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    app.quit();
  });

  


  ipcMain.on('item:add', function(e, name,category,wineType,year,winery,purchased,wineRating) {
    console.log(name);//test data got here to main
    mainWindow.webContents.send('item:add',name,category,wineType,year,winery,purchased,wineRating);
    addWindow.close();
  });

  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu)

}//end createWindow

//function to create window for Adding
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 500,
    title: 'Add Item',
    webPreferences: {
      nodeIntegration: true
    }
  });

  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addwindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  addWindow.on('close', function() {
    addWindow = null;
  });

}//end create addWindow

function clearWindow()
{
    mainWindow.webContents.send('item:clear');
}//end function clearWindow



//template for menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add',
        click() {createAddWindow()}
      },
      {
        label: 'Clear',
        click(){clearWindow()}
      },
      {
        label: 'Quit',
        accelerator:'CmdOrCtrl + q',
        click(){app.quit()}
        
      }
    ]
  }
];

app.on('ready', createWindow)