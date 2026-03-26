const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");

let mainWindow, audioServer, audioServerPort = 0;
const audioDir = path.join(app.getPath("userData"), "audio_files");
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const MIME = { ".mp3":"audio/mpeg",".wav":"audio/wav",".ogg":"audio/ogg",".flac":"audio/flac",".m4a":"audio/mp4",".aac":"audio/aac",".wma":"audio/x-ms-wma",".opus":"audio/opus",".webm":"audio/webm" };

function nextFileName(ext) {
  let n = 1;
  while (fs.existsSync(path.join(audioDir, String(n).padStart(4, "0") + ext))) n++;
  return String(n).padStart(4, "0") + ext;
}

function startAudioServer() {
  return new Promise(resolve => {
    audioServer = http.createServer((req, res) => {
      const name = decodeURIComponent(req.url.replace(/^\//, ""));
      const fp = path.join(audioDir, name);
      if (!fp.startsWith(audioDir) || !fs.existsSync(fp)) { res.writeHead(404); res.end(); return; }
      const mime = MIME[path.extname(fp).toLowerCase()] || "application/octet-stream";
      const stat = fs.statSync(fp);
      const range = req.headers.range;
      if (range) {
        const [s, e] = range.replace(/bytes=/, "").split("-").map(Number);
        const start = s, end = e || stat.size - 1;
        res.writeHead(206, { "Content-Range":`bytes ${start}-${end}/${stat.size}`, "Accept-Ranges":"bytes", "Content-Length":end-start+1, "Content-Type":mime, "Access-Control-Allow-Origin":"*" });
        fs.createReadStream(fp, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { "Content-Length":stat.size, "Content-Type":mime, "Accept-Ranges":"bytes", "Access-Control-Allow-Origin":"*" });
        fs.createReadStream(fp).pipe(res);
      }
    });
    audioServer.listen(0, "127.0.0.1", () => { audioServerPort = audioServer.address().port; resolve(); });
  });
}

function createWindow() {
  const isDev = !app.isPackaged;
  mainWindow = new BrowserWindow({
    width: 1280, height: 820, minWidth: 900, minHeight: 600,
    frame: false, backgroundColor: "#060606",
    icon: isDev ? path.join(__dirname, "..", "build", "icon.ico") : path.join(process.resourcesPath, "icon.ico"),
    webPreferences: { preload: path.join(__dirname, "preload.cjs"), contextIsolation: true, nodeIntegration: false },
  });
  if (isDev) {
    const di = path.join(__dirname, "..", "dist", "index.html");
    if (fs.existsSync(di)) mainWindow.loadFile(di); else { const t = (r=0) => { mainWindow.loadURL("http://localhost:5173").catch(() => { if (r<15) setTimeout(()=>t(r+1),1000); }); }; t(); }
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  mainWindow.on("closed", () => { mainWindow = null; });
  if (!isDev) { try { const{autoUpdater}=require("electron-updater"); autoUpdater.autoDownload=true; autoUpdater.autoInstallOnAppQuit=true; autoUpdater.on("update-downloaded",info=>{mainWindow?.webContents.send("update-downloaded",info.version);}); autoUpdater.checkForUpdatesAndNotify(); } catch(e){} }
}

ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => { if(mainWindow){mainWindow.isMaximized()?mainWindow.unmaximize():mainWindow.maximize();} });
ipcMain.on("window-close", () => mainWindow?.close());
ipcMain.handle("get-port", () => audioServerPort);

ipcMain.handle("pick-files", async () => {
  const r = await dialog.showOpenDialog(mainWindow, {
    title: "Select Audio Files",
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Audio", extensions: ["mp3","wav","ogg","flac","m4a","aac","wma","opus","webm"] }],
  });
  if (r.canceled) return [];
  const out = [];
  for (const fp of r.filePaths) {
    try {
      const ext = path.extname(fp).toLowerCase() || ".mp3";
      const storedName = nextFileName(ext);
      fs.copyFileSync(fp, path.join(audioDir, storedName));
      const title = path.basename(fp).replace(/\.[^.]+$/, "");
      out.push({ storedName, title });
    } catch (e) {}
  }
  return out;
});

ipcMain.handle("store-drop", async (ev, sourcePath, originalName) => {
  try {
    if (!sourcePath || !fs.existsSync(sourcePath)) return null;
    const ext = path.extname(originalName).toLowerCase() || ".mp3";
    const storedName = nextFileName(ext);
    fs.copyFileSync(sourcePath, path.join(audioDir, storedName));
    const title = originalName.replace(/\.[^.]+$/, "");
    return { storedName, title };
  } catch (e) { return null; }
});

ipcMain.handle("delete-file", async (ev, storedName) => {
  try {
    const fp = path.join(audioDir, storedName);
    if (fs.existsSync(fp)) { fs.unlinkSync(fp); return true; }
  } catch (e) {}
  return false;
});

ipcMain.on("install-update", () => { try{const{autoUpdater}=require("electron-updater");autoUpdater.quitAndInstall();}catch{} });

app.whenReady().then(async () => { await startAudioServer(); createWindow(); });
app.on("window-all-closed", () => { audioServer?.close(); if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
