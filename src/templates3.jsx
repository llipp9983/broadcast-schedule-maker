import React from 'react';
import { DAYS } from './state.js';
import { PhotoSlot, Sparkle, vars } from './templates2.jsx';

const isOff = (t) => /^(off|offline|휴방)$/i.test((t || '').trim());

/* ───────── 템플릿 8 · 우드 클립보드 ───────── */
export function Template8({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 70, y: 310, w: 540, h: 700 };
  return (
    <div className="canvas t8" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t8-title">{data.title}</div>
      <div className="t8-badge">{data.badge}</div>
      <div className="t8-board" />
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={14}>
        <div className="t8-clip"><i /></div>
        <div className="t8-sns">{data.sns}</div>
      </PhotoSlot>
      <div className="t8-rows">
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          return (
            <div className={'t8-row' + (off ? ' off' : '')} key={i} style={{ marginLeft: i % 2 ? 24 : 0 }}>
              <div className="t8-date" style={i >= 5 ? { background: i === 5 ? 'var(--sat)' : 'var(--sun)' } : undefined}>{r.date}</div>
              <div className="t8-bar">
                <div className="t8-meta">
                  <small style={{ background: i >= 5 ? (i === 5 ? 'var(--sat)' : 'var(--sun)') : 'var(--accent)' }}>{DAYS[i]}</small>
                  <b>{off ? '' : r.time}</b>
                </div>
                {!off && <div className="t8-sep" />}
                <div className="t8-text">{r.text}</div>
                {off && <div className="t8-off">OFFLINE</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── 템플릿 9 · 나이트 카드 ───────── */
export function Template9({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 70, y: 250, w: 520, h: 600, angle: -3 };
  const pos = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2]];
  return (
    <div className="canvas t9" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t9-stripe top" />
      <div className="t9-stripe bot" />
      <Sparkle x={1000} y={560} s={36} c="#ffd27a" />
      <Sparkle x={1820} y={430} s={44} c="#ffd27a" />
      <Sparkle x={660} y={190} s={28} c="#ffd27a" />
      <div className="t9-title">{data.title}</div>
      <div className="t9-badge">{data.badge}</div>
      <div className="t9-photoframe" />
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={6} />
      <div className="t9-sticky">{data.sns}</div>
      <div className="t9-cards">
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          const [cx, cy] = pos[i];
          return (
            <div className={'t9-card' + (off ? ' off' : '')} key={i} style={{ left: 700 + cx * 400 + (cy === 1 ? 0 : cy === 0 ? 0 : 0), top: 75 + cy * 320 }}>
              <div className="t9-ribbon" style={off ? undefined : undefined}>{r.date}</div>
              <div className="t9-day">{DAYS[i]}</div>
              <div className="t9-text">{r.text}</div>
              <div className="t9-pill">{off ? 'OFFLINE' : r.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── 템플릿 10 · 스탬프 티켓 ───────── */
export function Template10({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 70, y: 250, w: 560, h: 600 };
  return (
    <div className="canvas t10" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t10-map m1" />
      <div className="t10-map m2" />
      <div className="t10-weekly">{data.badge}</div>
      <div className="t10-title">{data.title}</div>
      <div className="t10-stamp" />
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={4} />
      <div className="t10-art">{data.sns}</div>
      <div className="t10-rows">
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          return (
            <div className="t10-row" key={i}>
              <div className="t10-ic"><b>{r.date}</b><small>{DAYS[i]}</small></div>
              <div className="t10-bar" style={{ background: off ? 'var(--accent)' : 'var(--sat)' }}>{r.text}</div>
              <div className="t10-ticket" style={{ background: off ? 'var(--sat)' : 'var(--accent)' }}>{off ? 'OFF LINE' : r.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const SLOT_COMPONENTS_3 = { 8: Template8, 9: Template9, 10: Template10 };
