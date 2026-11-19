import React from 'react';
import { DAYS, DAYS_KO } from './state.js';

export const vars = (c) => ({ '--bg': c.bg, '--panel': c.panel, '--accent': c.accent, '--text': c.text, '--sat': c.sat, '--sun': c.sun });
export const dayCol = (i) => (i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--accent)');

/** 사진 슬롯: 모양대로 잘린 영역 안에서 사진 이동/크기 조절 */
export function PhotoSlot({ slot, photo, scale, onPhoto, selected, setSelected, clip, radius, children }) {
  const ang = ((slot.angle || 0) * Math.PI) / 180;
  const startDrag = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    if (!photo) return;
    setSelected(true);
    const sx = e.clientX, sy = e.clientY, p0 = { ...photo };
    const ratio = p0.w / p0.h;
    const move = (ev) => {
      const sdx = (ev.clientX - sx) / scale, sdy = (ev.clientY - sy) / scale;
      const dx = sdx * Math.cos(ang) + sdy * Math.sin(ang);
      const dy = -sdx * Math.sin(ang) + sdy * Math.cos(ang);
      if (mode === 'move') onPhoto({ ...p0, x: p0.x + dx, y: p0.y + dy });
      else {
        const sgn = mode.includes('e') ? 1 : -1;
        const w = Math.max(60, p0.w + sgn * dx);
        const h = w / ratio;
        onPhoto({ ...p0, w, h, x: mode.includes('w') ? p0.x + (p0.w - w) : p0.x, y: mode.includes('n') ? p0.y + (p0.h - h) : p0.y });
      }
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="slot" style={{ left: slot.x, top: slot.y, width: slot.w, height: slot.h, transform: slot.angle ? `rotate(${slot.angle}deg)` : undefined }}>
      <div className="slot-clip" style={{ clipPath: clip, borderRadius: radius }} onPointerDown={(e) => startDrag(e, 'move')}>
        {!photo && <div className="slot-empty noexport">사진을 추가하세요</div>}
        {photo && <img src={photo.src} alt="" draggable={false} style={{ left: photo.x, top: photo.y, width: photo.w, height: photo.h }} />}
      </div>
      {children}
      {selected && photo && (
        <div className="slot-sel noexport" style={{ left: photo.x, top: photo.y, width: photo.w, height: photo.h }}>
          {['nw', 'ne', 'sw', 'se'].map((m) => <div key={m} className={`handle ${m}`} onPointerDown={(e) => startDrag(e, m)} />)}
        </div>
      )}
    </div>
  );
}

const heartPath = (w, h) =>
  `M ${0.5 * w} ${0.94 * h} C ${0.06 * w} ${0.62 * h} ${0.0 * w} ${0.26 * h} ${0.2 * w} ${0.1 * h} C ${0.36 * w} ${-0.0 * h} ${0.5 * w} ${0.1 * h} ${0.5 * w} ${0.24 * h} C ${0.5 * w} ${0.1 * h} ${0.64 * w} ${0.0 * h} ${0.8 * w} ${0.1 * h} C ${1.0 * w} ${0.26 * h} ${0.94 * w} ${0.62 * h} ${0.5 * w} ${0.94 * h} Z`;

export const Sparkle = ({ x, y, s = 40, c = 'var(--accent)', r = 0 }) => (
  <svg className="sparkle" style={{ left: x, top: y, width: s, height: s, transform: `rotate(${r}deg)` }} viewBox="0 0 24 24">
    <path fill={c} d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" />
  </svg>
);

/* ───────── 템플릿 3 · 큐티 핑크 ───────── */
export function Template3({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 70, y: 90, w: 760, h: 900 };
  return (
    <div className="canvas t3" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={46}>
        <div className="t3-frame" />
        <div className="t3-name">{data.sns}</div>
      </PhotoSlot>
      <Sparkle x={36} y={50} s={70} c="#fff" />
      <Sparkle x={780} y={930} s={56} c="var(--accent)" />
      <div className="t3-panel">
        <div className="t3-title">{data.title}</div>
        <div className="t3-badge">{data.badge}</div>
        <div className="t3-rows">
          {data.rows.map((r, i) => (
            <div className="t3-row" key={i}>
              <div className="t3-day" style={{ background: dayCol(i) }}>{DAYS[i]}</div>
              <div className="t3-text">{r.text}</div>
              <div className="t3-time">{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── 템플릿 4 · 스카이 클라우드 ───────── */
export function Template4({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 1240, y: 110, w: 600, h: 650 };
  const clouds = [[60, 1040, 150], [260, 1000, 190], [520, 1050, 160], [760, 1010, 180], [1040, 1050, 170], [1320, 1005, 200], [1620, 1040, 170], [1850, 1010, 160]];
  return (
    <div className="canvas t4" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t4-band" />
      <div className="t4-band b2" />
      <svg className="t4-clouds" viewBox="0 0 1920 1080" width="1920" height="1080">
        {clouds.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity="0.9" />)}
      </svg>
      <div className="t4-title">{data.title}</div>
      <Sparkle x={620} y={40} s={50} c="#fff" />
      <Sparkle x={1170} y={90} s={36} c="var(--accent)" />
      <div className="t4-rows">
        {data.rows.map((r, i) => (
          <div className="t4-row" key={i} style={{ marginLeft: i * 14 }}>
            <div className="t4-tag" style={{ background: i >= 5 ? dayCol(i) : 'var(--accent)' }}>{DAYS[i].toLowerCase()}</div>
            <div className="t4-text">{r.text}</div>
            <div className="t4-time">{r.time}</div>
          </div>
        ))}
      </div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={34}>
        <div className="t4-frame" />
      </PhotoSlot>
      <Sparkle x={1800} y={70} s={60} c="#fff" />
      <Sparkle x={1190} y={700} s={44} c="#fff" />
      <div className="t4-badges">
        <div className="t4-pill">{data.sns}</div>
        <div className="t4-pill alt">{data.badge}</div>
      </div>
    </div>
  );
}

/* ───────── 템플릿 5 · 라벤더 폴라로이드 ───────── */
export function Template5({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 1091, y: 240, w: 470, h: 520, angle: -10 };
  return (
    <div className="canvas t5" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t5-sheet" />
      <div className="t5-card" />
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={8} />
      <Sparkle x={1010} y={780} s={90} c="#7fe3ff" />
      <Sparkle x={1130} y={880} s={44} c="#b7a3ff" />
      <Sparkle x={1760} y={150} s={50} c="#b7a3ff" />
      <Sparkle x={70} y={60} s={40} c="var(--accent)" />
      <div className="t5-title">{data.title}</div>
      <div className="t5-rows">
        {data.rows.map((r, i) => (
          <div className="t5-row" key={i}>
            <div className="t5-day" style={i >= 5 ? { background: dayCol(i) } : undefined}>{DAYS_KO[i]}</div>
            <div className="t5-bar" />
            <div className="t5-text">{r.text}</div>
            <div className="t5-time">{r.time}</div>
          </div>
        ))}
      </div>
      <div className="t5-info">
        <span>{data.sns}</span>
        <span className="b">{data.badge}</span>
      </div>
    </div>
  );
}

/* ───────── 템플릿 6 · 하트 프레임 ───────── */
export function Template6({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 1020, y: 110, w: 760, h: 700 };
  const d = heartPath(slot.w, slot.h);
  return (
    <div className="canvas t6" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t6-title">{data.title}</div>
      <Sparkle x={820} y={40} s={56} c="#fff" />
      <Sparkle x={20} y={60} s={40} c="var(--accent)" />
      <div className="t6-card">
        {data.rows.map((r, i) => (
          <div className="t6-row" key={i}>
            <div className="t6-day" style={{ background: i >= 5 ? dayCol(i) : `color-mix(in srgb, var(--accent) ${100 - i * 9}%, #c9b8ff)` }}>{DAYS[i]}</div>
            <div className="t6-line"><span>{r.text}</span></div>
            <div className="t6-time">{r.time}</div>
          </div>
        ))}
      </div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} clip={`path('${d}')`}>
        <svg className="t6-heart" width={slot.w} height={slot.h} viewBox={`0 0 ${slot.w} ${slot.h}`}>
          <path d={d} fill="none" stroke="color-mix(in srgb, var(--accent) 55%, #fff)" strokeWidth="46" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="var(--accent)" strokeWidth="14" strokeLinejoin="round" transform={`translate(0 0)`} opacity="0.9" />
          <path d={d} fill="none" stroke="#fff" strokeWidth="24" strokeLinecap="round" strokeDasharray="0.1 36" />
        </svg>
      </PhotoSlot>
      <Sparkle x={1820} y={420} s={70} c="#fff" />
      <Sparkle x={980} y={760} s={60} c="#fff" />
      <div className="t6-info">
        <div className="t6-pill">{data.sns}</div>
        <div className="t6-pill alt">{data.badge}</div>
      </div>
    </div>
  );
}

/* ───────── 템플릿 7 · 노트 다이어리 ───────── */
const PASTEL = ['#d9ccff', '#ffd0dd', '#cfc3f3', '#cddcff', '#cdeee3', '#ffe3b8', '#ffd1d9'];
export function Template7({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 100, y: 110, w: 560, h: 560 };
  return (
    <div className="canvas t7" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t7-edge" />
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={26}>
        <div className="t7-frame" />
        <div className="t7-tape" style={{ left: -40, top: -26, transform: 'rotate(-28deg)' }} />
        <div className="t7-tape" style={{ right: -40, bottom: -22, transform: 'rotate(-28deg)' }} />
      </PhotoSlot>
      <div className="t7-note">
        <div className="t7-sns">{data.sns}</div>
        <div className="t7-date">{data.badge}</div>
      </div>
      <Sparkle x={40} y={80} s={50} c="#ffd86b" />
      <Sparkle x={690} y={640} s={40} c="var(--accent)" />
      <Sparkle x={1830} y={900} s={54} c="var(--accent)" />
      <div className="t7-panel">
        <div className="t7-title">{data.title}</div>
        <div className="t7-rows">
          {data.rows.map((r, i) => (
            <div className="t7-row" key={i}>
              <div className="t7-tag" style={{ background: PASTEL[i] }}>{DAYS[i]}</div>
              <div className="t7-text">{r.text}</div>
              <div className="t7-time" style={{ color: i >= 5 ? dayCol(i) : 'var(--text)' }}>{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SLOT_COMPONENTS = { 3: Template3, 4: Template4, 5: Template5, 6: Template6, 7: Template7 };
