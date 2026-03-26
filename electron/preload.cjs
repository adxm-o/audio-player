const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  getPort: () => ipcRenderer.invoke("get-port"),
  pickFiles: () => ipcRenderer.invoke("pick-files"),
  storeDrop: (src, name) => ipcRenderer.invoke("store-drop", src, name),
  deleteFile: (name) => ipcRenderer.invoke("delete-file", name),
  installUpdate: () => ipcRenderer.send("install-update"),
  onUpdateDownloaded: (cb) => ipcRenderer.on("update-downloaded", (_, v) => cb(v)),
});
