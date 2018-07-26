import path from 'path'
import fs from 'fs'
import { app, browserWindow, ipcMain } from 'electron'

const menubar = require('menubar')({
    index: `file://${__dirname}/../renderer/views/main.html`,
    icon: `file://${__dirname}/../../../../static/icon.png`,
    width: 320,
    height: 500,
    preloadWindow: true,
    transparent: false,
    resizable: false,
    movable: true
})

let mainWindow

menubar.on('after-create-window', () => {
    console.log('app is ready')
    mainWindow = menubar.window
})
