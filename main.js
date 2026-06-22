const { app, BrowserWindow, ipcMain } = require("electron");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
});


// 🔥 ===== UPDATE HANDLER =====

ipcMain.handle("descargar-update", async () => {
  const url = "https://github.com/Sukynova/MapSuky/releases/download/v1.0.1/SukySystem.Setup.1.0.1.exe";

  const filePath = path.join(app.getPath("desktop"), "SukySystemSetup.exe");

  function descargar(url, destino) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {

        // 🔥 SI ES REDIRECCIÓN
        if (res.statusCode === 302 || res.statusCode === 301) {
          return descargar(res.headers.location, destino)
            .then(resolve)
            .catch(reject);
        }

        if (res.statusCode !== 200) {
          return reject(new Error("Error HTTP: " + res.statusCode));
        }

        const file = fs.createWriteStream(destino);
        res.pipe(file);

        file.on("finish", () => {
          file.close(resolve);
        });

      }).on("error", reject);
    });
  }

  try {
    console.log("⬇ Descargando update...");

    await descargar(url, filePath);

    console.log("✅ Descargado");

    setTimeout(() => {
      exec(`"${filePath}"`, { detached: true, stdio: 'ignore' });
      app.quit();
    }, 1000);

    return true;

  } catch (err) {
    console.error("❌ Error descarga:", err);
    return false;
  }
});