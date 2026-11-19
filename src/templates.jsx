import React from 'react';
import { DAYS } from './state.js';

const dayColor = (i, c) => (i === 5 ? c.sat : i === 6 ? c.sun : c.text);

// 템플릿 1: 보라색 정사각형 (1080x1080), 글자만 수정
export function Template1({ data }) {
  const { period, rows, colors: c } = data;
  return (
    <div className="canvas t1" style={{ width: 1080, height: 1080, background: `radial-gradient(circle at 20% 10%, ${c.panel}55, transparent 55%), ${c.bg}` }}>
      <div className="t1-deco" style={{ borderColor: c.accent }} />
      <div className="t1-title" style={{ color: c.accent, textShadow: `6px 6px 0 ${c.panel}, 0 0 30px ${c.accent}55` }}>SCHEDULE</div>
      <div className="t1-period" style={{ background: c.accent, color: c.bg }}>{period}</div>
      <div className="t1-rows">
        {rows.map((r, i) => (
          <div className="t1-row" key={i} style={{ background: `${c.panel}`, boxShadow: `0 4px 0 ${c.bg}aa` }}>
            <div className="t1-day" style={{ color: dayColor(i, c) }}>{DAYS[i]}</div>
            <div className="t1-mid">
              <div className="t1-rt" style={{ color: c.text }}>{r.title}</div>
              <div className="t1-rd" style={{ color: c.text }}>{r.desc}</div>
            </div>
            <div className="t1-time" style={{ color: c.accent }}>{r.time}</div>
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
        // 모서리 핸들: 비율 유지 리사이즈 (mode = 'nw' | 'ne' | 'sw' | 'se')
        const sgnX = mode.includes('e') ? 1 : -1;
        let w = Math.max(60, p0.w + sgnX * dx);
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
    <div className="canvas t2" style={{ width: 1920, height: 1080, background: `radial-gradient(circle at 25% 20%, #ffffff66, transparent 60%), ${c.bg}` }} onPointerDown={() => setSelected(false)}>
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
      <div className="t2-panel" style={{ background: c.panel, boxShadow: `0 10px 40px ${c.accent}55` }}>
        <div className="t2-sns" style={{ color: c.accent }}>{sns}</div>
        <div className="t2-title" style={{ color: c.accent, textShadow: `4px 4px 0 ${c.bg}` }}>SCHEDULE</div>
        <div className="t2-badge" style={{ background: c.accent, color: '#fff' }}>{badge}</div>
        <div className="t2-rows">
          {rows.map((r, i) => (
            <div className="t2-row" key={i} style={{ borderBottom: i < 6 ? `2px dashed ${c.accent}44` : 'none' }}>
              <div className="t2-day" style={{ color: i >= 5 ? dayColor(i, c) : c.accent }}>{DAYS[i]}</div>
              <div className="t2-text" style={{ color: c.text }}>{r.text}</div>
              <div className="t2-time" style={{ color: dayColor(i, c) === c.text ? c.accent : dayColor(i, c) }}>{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
