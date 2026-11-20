// 브라우저(HTML 단독 실행)용 API. Electron 없이도 저장/불러오기가 동작하도록 대신한다.
function download(blobOrUrl, filename) {
  const a = document.createElement('a');
  const isBlob = typeof blobOrUrl !== 'string';
  const url = isBlob ? URL.createObjectURL(blobOrUrl) : blobOrUrl;
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  if (isBlob) setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function installWebApi() {
  if (window.api) return;
  window.api = {
    isWeb: true,
    version: async () => 'web',
    reveal: async () => {},
    saveImage: async (dataUrl, name) => {
      const ext = dataUrl.startsWith('data:image/png') ? 'png' : 'jpg';
      const filename = `${name}.${ext}`;
      download(dataUrl, filename);
      return filename;
    },
    saveProject: async (json) => {
      const filename = '시간표.schedule.json';
      download(new Blob([json], { type: 'application/json' }), filename);
      return filename;
    },
    openProject: () => new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = '.json,application/json';
      input.onchange = () => {
        const f = input.files && input.files[0];
        if (!f) return resolve(null);
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => resolve(null);
        fr.readAsText(f);
      };
      input.addEventListener('cancel', () => resolve(null));
      input.click();
    }),
  };
}
