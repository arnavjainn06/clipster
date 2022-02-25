const {
    app,
    globalShortcut,
    Tray,
    systemPreferences,
    ipcMain,
} = require("electron");
const open = require("open");
const { platform } = require("os");
const path = require("path");
const { clipboard } = require("electron");

// const ipc = require("electron").ipcMain;

const { BrowserWindow } = require("electron-acrylic-window");
const assetsDirectory = path.join(__dirname, "assets");

let win;
let tray;

function createWindow() {
    win = new BrowserWindow({
        width: 820,
        height: 620,
        frame: false,
        transparent: true,
        resizable: false,
        fullscreen: false,
        hasShadow: true,
        alwaysOnTop: true,
        // vibrancy: "dark",
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false,
            devTools: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    win.loadFile(path.join(__dirname, "/index.html"));
    win.removeMenu(true);

    win.webContents.toggleDevTools();

    globalShortcut.register("CommandOrControl + Shift + X", () => {
        toggleWindowVisibility();
    });

    globalShortcut.register("Control + Shift + Z", () => {
        console.log(clipboardEx.readFilePaths());
    });

    win.webContents.on("before-input-event", (event, input) => {
        if (input.key === "Escape") {
            destroyWindow();
        }
    });

    if (process.platform == "darwin") {
        // Don't show the app in the dock for macOS
        app.dock.hide();
    } else {
        // To hide the app in the dock for windows and linux
        win.setSkipTaskbar(true);
    }
}

function toggleWindow() {
    // win.reload();
    win.setSize(820, 620);
    setTimeout(() => {
        win.show();
    }, 50);
}

function createTrayImpact() {
    tray = new Tray(path.join(assetsDirectory, "icon.png"));
    tray.on("right-click", toggleWindow);
    // tray.on('double-click', toggleCadburyVisibility)
    tray.on("click", function (event) {
        toggleWindowVisibility();
    });
}

const destroyWindow = () => {
    if (process.platform == "darwin") {
        app.hide();
        win.hide();
    } else {
        win.minimize();
        win.hide();
    }
};

const toggleWindowVisibility = () => {
    if (win.isVisible()) {
        destroyWindow();
    } else {
        toggleWindow();
    }
};

app.whenReady().then(() => {
    createWindow();
    createTrayImpact();
});
