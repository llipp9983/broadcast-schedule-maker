import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { DAYS, DAYS_KO, TEMPLATES, SLOTS, defaultState, loadState, saveState, mergeState } from './state.js';
import { renderTemplate, sizeOf, TemplateThumb } from './registry.jsx';
import { LAYOUT13 } from './templates4.jsx';

const COLOR_LABELS = { bg: '배경색', panel: '패널색', accent: '포인트색', text: '글자색', sat: '토요일 색', sun: '일요일 색' };
const THEMES = [
  { name: '핑크', bg: '#ffd6ea', accent: '#ff6fae' },
  { name: '하늘', bg: '#bfe6ff', accent: '#2aa4f0' },
  { name: '라벤더', bg: '#e6defc', accent: '#8b6fe0' },
  { name: '민트', bg: '#cdf3e4', accent: '#1fb894' },
  { name: '노을', bg: '#ffe0c7', accent: '#f0773a' },
  { name: '레몬', bg: '#fff3b8', accent: '#e0a800' },
  { name: '밤하늘', bg: '#3a2f5c', accent: '#f08a24' },
  { name: '초콜릿', bg: '#dcb893', accent: '#8a6a55' },
];
const isOff = (t) => /^(off|offline|휴방)$/i.test((t || '').trim());
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const mondayOf = (d) => { const x = new Date(d); const w = (x.getDay() + 6) % 7; x.setDate(x.getDate() - w); x.setHours(12, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

function dataUrlToBlob(u) {
  const [h, b] = u.split(',');
  const mime = h.match(/:(.*?);/)[1];
  const bin = atob(b);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function Segmented({ value, onChange, options, label }) {
  return (
    <div className="ui-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} className={value === o.value ? 'on' : ''} aria-pressed={value === o.value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export default function App({ mock } = {}) {
  const [state, setStateRaw] = useState(() => (mock && mock.state) || loadState());
  const [format, setFormat] = useState('png');
  const [ratio, setRatio] = useState(2);
  const [tab, setTab] = useState((mock && mock.tab) || 'content');
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(false);
  const [version, setVersion] = useState('');
  const [fit, setFit] = useState((mock && mock.fit) || 0.5);
  const [zoom, setZoom] = useState(1);
  const [savedAt, setSavedAt] = useState(null);
  const [weekStart, setWeekStart] = useState(() => iso(mondayOf(new Date())));
  const [bulk, setBulk] = useState('20:00');
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const previewRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const stateRef = useRef(state);
  const past = useRef([]);
  const future = useRef([]);
  const lastPush = useRef(0);
  const [, force] = useState(0);
  stateRef.current = state;

  const tpl = state.template;
  const key = 't' + tpl;
  const meta = TEMPLATES.find((t) => t.id === tpl);
  const size = sizeOf(tpl);
  const data = state[key];
  const scale = fit * zoom;
  const colorLabel = (k) => (meta.labels && meta.labels[k]) || COLOR_LABELS[k];
  const hasPhoto = tpl >= 2 && !meta.noPhoto;
  const LY = { ...LAYOUT13, ...(data.layout || {}) };
  const setLY = (patch) => upd({ layout: { ...LY, ...patch } });

  /* ── 상태 + 되돌리기 ── */
  const setState = useCallback((updater) => {
    const prev = stateRef.current;
    const next = typeof updater === 'function' ? updater(prev) : updater;
    const now = Date.now();
    if (now - lastPush.current > 800) { past.current.push(prev); if (past.current.length > 80) past.current.shift(); }
    lastPush.current = now;
    future.current = [];
    stateRef.current = next;
    setStateRaw(next);
    force((n) => n + 1);
  }, []);
  const undo = () => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(stateRef.current);
    lastPush.current = 0;
    stateRef.current = prev; setStateRaw(prev); force((n) => n + 1);
  };
  const redo = () => {
    const nxt = future.current.pop();
    if (!nxt) return;
    past.current.push(stateRef.current);
    lastPush.current = 0;
    stateRef.current = nxt; setStateRaw(nxt); force((n) => n + 1);
  };

  useEffect(() => { const t = setTimeout(() => { saveState(state); setSavedAt(new Date()); }, 500); return () => clearTimeout(t); }, [state]);
  useEffect(() => { if (window.api) window.api.version().then(setVersion).catch(() => {}); }, []);
  useEffect(() => {
    const f = () => {
      const el = previewRef.current;
      if (!el) return;
      setFit(Math.max(0.1, Math.min((el.clientWidth - 48) / size.w, (el.clientHeight - 48) / size.h)));
    };
    f();
    const ro = new ResizeObserver(f); ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, [size.w, size.h]);

  const showToast = (msg, action) => { setToast({ msg, action }); clearTimeout(showToast.t); showToast.t = setTimeout(() => setToast(null), action ? 6000 : 2600); };

  /* ── 편집 도우미 ── */
  const upd = (patch) => setState((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  const setRow = (i, patch) => setState((s) => ({ ...s, [key]: { ...s[key], rows: s[key].rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) } }));
  const setColor = (k, v) => upd({ colors: { ...data.colors, [k]: v } });
  const setPhoto = (photo) => setState((s) => ({ ...s, [key]: { ...s[key], photo } }));
  const selectTemplate = (id) => { setSelected(false); setZoom(1); const n = { ...stateRef.current, template: id }; stateRef.current = n; setStateRaw(n); };
  const toggleOff = (i) => {
    const r = data.rows[i];
    if (isOff(r.time)) setRow(i, { time: r.prevTime || '20:00' });
    else setRow(i, { prevTime: r.time, time: 'OFF' });
  };
  const applyBulk = () => setState((s) => ({ ...s, [key]: { ...s[key], rows: s[key].rows.map((r) => (isOff(r.time) ? r : { ...r, time: bulk })) } }));
  const applyTheme = (t) => upd({ colors: { ...data.colors, bg: t.bg, accent: t.accent } });
  const resetCurrent = () => { if (window.confirm('이 템플릿의 내용과 색상을 처음 상태로 되돌릴까요?')) setState((s) => ({ ...s, [key]: defaultState()[key] })); };

  const applyWeek = (startIso) => {
    const start = mondayOf(new Date(startIso + 'T12:00:00'));
    const end = addDays(start, 6);
    setWeekStart(iso(start));
    const dot = (d) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    const md = (d) => `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    setState((s) => {
      const cur = s[key];
      const rows = cur.rows.map((r, i) => (r.date !== undefined ? { ...r, date: pad(addDays(start, i).getDate()) } : r));
      return { ...s, [key]: { ...cur, rows, ...(tpl === 1 ? { period: `${dot(start)} ~ ${dot(end)}` } : { badge: `${md(start)} ~ ${md(end)}` }) } };
    });
    showToast('날짜를 적용했어요');
  };
  const thisWeek = () => applyWeek(iso(mondayOf(new Date())));
  const nextWeek = () => applyWeek(iso(addDays(mondayOf(new Date()), 7)));

  /* ── 사진 ── */
  const addPhoto = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const area = SLOTS[stateRef.current.template];
        if (!area) return;
        const k = Math.max(area.w / img.naturalWidth, area.h / img.naturalHeight);
        const w = img.naturalWidth * k, h = img.naturalHeight * k;
        setState((s) => ({ ...s, ['t' + s.template]: { ...s['t' + s.template], photo: { src: fr.result, x: (area.w - w) / 2, y: (area.h - h) / 2, w, h, bw: w } } }));
        setSelected(true); setTab('photo');
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }, [setState]);
  const openFile = useCallback(() => fileRef.current && fileRef.current.click(), []);
  const photo = data.photo;
  const photoPct = photo ? Math.round((photo.w / (photo.bw || photo.w)) * 100) : 100;
  const setPhotoPct = (pct) => {
    if (!photo) return;
    const bw = photo.bw || photo.w;
    const w = bw * (pct / 100), h = w * (photo.h / photo.w);
    setPhoto({ ...photo, bw, w, h, x: photo.x + (photo.w - w) / 2, y: photo.y + (photo.h - h) / 2 });
  };
  const fitPhoto = () => {
    if (!photo) return;
    const area = SLOTS[tpl]; const ratioP = photo.w / photo.h;
    const k = Math.max(area.w / (area.h * ratioP) , 1);
    const h = Math.max(area.h, area.w / ratioP); const w = h * ratioP;
    setPhoto({ ...photo, bw: w, w, h, x: (area.w - w) / 2, y: (area.h - h) / 2 }); void k;
  };

  /* ── 내보내기 ── */
  const render = async (fmt) => {
    setSelected(false);
    await new Promise((r) => setTimeout(r, 80));
    await document.fonts.ready;
    const opts = { width: size.w, height: size.h, pixelRatio: ratio, filter: (n) => !(n.classList && n.classList.contains('noexport')), backgroundColor: '#ffffff', quality: 0.95 };
    const node = canvasRef.current;
    await toPng(node, opts);
    return fmt === 'png' ? toPng(node, opts) : toJpeg(node, opts);
  };
  const doExport = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const url = await render(format);
      const p = await window.api.saveImage(url, 'schedule-' + tpl);
      if (p) showToast('저장했어요', { label: '폴더 열기', run: () => window.api.reveal(p) });
    } catch (e) { showToast('저장 실패: ' + e.message); }
    setBusy(false);
  };
  const doCopy = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const url = await render('png');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': dataUrlToBlob(url) })]);
      showToast('이미지를 클립보드에 복사했어요 (Ctrl+V로 붙여넣기)');
    } catch (e) { showToast('복사 실패: ' + e.message); }
    setBusy(false);
  };
  const saveProj = async () => { const p = await window.api.saveProject(JSON.stringify(state)); if (p) showToast('프로젝트 파일로 저장했어요'); };
  const loadProj = async () => {
    const t = await window.api.openProject(); if (!t) return;
    try { setState(mergeState(defaultState(), JSON.parse(t))); showToast('불러왔어요'); } catch { showToast('올바른 프로젝트 파일이 아니에요'); }
  };

  /* ── 단축키 ── */
  const hk = useRef({});
  hk.current = { undo, redo, doExport, saveProj };
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      const inField = /^(INPUT|TEXTAREA)$/.test(document.activeElement && document.activeElement.tagName) && document.activeElement.type !== 'color' && document.activeElement.type !== 'range';
      if (k === 'z' && !e.shiftKey) { if (inField) return; e.preventDefault(); hk.current.undo(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { if (inField) return; e.preventDefault(); hk.current.redo(); }
      else if (k === 'e') { e.preventDefault(); hk.current.doExport(); }
      else if (k === 's') { e.preventDefault(); hk.current.saveProj(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const common = { scale, onPhoto: setPhoto, selected, setSelected, onAddPhoto: openFile };
  const out = `${Math.round(size.w * ratio)} × ${Math.round(size.h * ratio)}px`;
  const savedLabel = savedAt ? `${pad(savedAt.getHours())}:${pad(savedAt.getMinutes())} 자동 저장됨` : '자동 저장';

  return (
    <div className="ui">
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { addPhoto(e.target.files[0]); e.target.value = ''; }} />

      {/* 상단 바 */}
      <header className="ui-top">
        <div className="ui-brand"><span className="ui-logo" aria-hidden="true">▦</span><b>방송시간표 메이커</b><small>v{version}</small></div>
        <div className="ui-top-actions">
          <button className="ui-ibtn" onClick={undo} disabled={!past.current.length} title="되돌리기 (Ctrl+Z)" aria-label="되돌리기">↶ <span>되돌리기</span></button>
          <button className="ui-ibtn" onClick={redo} disabled={!future.current.length} title="다시 실행 (Ctrl+Y)" aria-label="다시 실행">↷</button>
          <span className="ui-sep" />
          <button className="ui-ibtn" onClick={loadProj} title="저장해 둔 프로젝트 열기">열기</button>
          <button className="ui-ibtn" onClick={saveProj} title="프로젝트 파일로 저장 (Ctrl+S)">프로젝트 저장</button>
        </div>
        <div className="ui-export">
          <Segmented label="파일 형식" value={format} onChange={setFormat} options={[{ value: 'png', label: 'PNG' }, { value: 'jpeg', label: 'JPG' }]} />
          <Segmented label="해상도" value={ratio} onChange={setRatio} options={[{ value: 1, label: '1x' }, { value: 2, label: '2x' }, { value: 3, label: '3x' }]} />
          <button className="ui-btn" onClick={doCopy} disabled={busy}>복사</button>
          <button className="ui-btn primary" onClick={doExport} disabled={busy}>{busy ? '만드는 중…' : '이미지로 저장'}<kbd>Ctrl+E</kbd></button>
        </div>
      </header>

      <div className="ui-body">
        {/* 템플릿 갤러리 */}
        <nav className="ui-gallery" aria-label="템플릿 선택">
          <div className="ui-h">템플릿</div>
          {TEMPLATES.map((t) => (
            <button key={t.id} className={'ui-card' + (t.id === tpl ? ' on' : '')} aria-pressed={t.id === tpl} onClick={() => selectTemplate(t.id)}>
              <TemplateThumb id={t.id} />
              <span className="ui-card-name"><b>{t.id}</b> {t.name}</span>
            </button>
          ))}
        </nav>

        {/* 미리보기 */}
        <main className="ui-stage-wrap">
          <div
            className={'ui-preview' + (dragOver ? ' drag' : '')}
            ref={previewRef}
            onDragOver={(e) => { if (hasPhoto) { e.preventDefault(); setDragOver(true); } }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (hasPhoto) addPhoto(e.dataTransfer.files[0]); }}
          >
            <div className="ui-stage" style={{ width: size.w * scale, height: size.h * scale }}>
              <div className="ui-scaler" style={{ transform: `scale(${scale})` }}>
                <div ref={canvasRef} style={{ width: size.w, height: size.h }}>{renderTemplate(tpl, data, common)}</div>
              </div>
            </div>
            {dragOver && <div className="ui-drop">여기에 사진을 놓으세요</div>}
          </div>
          <div className="ui-statusbar">
            <span className="ui-hint">{hasPhoto ? '사진 칸을 클릭하거나 이미지를 끌어다 놓으세요' : '오른쪽에서 글자를 바꾸면 바로 반영돼요'}</span>
            <span className="ui-grow" />
            <span className="ui-out">저장 크기 {out}</span>
            <div className="ui-zoom">
              <button className="ui-ibtn" onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.2).toFixed(2)))} aria-label="축소">−</button>
              <button className="ui-ibtn" onClick={() => setZoom(1)} title="화면에 맞추기">{Math.round(scale * 100)}%</button>
              <button className="ui-ibtn" onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))} aria-label="확대">＋</button>
            </div>
            <span className="ui-saved">{savedLabel}</span>
          </div>
        </main>

        {/* 편집 패널 */}
        <aside className="ui-panel">
          <div className="ui-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'content'} className={tab === 'content' ? 'on' : ''} onClick={() => setTab('content')}>내용</button>
            <button role="tab" aria-selected={tab === 'design'} className={tab === 'design' ? 'on' : ''} onClick={() => setTab('design')}>색상</button>
            {hasPhoto && <button role="tab" aria-selected={tab === 'photo'} className={tab === 'photo' ? 'on' : ''} onClick={() => setTab('photo')}>사진</button>}
          </div>

          <div className="ui-panel-body">
            {tab === 'content' && (
              <>
                <section className="ui-box">
                  <div className="ui-h">이번 주 날짜</div>
                  <div className="ui-row">
                    <input type="date" className="ui-in" value={weekStart} onChange={(e) => e.target.value && applyWeek(e.target.value)} aria-label="주 시작 날짜" />
                  </div>
                  <div className="ui-row">
                    <button className="ui-btn small" onClick={thisWeek}>이번 주</button>
                    <button className="ui-btn small" onClick={nextWeek}>다음 주</button>
                    <span className="ui-note">고르면 기간·날짜가 자동으로 채워져요</span>
                  </div>
                </section>

                <section className="ui-box">
                  <div className="ui-h">기본 정보</div>
                  {tpl === 1 ? (
                    <label className="ui-f"><span>기간</span><input className="ui-in" value={state.t1.period} onChange={(e) => upd({ period: e.target.value })} /></label>
                  ) : (
                    <>
                      {tpl >= 3 && <label className="ui-f"><span>제목</span><input className="ui-in" value={data.title} onChange={(e) => upd({ title: e.target.value })} /></label>}
                      <label className="ui-f"><span>SNS 아이디</span><input className="ui-in" value={data.sns} onChange={(e) => upd({ sns: e.target.value })} /></label>
                      <label className="ui-f"><span>기간 표시</span><input className="ui-in" value={data.badge} onChange={(e) => upd({ badge: e.target.value })} /></label>
                      {tpl === 12 && <label className="ui-f"><span>사진 위 문구</span><input className="ui-in" value={data.caption || ''} onChange={(e) => upd({ caption: e.target.value })} /></label>}
                    </>
                  )}
                </section>

                <section className="ui-box">
                  <div className="ui-h">요일별 방송 <small>쉬는 날은 ‘휴방’을 눌러요</small></div>
                  <div className="ui-days">
                    {data.rows.map((r, i) => {
                      const off = isOff(r.time);
                      const col = i === 5 ? data.colors.sat : i === 6 ? data.colors.sun : data.colors.accent;
                      return (
                        <div className={'ui-day' + (off ? ' off' : '')} key={i}>
                          <span className="ui-chip" style={{ background: col }} title={DAYS[i]}>{DAYS_KO[i]}</span>
                          {r.date !== undefined && <input className="ui-in ui-date" value={r.date} onChange={(e) => setRow(i, { date: e.target.value })} aria-label={`${DAYS_KO[i]} 날짜`} />}
                          <div className="ui-day-main">
                            {tpl === 1 ? (
                              <>
                                <input className="ui-in" placeholder="제목" value={r.title} onChange={(e) => setRow(i, { title: e.target.value })} aria-label={`${DAYS_KO[i]} 제목`} />
                                <input className="ui-in sub" placeholder="설명" value={r.desc} onChange={(e) => setRow(i, { desc: e.target.value })} aria-label={`${DAYS_KO[i]} 설명`} />
                              </>
                            ) : meta.single ? (
                              <input className="ui-in" placeholder="예: AM 2:00" value={r.time} onChange={(e) => setRow(i, { time: e.target.value })} aria-label={`${DAYS_KO[i]} 표시 내용`} />
                            ) : (
                              <input className="ui-in" placeholder="방송 내용" value={r.text} onChange={(e) => setRow(i, { text: e.target.value })} aria-label={`${DAYS_KO[i]} 내용`} />
                            )}
                          </div>
                          {tpl === 12 && (
                            <select className="ui-in ui-icon" value={r.icon || 'game'} onChange={(e) => setRow(i, { icon: e.target.value })} aria-label={`${DAYS_KO[i]} 아이콘`}>
                              <option value="game">게임</option><option value="chat">채팅</option><option value="music">노래</option><option value="none">없음</option>
                            </select>
                          )}
                          {!meta.single && <input className="ui-in ui-time" value={r.time} onChange={(e) => setRow(i, { time: e.target.value })} aria-label={`${DAYS_KO[i]} 시간`} />}
                          <button className={'ui-off' + (off ? ' on' : '')} aria-pressed={off} onClick={() => toggleOff(i)} title="이 날은 방송 쉬어요">휴방</button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="ui-row bulk">
                    <span>모든 요일 시간</span>
                    <input className="ui-in ui-time" value={bulk} onChange={(e) => setBulk(e.target.value)} aria-label="일괄 시간" />
                    <button className="ui-btn small" onClick={applyBulk}>한번에 적용</button>
                  </div>
                </section>
              </>
            )}

            {tab === 'design' && (
              <>
                <section className="ui-box">
                  <div className="ui-h">테마 색상 <small>눌러서 한번에 바꿔요</small></div>
                  <div className="ui-themes">
                    {THEMES.map((t) => (
                      <button key={t.name} className="ui-theme" onClick={() => applyTheme(t)} title={t.name}>
                        <i style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }} />
                        <span>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </section>
                {meta.custom && (
                  <section className="ui-box">
                    <div className="ui-h">시간표 배치 <small>배경 위에 올라가는 표</small></div>
                    <div className="ui-f"><span>표 스타일</span>
                      <Segmented label="표 스타일" value={LY.style} onChange={(v) => setLY({ style: v })} options={[{ value: 'glass', label: '유리' }, { value: 'dark', label: '어둡게' }, { value: 'clean', label: '글자만' }, { value: 'sticker', label: '스티커' }]} />
                    </div>
                    <div className="ui-f"><span>배치 방식</span>
                      <Segmented label="배치 방식" value={LY.mode} onChange={(v) => setLY({ mode: v })} options={[{ value: 'list', label: '세로 목록' }, { value: 'strip', label: '가로 카드' }]} />
                    </div>
                    <div className="ui-f"><span>표 위치</span>
                      {LY.mode === 'strip'
                        ? <Segmented label="표 위치" value={LY.vpos} onChange={(v) => setLY({ vpos: v })} options={[{ value: 'top', label: '위' }, { value: 'bottom', label: '아래' }]} />
                        : <Segmented label="표 위치" value={LY.side} onChange={(v) => setLY({ side: v })} options={[{ value: 'left', label: '왼쪽' }, { value: 'center', label: '가운데' }, { value: 'right', label: '오른쪽' }]} />}
                    </div>
                    <label className="ui-f"><span>표 투명도 {LY.opacity}%</span><input type="range" min="0" max="100" value={LY.opacity} onChange={(e) => setLY({ opacity: Number(e.target.value) })} /></label>
                    <label className="ui-f"><span>표 크기 {LY.scale}%</span><input type="range" min="60" max="110" value={LY.scale} onChange={(e) => setLY({ scale: Number(e.target.value) })} /></label>
                    <label className="ui-f"><span>배경 어둡게 {LY.dim}%</span><input type="range" min="0" max="80" value={LY.dim} onChange={(e) => setLY({ dim: Number(e.target.value) })} /></label>
                  </section>
                )}
                <section className="ui-box">
                  <div className="ui-h">세부 색상</div>
                  <div className="ui-colors">
                    {Object.keys(COLOR_LABELS).map((k) => (
                      <label key={k} className="ui-color"><input type="color" value={data.colors[k]} onChange={(e) => setColor(k, e.target.value)} /><span>{colorLabel(k)}</span></label>
                    ))}
                  </div>
                  <button className="ui-btn small" onClick={resetCurrent}>이 템플릿 처음으로</button>
                </section>
              </>
            )}

            {tab === 'photo' && hasPhoto && (
              <section className="ui-box">
                <div className="ui-h">{meta.custom ? '배경 이미지' : '사진'}</div>
                {!photo ? (
                  <button className="ui-drop-area" onClick={openFile}>
                    <b>{meta.custom ? '+ 배경 이미지 추가' : '+ 사진 추가'}</b>
                    <span>클릭하거나 이미지를 끌어다 놓으세요</span>
                  </button>
                ) : (
                  <>
                    <div className="ui-row">
                      <button className="ui-btn small" onClick={openFile}>사진 바꾸기</button>
                      <button className="ui-btn small" onClick={fitPhoto}>칸에 맞추기</button>
                      <button className="ui-btn small danger" onClick={() => { setPhoto(null); setSelected(false); }}>삭제</button>
                    </div>
                    <label className="ui-f"><span>크기 {photoPct}%</span><input type="range" min="50" max="300" value={photoPct} onChange={(e) => setPhotoPct(Number(e.target.value))} /></label>
                    <p className="ui-note">미리보기에서 사진을 끌어 위치를 옮기고, 모서리 점으로도 크기를 바꿀 수 있어요.</p>
                  </>
                )}
              </section>
            )}
          </div>
        </aside>
      </div>

      {toast && (
        <div className="ui-toast" role="status">
          <span>{toast.msg}</span>
          {toast.action && <button onClick={() => { toast.action.run(); setToast(null); }}>{toast.action.label}</button>}
        </div>
      )}
    </div>
  );
}
