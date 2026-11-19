const { app, BrowserWindow, dialog, ipcMain, protocol, net, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } },
]);

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 1000, minHeight: 650,
    title: '방송시간표 메이커', backgroundColor: '#1e1e2a',
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false },
  });
  Menu.setApplicationMenu(null);
  if (process.env.VITE_DEV_URL) win.loadURL(process.env.VITE_DEV_URL);
  else win.loadURL('app://local/index.html');
}

function setupUpdater() {
  if (!app.isPackaged) return;
  const { autoUpdater } = require('electron-updater');
  autoUpdater.autoDownload = false;
  autoUpdater.on('update-available', async (info) => {
    const r = await dialog.showMessageBox(win, {
      type: 'info', buttons: ['업데이트', '나중에'], defaultId: 0, cancelId: 1,
      title: '업데이트', message: `새 버전 ${info.version}이 있습니다.`, detail: '업데이트 하시겠어요?',
    });
    if (r.response === 0) { win.setTitle('방송시간표 메이커 - 업데이트 다운로드 중...'); autoUpdater.downloadUpdate(); }
  });
  autoUpdater.on('update-downloaded', async () => {
    win.setTitle('방송시간표 메이커');
    const r = await dialog.showMessageBox(win, {
      type: 'info', buttons: ['지금 재시작', '나중에'], defaultId: 0, cancelId: 1,
      title: '업데이트 준비 완료', message: '다운로드가 완료되었습니다. 재시작하면 적용됩니다.',
    });
    if (r.response === 0) autoUpdater.quitAndInstall();
  });
  // 인터넷이 없으면 조용히 실패 -> 현재 버전 그대로 사용
  autoUpdater.on('error', () => { win && win.setTitle('방송시간표 메이커'); });
  autoUpdater.checkForUpdates().catch(() => {});
}

app.whenReady().then(() => {
  const root = path.join(__dirname, '..', 'dist');
  protocol.handle('app', (req) => {
    const u = new URL(req.url);
    let p = decodeURIComponent(u.pathname);
    if (p === '/' || p === '') p = '/index.html';
    const file = path.normalize(path.join(root, p));
    if (!file.startsWith(root)) return new Response('forbidden', { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });

  ipcMain.handle('save-image', async (_e, { dataUrl, name }) => {
    const ext = dataUrl.startsWith('data:image/png') ? 'png' : 'jpg';
    const r = await dialog.showSaveDialog(win, {
      defaultPath: `${name}.${ext}`, filters: [{ name: ext.toUpperCase(), extensions: [ext] }],
    });
    if (r.canceled || !r.filePath) return null;
    fs.writeFileSync(r.filePath, Buffer.from(dataUrl.split(',')[1], 'base64'));
    return r.filePath;
  });
  ipcMain.handle('save-project', async (_e, json) => {
    const r = await dialog.showSaveDialog(win, { defaultPath: '시간표.schedule.json', filters: [{ name: '시간표 프로젝트', extensions: ['json'] }] });
    if (r.canceled || !r.filePath) return null;
    fs.writeFileSync(r.filePath, json, 'utf8');
    return r.filePath;
  });
  ipcMain.handle('open-project', async () => {
    const r = await dialog.showOpenDialog(win, { filters: [{ name: '시간표 프로젝트', extensions: ['json'] }], properties: ['openFile'] });
    if (r.canceled || !r.filePaths[0]) return null;
    return fs.readFileSync(r.filePaths[0], 'utf8');
  });
  ipcMain.handle('version', () => app.getVersion());

  createWindow();
  setupUpdater();
});

app.on('window-all-closed', () => app.quit());
