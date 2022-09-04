require("console-stamp")(console);
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    // ipcMain.handle("logToFile", logToFile);
    // ipcMain.handle("writeToFile", logToFile);
    // ipcMain.handle("logToFile", logToFile);

    win.loadFile("index.html");
};

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
