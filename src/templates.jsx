import React from 'react';
import { DAYS } from './state.js';
import { Star, Heart, Cloud, Twinkle } from './decor.jsx';

const V = (c) => ({ '--bg': c.bg, '--panel': c.panel, '--accent': c.accent, '--text': c.text, '--sat': c.sat, '--sun': c.sun });
const dayColor = (i) => (i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--text)');

// 템플릿 1: 보라색 정사각형 (1080x1080), 글자만 수정
export function Template1({ data }) {
  const { period, rows, colors: c } = data;
  return (
    <div className="canvas t1" style={{ width: 1080, height: 1080, ...V(c) }}>
      <div className="t1-glow" />
      <div className="t1-dots" />
      <div className="t1-deco" />
      <Star x={30} y={36} s={64} r={-14} />
      <Star x={984} y={40} s={52} r={16} />
      <Twinkle x={90} y={150} s={38} />
      <Twinkle x={950} y={150} s={44} />
      <Heart x={1010} y={1004} s={50} r={14} c1="#ffe27a" c2="#ffb21f" />
      <div className="t1-title">SCHEDULE</div>
      <div className="t1-period">{period}</div>
      <div className="t1-rows">
        {rows.map((r, i) => (
          <div className="t1-row" key={i}>
            <div className="t1-day" style={i >= 5 ? { background: `linear-gradient(180deg, color-mix(in srgb, ${dayColor(i)} 60%, #fff), ${dayColor(i)})`, color: '#fff' } : undefined}>{DAYS[i]}</div>
            <div className="t1-mid">
              <div className="t1-rt">{r.title}</div>
              <div className="t1-rd">{r.desc}</div>
            </div>
            <div className="t1-time">{r.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 템플릿 2: 하늘색 16:9 (1920x1080), 왼쪽 사진, 오른쪽 스케줄 패널 고정
export function Template2({ data, scale, onPhoto, selected, setSelected }) {
  const { sns, badge, rows, colors: c, photo } = data;

  const startDrag = (e, mode) => {
    e.preventDefault(); e.stopPropagation();
    setSelected(true);
    const sx = e.clientX, sy = e.clientY, p0 = { ...photo };
    const ratio = p0.w / p0.h;
    const move = (ev) => {
      const dx = (ev.clientX - sx) / scale, dy = (ev.clientY - sy) / scale;
      if (mode === 'move') onPhoto({ ...p0, x: p0.x + dx, y: p0.y + dy });
      else {
        const sgnX = mode.includes('e') ? 1 : -1;
        const w = Math.max(60, p0.w + sgnX * dx);
        const h = w / ratio;
        const x = mode.includes('w') ? p0.x + (p0.w - w) : p0.x;
        const y = mode.includes('n') ? p0.y + (p0.h - h) : p0.y;
        onPhoto({ ...p0, x, y, w, h });
      }
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div className="canvas t2" style={{ width: 1920, height: 1080, ...V(c) }} onPointerDown={() => setSelected(false)}>
      <div className="t2-sky" />
      {photo && (
        <div className="t2-photo" style={{ left: photo.x, top: photo.y, width: photo.w, height: photo.h }} onPointerDown={(e) => startDrag(e, 'move')}>
          <img src={photo.src} draggable={false} alt="" />
          {selected && (
            <>
              <div className="sel noexport" />
              {['nw', 'ne', 'sw', 'se'].map((m) => (
                <div key={m} className={`handle noexport ${m}`} onPointerDown={(e) => startDrag(e, m)} />
              ))}
            </>
          )}
        </div>
      )}
      <Cloud x={-60} y={880} s={560} c2="#cfe9ff" />
      <Cloud x={400} y={930} s={420} c2="#d6edff" />
      <Cloud x={700} y={900} s={460} c2="#cfe9ff" />
      <Cloud x={90} y={50} s={220} o={0.9} />
      <Star x={900} y={90} s={60} r={12} />
      <Twinkle x={980} y={880} s={52} />
      <Heart x={40} y={420} s={60} r={-14} c1="#bfe3ff" c2="#4fb0f5" />
      <div className="t2-panel">
        <div className="t2-sns">{sns}</div>
        <div className="t2-title">SCHEDULE</div>
        <div className="t2-badge">{badge}</div>
        <div className="t2-rows">
          {rows.map((r, i) => (
            <div className="t2-row" key={i}>
              <div className="t2-day" style={i >= 5 ? { background: `linear-gradient(180deg, color-mix(in srgb, ${dayColor(i)} 60%, #fff), ${dayColor(i)})` } : undefined}>{DAYS[i]}</div>
              <div className="t2-text">{r.text}</div>
              <div className="t2-time" style={i >= 5 ? { color: dayColor(i) } : undefined}>{r.time}</div>
            </div>
          ))}
        </div>
      </div>
      <Twinkle x={1760} y={30} s={50} />
    </div>
  );
}
