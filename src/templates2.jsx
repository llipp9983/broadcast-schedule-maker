import React from 'react';
import { DAYS, DAYS_KO } from './state.js';
import { Star, Heart, Cloud, Paw, Ears, Flower, Bolt, Twinkle } from './decor.jsx';

export const vars = (c) => ({ '--bg': c.bg, '--panel': c.panel, '--accent': c.accent, '--text': c.text, '--sat': c.sat, '--sun': c.sun });
export const dayCol = (i) => (i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--accent)');

/** 사진 회전/반전 CSS */
export const photoTransform = (p) => {
  const parts = [];
  if (p.rot) parts.push(`rotate(${p.rot}deg)`);
  if (p.flipX || p.flipY) parts.push(`scale(${p.flipX ? -1 : 1}, ${p.flipY ? -1 : 1})`);
  return parts.length ? parts.join(' ') : undefined;
};

/** 사진 슬롯: 모양대로 잘린 영역 안에서 사진 이동/크기 조절 */
export function PhotoSlot({ slot, photo, scale, onPhoto, selected, setSelected, onAddPhoto, clip, radius, children }) {
  const ang = ((slot.angle || 0) * Math.PI) / 180;
  const startDrag = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    if (!photo) { if (onAddPhoto) onAddPhoto(); return; }
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
        const rot0 = p0.rot || 0;
        if (!rot0) {
          const w = Math.max(60, p0.w + sgn * dx);
          const h = w / ratio;
          onPhoto({ ...p0, w, h, x: mode.includes('w') ? p0.x + (p0.w - w) : p0.x, y: mode.includes('n') ? p0.y + (p0.h - h) : p0.y });
        } else {
          // 회전된 사진은 중심을 기준으로 크기 조절
          const tr = ang + (rot0 * Math.PI) / 180;
          const rx = sdx * Math.cos(tr) + sdy * Math.sin(tr);
          const w = Math.max(60, p0.w + 2 * sgn * rx);
          const h = w / ratio;
          onPhoto({ ...p0, w, h, x: p0.x + p0.w / 2 - w / 2, y: p0.y + p0.h / 2 - h / 2 });
        }
      }
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="slot" style={{ left: slot.x, top: slot.y, width: slot.w, height: slot.h, transform: slot.angle ? `rotate(${slot.angle}deg)` : undefined }}>
      <div className="slot-clip" style={{ clipPath: clip, borderRadius: radius }} onPointerDown={(e) => startDrag(e, 'move')}>
        {!photo && <div className="slot-empty noexport">+ 클릭해서 사진 추가</div>}
        {photo && <img src={photo.src} alt="" draggable={false} style={{ left: photo.x, top: photo.y, width: photo.w, height: photo.h, transform: photoTransform(photo) }} />}
      </div>
      {children}
      {selected && photo && (
        <div className="slot-sel noexport" style={{ left: photo.x, top: photo.y, width: photo.w, height: photo.h, transform: photo.rot ? `rotate(${photo.rot}deg)` : undefined }}>
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
  const slot = { x: 70, y: 110, w: 760, h: 870 };
  return (
    <div className="canvas t3" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t3-bokeh a" /><div className="t3-bokeh b" /><div className="t3-bokeh c" />
      <Ears x={slot.x + 20} y={slot.y - 118} w={slot.w - 40} h={120} fill="var(--accent)" inner="color-mix(in srgb, var(--accent) 30%, #fff)" />
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={50}>
        <div className="t3-frame" />
        <div className="t3-name"><Heart x={-12} y={-6} s={44} r={-12} />{data.sns}</div>
      </PhotoSlot>
      <Paw x={760} y={880} s={80} r={20} c="color-mix(in srgb, var(--accent) 80%, #fff)" />
      <Paw x={30} y={870} s={64} r={-18} c="color-mix(in srgb, var(--accent) 70%, #fff)" />
      <Heart x={24} y={40} s={74} r={-14} />
      <Star x={840} y={80} s={60} r={12} />
      <Twinkle x={870} y={900} s={50} />
      <div className="t3-panel">
        <div className="t3-title">{data.title}</div>
        <div className="t3-badge">{data.badge}</div>
        <div className="t3-rows">
          {data.rows.map((r, i) => (
            <div className="t3-row" key={i}>
              <div className="t3-day" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${dayCol(i)} 70%, #fff), ${dayCol(i)})` }}>{DAYS[i]}</div>
              <div className="t3-text">{r.text}</div>
              <div className="t3-time">{r.time}</div>
            </div>
          ))}
        </div>
      </div>
      <Heart x={1800} y={980} s={64} r={14} c1="#ffd0e4" c2="#ff7ab0" />
      <Twinkle x={1790} y={30} s={56} />
    </div>
  );
}

/* ───────── 템플릿 4 · 스카이 클라우드 ───────── */
export function Template4({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 1240, y: 120, w: 600, h: 650 };
  return (
    <div className="canvas t4" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t4-band" /><div className="t4-band b2" /><div className="t4-dots" />
      <Cloud x={560} y={80} s={240} o={0.9} />
      <Cloud x={1100} y={20} s={170} o={0.8} />
      <Cloud x={-40} y={880} s={520} c2="#cfe9ff" />
      <Cloud x={380} y={940} s={420} c2="#d6edff" />
      <Cloud x={820} y={900} s={540} c2="#cfe9ff" />
      <Cloud x={1330} y={940} s={460} c2="#d6edff" />
      <Cloud x={1650} y={880} s={440} c2="#cfe9ff" />
      <div className="t4-title">{data.title}</div>
      <Star x={860} y={30} s={64} r={14} />
      <Twinkle x={1180} y={100} s={40} />
      <div className="t4-rows">
        {data.rows.map((r, i) => (
          <div className="t4-row" key={i} style={{ marginLeft: i * 14 }}>
            <div className="t4-tag" style={{ background: i >= 5 ? `linear-gradient(180deg, color-mix(in srgb, ${dayCol(i)} 65%, #fff), ${dayCol(i)})` : undefined }}>{DAYS[i].toLowerCase()}</div>
            <div className="t4-text">{r.text}</div>
            <div className="t4-time">{r.time}</div>
          </div>
        ))}
      </div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={34}>
        <div className="t4-frame" />
      </PhotoSlot>
      <Cloud x={1130} y={60} s={200} />
      <Star x={1790} y={90} s={70} r={-10} />
      <Twinkle x={1190} y={700} s={46} />
      <Heart x={1760} y={700} s={60} r={14} c1="#bfe3ff" c2="#4fb0f5" />
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
      <div className="t5-orb a" /><div className="t5-orb b" /><div className="t5-orb c" />
      <div className="t5-sheet" />
      <div className="t5-card">
        <Ears x={50} y={-92} w={460} h={104} fill="color-mix(in srgb, var(--accent) 70%, #fff)" inner="#fff" edge="color-mix(in srgb, var(--accent) 40%, #fff)" />
      </div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={6} />
      <Twinkle x={990} y={760} s={96} c="#8fe6ff" />
      <Twinkle x={1120} y={880} s={46} c="#c9b8ff" />
      <Twinkle x={1740} y={140} s={60} c="#c9b8ff" />
      <Twinkle x={1810} y={700} s={40} c="#8fe6ff" />
      <Heart x={1700} y={820} s={90} r={12} c1="#e6dcff" c2="#b49cf5" />
      <Star x={60} y={40} s={52} r={-12} c1="#fff3a8" c2="#ffcf4a" />
      <div className="t5-title">{data.title}</div>
      <div className="t5-rows">
        {data.rows.map((r, i) => (
          <div className="t5-row" key={i}>
            <div className="t5-day" style={i >= 5 ? { background: `linear-gradient(135deg, ${dayCol(i)}, color-mix(in srgb, ${dayCol(i)} 60%, #fff))` } : undefined}>{DAYS_KO[i]}</div>
            <div className="t5-bar" />
            <div className="t5-text">{r.text}</div>
            <div className="t5-time">{r.time}</div>
          </div>
        ))}
      </div>
      <div className="t5-info"><span>{data.sns}</span><span className="b">{data.badge}</span></div>
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
      <div className="t6-glow" />
      <div className="t6-title">{data.title}</div>
      <Twinkle x={820} y={44} s={60} />
      <Star x={20} y={50} s={50} r={-14} c1="#e9defe" c2="#b79cf7" />
      <div className="t6-card">
        {data.rows.map((r, i) => (
          <div className="t6-row" key={i}>
            <div className="t6-day" style={{ background: i >= 5 ? `linear-gradient(180deg, color-mix(in srgb, ${dayCol(i)} 70%, #fff), ${dayCol(i)})` : `linear-gradient(180deg, color-mix(in srgb, var(--accent) ${70 - i * 4}%, #fff), color-mix(in srgb, var(--accent) ${100 - i * 8}%, #7d63d6))` }}>{DAYS[i]}</div>
            <div className="t6-line"><span>{r.text}</span></div>
            <div className="t6-time">{r.time}</div>
          </div>
        ))}
      </div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} clip={`path('${d}')`}>
        <svg className="t6-heart" width={slot.w} height={slot.h} viewBox={`0 0 ${slot.w} ${slot.h}`}>
          <path d={d} fill="none" stroke="color-mix(in srgb, var(--accent) 35%, #fff)" strokeWidth="58" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="color-mix(in srgb, var(--accent) 80%, #fff)" strokeWidth="40" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" strokeDasharray="0.1 34" />
        </svg>
      </PhotoSlot>
      <Heart x={1730} y={60} s={100} r={14} c1="#f3ecff" c2="#c3aaf8" />
      <Heart x={1000} y={720} s={110} r={-14} c1="#f3ecff" c2="#b79cf7" />
      <Heart x={1830} y={560} s={64} r={18} c1="#ffe3f1" c2="#ff9cc8" />
      <Twinkle x={1820} y={420} s={70} />
      <Twinkle x={960} y={150} s={50} />
      <div className="t6-info">
        <div className="t6-pill">{data.sns}</div>
        <div className="t6-pill alt">{data.badge}</div>
      </div>
    </div>
  );
}

/* ───────── 템플릿 7 · 노트 다이어리 ───────── */
const PASTEL = ['#d9ccff', '#ffd0dd', '#cfc3f3', '#cddcff', '#cdeee3', '#ffe3b8', '#ffd1d9'];
const ICON = ['♥', '★', '♥', '★', '♥', '★', '♥'];
export function Template7({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 100, y: 120, w: 560, h: 560 };
  return (
    <div className="canvas t7" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t7-edge"><i className="e1" /><i className="e2" /><i className="e3" /><i className="e4" /></div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={26}>
        <div className="t7-frame" />
        <div className="t7-tape" style={{ left: -44, top: -24, transform: 'rotate(-28deg)' }} />
        <div className="t7-tape" style={{ right: -44, bottom: -20, transform: 'rotate(-28deg)' }} />
      </PhotoSlot>
      <div className="t7-note">
        <div className="t7-sns">{data.sns}</div>
        <div className="t7-date">{data.badge}</div>
        <div className="t7-tape" style={{ left: 220, top: -26, transform: 'rotate(2deg)', width: 170, background: 'repeating-conic-gradient(#ffd0dd 0 25%, #fff 0 50%) 0 0 / 22px 22px' }} />
      </div>
      <Star x={30} y={70} s={58} r={-12} />
      <Star x={690} y={680} s={46} r={10} c1="#e6dcff" c2="#b9a6f2" />
      <Flower x={40} y={620} s={74} r={10} />
      <Flower x={1820} y={880} s={80} r={-12} c="#d9ccff" />
      <Bolt x={1780} y={150} s={80} r={14} />
      <Heart x={1830} y={560} s={64} r={14} c1="#cbb8ff" c2="#8d6df0" />
      <Twinkle x={720} y={110} s={44} c="#b9a6f2" />
      <div className="t7-panel">
        <div className="t7-title">{data.title}</div>
        <div className="t7-rows">
          {data.rows.map((r, i) => (
            <div className="t7-row" key={i}>
              <div className="t7-tag" style={{ background: `linear-gradient(180deg, #fff9, ${PASTEL[i]})`, boxShadow: `0 3px 0 ${PASTEL[i]}` }}><em>{ICON[i]}</em>{DAYS[i]}</div>
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
