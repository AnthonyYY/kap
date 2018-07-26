'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const menubar = require('menubar')({
    index: `file://${__dirname}/../renderer/views/main.html`,
    icon: `file://${__dirname}/../../../../static/icon.png`,
    width: 320,
    height: 500,
    preloadWindow: true,
    transparent: false,
    resizable: false,
    movable: true
});

let mainWindow;

menubar.on('after-create-window', () => {
    console.log('app is ready');
    mainWindow = menubar.window;
});