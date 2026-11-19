import React, { useEffect, useRef, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { DAYS, DAYS_KO, defaultState, loadState, saveState } from './state.js';
import { Template1, Template2 } from './templates.jsx';

const COLOR_LABELS = { bg: '배경색', panel: '패널색', accent: '포인트색', text: '글자색', sat: '토요일 글자색', sun: '일요일 글자색' };

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="in" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [format, setFormat] = useState('png');
  const [ratio, setRatio] = useState(1);
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState(false);
  const [version, setVersion] = useState('');
  const [scale, setScale] = useState(0.5);
  const previewRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const tpl = state.template;
  const key = tpl === 1 ? 't1' : 't2';
  const size = tpl === 1 ? { w: 1080, h: 1080 } : { w: 1920, h: 1080 };
  const data = state[key];

  useEffect(() => { const t = setTimeout(() => saveState(state), 400); return () => clearTimeout(t); }, [state]);
  useEffect(() => { if (window.api) window.api.version().then(setVersion).catch(() => {}); }, []);
  useEffect(() => {
    const fit = () => {
      const el = previewRef.current;
      if (!el) return;
      setScale(Math.max(0.1, Math.min((el.clientWidth - 40) / size.w, (el.clientHeight - 40) / size.h)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, [size.w, size.h]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };
  const upd = (patch) => setState((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  const setRow = (i, patch) => upd({ rows: data.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  const setColor = (k, v) => upd({ colors: { ...data.colors, [k]: v } });
  const setPhoto = (photo) => setState((s) => ({ ...s, t2: { ...s.t2, photo } }));

  const addPhoto = (file) => {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const area = { w: 1100, h: 1080 };
        const k = Math.max(area.w / img.naturalWidth, area.h / img.naturalHeight);
        const w = img.naturalWidth * k;
        const h = img.naturalHeight * k;
        setPhoto({ src: fr.result, x: (area.w - w) / 2, y: (area.h - h) / 2, w, h });
        setSelected(true);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  };

  const doExport = async () => {
    try {
      setSelected(false);
      await new Promise((r) => setTimeout(r, 80));
      await document.fonts.ready;
      const opts = {
        width: size.w, height: size.h, pixelRatio: ratio,
        filter: (n) => !(n.classList && n.classList.contains('noexport')),
        backgroundColor: '#ffffff', quality: 0.95,
      };
      const node = canvasRef.current;
      await toPng(node, opts); // 폰트/이미지 선로딩용 워밍업
      const dataUrl = format === 'png' ? await toPng(node, opts) : await toJpeg(node, opts);
      const p = await window.api.saveImage(dataUrl, tpl === 1 ? 'schedule-1' : 'schedule-2');
      if (p) showToast('저장 완료: ' + p);
    } catch (e) {
      showToast('내보내기 실패: ' + e.message);
    }
  };

  const saveProj = async () => {
    const p = await window.api.saveProject(JSON.stringify(state));
    if (p) showToast('프로젝트 저장 완료');
  };
  const loadProj = async () => {
    const t = await window.api.openProject();
    if (!t) return;
    try {
      const s = JSON.parse(t);
      const d = defaultState();
      setState({ ...d, ...s, t1: { ...d.t1, ...s.t1 }, t2: { ...d.t2, ...s.t2 } });
      showToast('불러오기 완료');
    } catch {
      showToast('올바른 파일이 아닙니다');
    }
  };
  const reset = () => {
    if (window.confirm('현재 템플릿의 내용을 초기화할까요?')) setState((s) => ({ ...s, [key]: defaultState()[key] }));
  };

  return (
    <div className="app">
      <div className="topbar">
        <button className={'btn' + (tpl === 1 ? ' on' : '')} onClick={() => setState((s) => ({ ...s, template: 1 }))}>템플릿 1 · 고정형</button>
        <button className={'btn' + (tpl === 2 ? ' on' : '')} onClick={() => setState((s) => ({ ...s, template: 2 }))}>템플릿 2 · 사진 배경형</button>
        <div className="spacer" />
        <button className="btn" onClick={loadProj}>불러오기</button>
        <button className="btn" onClick={saveProj}>프로젝트 저장</button>
        <select className="btn" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
        <select className="btn" value={ratio} onChange={(e) => setRatio(Number(e.target.value))}>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
        </select>
        <button className="btn primary" onClick={doExport}>이미지 내보내기</button>
      </div>
      <div className="main">
        <div className="side">
          <h3>기본 정보</h3>
          {tpl === 1 ? (
            <Field label="기간" value={state.t1.period} onChange={(v) => upd({ period: v })} />
          ) : (
            <>
              <Field label="SNS 아이디" value={state.t2.sns} onChange={(v) => upd({ sns: v })} />
              <Field label="날짜 뱃지" value={state.t2.badge} onChange={(v) => upd({ badge: v })} />
            </>
          )}

          {tpl === 2 && (
            <>
              <h3>배경 사진</h3>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { addPhoto(e.target.files[0]); e.target.value = ''; }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn" onClick={() => fileRef.current.click()}>{state.t2.photo ? '사진 교체' : '사진 추가'}</button>
                {state.t2.photo && <button className="btn danger" onClick={() => { setPhoto(null); setSelected(false); }}>사진 삭제</button>}
              </div>
              <div className="hint">미리보기에서 사진을 드래그해 이동, 모서리 점을 끌어 크기를 조절하세요. 바깥을 클릭하면 선택이 해제됩니다.</div>
            </>
          )}

          <h3>요일별 내용</h3>
          {data.rows.map((r, i) => (
            <div className="rowedit" key={i}>
              <div className="head">{DAYS[i]} ({DAYS_KO[i]})</div>
              {tpl === 1 ? (
                <div className="grid">
                  <input className="in" placeholder="제목" value={r.title} onChange={(e) => setRow(i, { title: e.target.value })} />
                  <input className="in" placeholder="시간" value={r.time} onChange={(e) => setRow(i, { time: e.target.value })} />
                  <input className="in full" placeholder="설명" value={r.desc} onChange={(e) => setRow(i, { desc: e.target.value })} />
                </div>
              ) : (
                <div className="grid">
                  <input className="in" placeholder="내용" value={r.text} onChange={(e) => setRow(i, { text: e.target.value })} />
                  <input className="in" placeholder="시간" value={r.time} onChange={(e) => setRow(i, { time: e.target.value })} />
                </div>
              )}
            </div>
          ))}

          <h3>색상</h3>
          <div className="colors">
            {Object.keys(COLOR_LABELS).map((k) => (
              <label key={k}>{COLOR_LABELS[k]}<input type="color" value={data.colors[k]} onChange={(e) => setColor(k, e.target.value)} /></label>
            ))}
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="btn" onClick={reset}>이 템플릿 초기화</button>
            <span className="hint">v{version} · 자동 저장됨</span>
          </div>
        </div>

        <div className="preview" ref={previewRef}>
          <div className="stage" style={{ width: size.w * scale, height: size.h * scale, boxShadow: '0 10px 40px #0008' }}>
            <div className="scaler" style={{ transform: `scale(${scale})` }}>
              <div ref={canvasRef} style={{ width: size.w, height: size.h }}>
                {tpl === 1
                  ? <Template1 data={state.t1} />
                  : <Template2 data={state.t2} scale={scale} onPhoto={setPhoto} selected={selected} setSelected={setSelected} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
