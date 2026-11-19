const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  saveImage: (dataUrl, name) => ipcRenderer.invoke('save-image', { dataUrl, name }),
  saveProject: (json) => ipcRenderer.invoke('save-project', json),
  openProject: () => ipcRenderer.invoke('open-project'),
  version: () => ipcRenderer.invoke('version'),
});
