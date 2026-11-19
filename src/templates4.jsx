import React from 'react';
import { DAYS, DAYS_KO } from './state.js';
import { PhotoSlot, vars } from './templates2.jsx';
import { Heart, Twinkle, Star } from './decor.jsx';

const isOff = (t) => /^(off|offline|휴방)$/i.test((t || '').trim());

/* ───────── 템플릿 11 · 블루 심플 카드 (1080x1000) ───────── */
export function Template11({ data }) {
  const c = data.colors;
  return (
    <div className="canvas t11" style={{ width: 1080, height: 1000, ...vars(c) }}>
      <div className="t11-card">
        <div className="t11-title">
          <span className="t11-h"><Heart x={0} y={0} s={78} r={-8} c1="#d9f0ff" c2="#6fc0f2" /></span>
          <span className="t11-t">{data.title}</span>
          <span className="t11-h"><Heart x={0} y={0} s={78} r={8} c1="#d9f0ff" c2="#6fc0f2" /></span>
        </div>
        <div className="t11-rows">
          {data.rows.map((r, i) => {
            const off = isOff(r.time);
            const col = i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--text)';
            return (
              <div className="t11-row" key={i}>
                <div className="t11-day" style={{ color: col }}>{DAYS_KO[i]}요일</div>
                <div className="t11-val">{off ? '휴방' : r.time}</div>
              </div>
            );
          })}
        </div>
        {(data.sns || data.badge) && <div className="t11-foot">{data.sns} {data.badge && <i>{data.badge}</i>}</div>}
      </div>
      <Twinkle x={26} y={22} s={40} />
      <Twinkle x={1010} y={940} s={34} />
    </div>
  );
}

/* ───────── 템플릿 12 · 사이버 HUD (1920x1080) ───────── */
const Pad = () => (
  <svg className="t12-pad" viewBox="0 0 100 80" aria-hidden="true">
    <path d="M18 34 C18 22 26 16 38 16 H62 C74 16 82 22 82 34 L90 60 C93 72 80 78 72 68 L66 56 H34 L28 68 C20 78 7 72 10 60 Z" fill="currentColor" />
    <path d="M30 28 v14 M23 35 h14" stroke="#04101f" strokeWidth="5" strokeLinecap="round" />
    <circle cx="68" cy="30" r="4.5" fill="#04101f" /><circle cx="77" cy="38" r="4.5" fill="#04101f" />
  </svg>
);
export function Template12({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 1260, y: 150, w: 580, h: 640 };
  return (
    <div className="canvas t12" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t12-grid" />
      <svg className="t12-map" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        <g fill="none" stroke="var(--accent)" strokeOpacity=".28" strokeWidth="2">
          <path d="M0 640 L180 600 L260 680 L420 640 L520 720 L760 690" />
          <path d="M900 120 L1020 200 L1010 320 L1160 380 L1180 520" />
          <path d="M1500 900 L1620 840 L1760 880 L1920 800" />
          <path d="M300 60 L420 120 L560 90 L700 170" />
          <circle cx="760" cy="690" r="16" /><circle cx="1180" cy="520" r="12" /><circle cx="420" cy="120" r="10" />
        </g>
      </svg>
      <div className="t12-vig" />
      <div className="t12-top">
        <span>{data.title}</span><i>SCHEDULE</i>
      </div>
      <div className="t12-rows">
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          return (
            <div className={'t12-row' + (off ? ' off' : '')} key={i}>
              <div className="t12-day"><b>{DAYS[i]}</b></div>
              <div className="t12-bar">
                <span className="t12-text">{off ? 'Break Time' : r.text}</span>
                {!off && <Pad />}
              </div>
              <div className="t12-tag">{off ? 'NONE' : r.time}</div>
            </div>
          );
        })}
      </div>
      <div className="t12-date"><small>WEEK</small>{data.badge}</div>
      <div className="t12-cap">{data.caption || 'FAN ART'}</div>
      <div className="t12-frame"><i className="a" /><i className="b" /><i className="c" /><i className="d" /></div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={2} />
      <div className="t12-info">
        <div className="t12-ids"><small>STREAMER</small><b>{data.sns}</b></div>
        <div className="t12-lines"><i /><i /><i /><i /></div>
      </div>
      <div className="t12-foot"><span>SCHEDULE SYSTEM</span><span>SYSTEM ONLINE</span></div>
      <Twinkle x={1210} y={80} s={26} c="var(--accent)" />
    </div>
  );
}

/* ───────── 템플릿 13 · 내 배경 자유형 (1920x1080) ───────── */
export function Template13({ data, ...p }) {
  const c = data.colors;
  const L = { side: 'right', opacity: 78, scale: 100, dim: 20, ...(data.layout || {}) };
  const s = L.scale / 100;
  const w = 860 * s, h = 960 * s;
  const left = L.side === 'left' ? 50 : L.side === 'center' ? (1920 - w) / 2 : 1920 - 50 - w;
  const top = (1080 - h) / 2;
  const slot = { x: 0, y: 0, w: 1920, h: 1080 };
  return (
    <div className="canvas t13" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={0} />
      <div className="t13-dim" style={{ background: `rgba(0,0,0,${L.dim / 100})` }} />
      <div className="t13-panel" style={{ left, top, width: 860, height: 960, transform: `scale(${s})`, transformOrigin: 'top left', background: `color-mix(in srgb, var(--panel) ${L.opacity}%, transparent)` }}>
        <div className="t13-head">
          <div className="t13-title">{data.title}</div>
          <div className="t13-sub"><span>{data.sns}</span><b>{data.badge}</b></div>
        </div>
        <div className="t13-rows">
          {data.rows.map((r, i) => (
            <div className="t13-row" key={i}>
              <div className="t13-day" style={{ background: i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--accent)' }}>{DAYS[i]}</div>
              <div className="t13-text">{r.text}</div>
              <div className="t13-time">{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SLOT_COMPONENTS_4 = { 11: Template11, 12: Template12, 13: Template13 };
export { Star };
