const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const isDev = require('electron-is-dev')

let mainWindow
let backendProcess

// 启动后端服务
function startBackend() {
  const backendPath = isDev 
    ? path.join(__dirname, '../backend/app.py')
    : path.join(process.resourcesPath, 'backend/app.py')
  
  console.log('Starting backend from:', backendPath)
  
  backendProcess = spawn('python', [backendPath], {
    stdio: 'pipe'
  })
  
  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`)
  })
  
  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`)
  })
  
  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`)
  })
}

// 停止后端服务
function stopBackend() {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  })

  // 加载前端页面
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../frontend/dist/index.html')}`
  
  mainWindow.loadURL(startUrl)
  
  // 开发工具
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
  
  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  
  // 处理外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// 应用就绪
app.whenReady().then(() => {
  startBackend()
  
  // 等待后端启动
  setTimeout(() => {
    createWindow()
  }, 2000)
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 应用退出
app.on('window-all-closed', () => {
  stopBackend()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  stopBackend()
})

// IPC 通信
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-platform', () => {
  return process.platform
})
