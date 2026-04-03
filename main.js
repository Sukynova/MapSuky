const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {

  createWindow();

  // 🔥 buscar actualizaciones
  autoUpdater.autoDownload = true;

  autoUpdater.checkForUpdates();

});

autoUpdater.on("update-available", () => {
  console.log("🆕 Update disponible");
});

autoUpdater.on("update-not-available", () => {
  console.log("✔ No hay updates");
});

autoUpdater.on("update-downloaded", () => {
  console.log("✅ Update descargado");

  autoUpdater.quitAndInstall();
});