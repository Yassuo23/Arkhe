const { BrowserWindow, app, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");


app.whenReady().then(() => {
    window = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    window.loadFile(path.join(__dirname, "../renderer/index.html"));
});