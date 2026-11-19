import React from 'react';
import { DAYS, DAYS_KO } from './state.js';
import { PhotoSlot, vars } from './templates2.jsx';
import { Heart, Twinkle, Star, Cloud } from './decor.jsx';

const isOff = (t) => /^(off|offline|휴방)$/i.test((t || '').trim());

/* ───────── 템플릿 11 · 블루 심플 카드 (1080x1000) ───────── */
const Zz = () => (
  <svg className="t11-zz" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M40 8 A24 24 0 1 0 56 44 A19 19 0 1 1 40 8 Z" fill="currentColor" />
    <path d="M44 6 h12 l-12 12 h12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export function Template11({ data }) {
  const c = data.colors;
  return (
    <div className="canvas t11" style={{ width: 1080, height: 1000, ...vars(c) }}>
      <div className="t11-dots" />
      <Cloud x={-90} y={800} s={460} c2="#cfe9ff" />
      <Cloud x={700} y={840} s={440} c2="#d6edff" />
      <div className="t11-card">
        <div className="t11-banner">
          <span className="t11-h"><Heart x={0} y={0} s={84} r={-10} c1="#e3f4ff" c2="#6fc0f2" /></span>
          <span className="t11-t">{data.title}</span>
          <span className="t11-h"><Heart x={0} y={0} s={84} r={10} c1="#e3f4ff" c2="#6fc0f2" /></span>
        </div>
        <div className="t11-rows">
          {data.rows.map((r, i) => {
            const off = isOff(r.time);
            const col = i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--text)';
            return (
              <div className={'t11-row' + (off ? ' off' : '')} key={i}>
                <div className="t11-day" style={{ color: col }}><i style={{ background: i >= 5 ? col : 'var(--accent)' }} />{DAYS_KO[i]}요일</div>
                <div className="t11-val">{off ? <><Zz />휴방</> : r.time}</div>
              </div>
            );
          })}
        </div>
        {(data.sns || data.badge) && (
          <div className="t11-foot">
            {data.sns && <span>{data.sns}</span>}
            {data.badge && <b>{data.badge}</b>}
          </div>
        )}
      </div>
      <Cloud x={-50} y={-70} s={300} o={0.95} />
      <Cloud x={820} y={-60} s={260} o={0.95} />
      <Twinkle x={30} y={170} s={44} />
      <Twinkle x={1000} y={200} s={36} />
      <Star x={998} y={860} s={56} r={12} c1="#e6f6ff" c2="#8ccdf5" />
      <Heart x={22} y={830} s={52} r={-14} c1="#e3f4ff" c2="#7cc8f4" />
    </div>
  );
}

/* ───────── 템플릿 12 · 사이버 HUD (1920x1080) ───────── */
const IconGame = () => (
  <svg className="t12-ic" viewBox="0 0 100 80" aria-hidden="true">
    <path d="M18 34 C18 22 26 16 38 16 H62 C74 16 82 22 82 34 L90 60 C93 72 80 78 72 68 L66 56 H34 L28 68 C20 78 7 72 10 60 Z" fill="currentColor" />
    <path d="M30 28 v14 M23 35 h14" stroke="#04101f" strokeWidth="5" strokeLinecap="round" />
    <circle cx="68" cy="30" r="4.5" fill="#04101f" /><circle cx="77" cy="38" r="4.5" fill="#04101f" />
  </svg>
);
const IconChat = () => (
  <svg className="t12-ic" viewBox="0 0 100 80" aria-hidden="true">
    <path d="M12 10 H88 V54 H52 L34 70 V54 H12 Z" fill="currentColor" />
    <path d="M26 26 H74 M26 38 H58" stroke="#04101f" strokeWidth="5" strokeLinecap="round" />
  </svg>
);
const IconMusic = () => (
  <svg className="t12-ic" viewBox="0 0 100 80" aria-hidden="true">
    <path d="M38 12 L82 4 V52 A12 12 0 1 1 74 41 V20 L46 26 V60 A12 12 0 1 1 38 49 Z" fill="currentColor" />
  </svg>
);
const ICONS = { game: IconGame, chat: IconChat, music: IconMusic };
export function Template12({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 1262, y: 158, w: 580, h: 640 };
  return (
    <div className="canvas t12" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t12-grid" />
      <svg className="t12-radar" width="760" height="760" viewBox="0 0 760 760" aria-hidden="true">
        <g fill="none" stroke="var(--accent)" strokeOpacity=".3" strokeWidth="2">
          <circle cx="380" cy="380" r="120" /><circle cx="380" cy="380" r="200" strokeDasharray="6 10" /><circle cx="380" cy="380" r="290" /><circle cx="380" cy="380" r="360" strokeOpacity=".15" />
          <path d="M380 0 V760 M0 380 H760" strokeOpacity=".2" />
        </g>
        {Array.from({ length: 36 }, (_, i) => <path key={i} d="M380 22 v14" stroke="var(--accent)" strokeOpacity=".45" strokeWidth="3" transform={`rotate(${i * 10} 380 380)`} />)}
      </svg>
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
      <div className="t12-side">SYSTEM // WEEKLY BROADCAST LINK // 01</div>
      <div className="t12-top">
        <span>{data.title}</span><i data-t="SCHEDULE">SCHEDULE</i>
      </div>
      <div className="t12-rows">
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          const Ic = ICONS[r.icon || 'game'];
          return (
            <div className={'t12-row' + (off ? ' off' : '')} key={i}>
              <div className="t12-idx">{String(i + 1).padStart(2, '0')}</div>
              <div className="t12-day"><b>{DAYS[i]}</b></div>
              <div className="t12-bar">
                <span className="t12-led" />
                <span className="t12-text">{off ? 'Break Time' : r.text}</span>
                {!off && Ic && <Ic />}
              </div>
              <div className="t12-tag"><em>»</em>{off ? 'NONE' : r.time}</div>
            </div>
          );
        })}
      </div>
      <div className="t12-date"><small>WEEK INFORMATION</small>{data.badge}</div>
      <div className="t12-cap"><i />{data.caption || 'FAN ART'}</div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={2} />
      <div className="t12-scan" style={{ left: slot.x, top: slot.y, width: slot.w, height: slot.h }} />
      <div className="t12-frame"><i className="a" /><i className="b" /><i className="c" /><i className="d" /><span className="t12-cross" /></div>
      <div className="t12-info">
        <div className="t12-ids"><small>STREAMER ID</small><b>{data.sns}</b></div>
        <div className="t12-status"><u /><span>ONLINE</span><em><i /><i /><i /><i /><i /></em></div>
        <div className="t12-lines"><i /><i /><i /><i /></div>
      </div>
      <div className="t12-foot"><span>SCHEDULE SYSTEM v1.0</span><span className="t12-code" /><span>SYSTEM ONLINE</span></div>
      <Twinkle x={1210} y={80} s={26} c="var(--accent)" />
      <div className="t12-scanlines" />
    </div>
  );
}

/* ───────── 템플릿 13 · 내 배경 자유형 (1920x1080) ───────── */
export const LAYOUT13 = { style: 'glass', mode: 'list', side: 'right', vpos: 'bottom', opacity: 78, scale: 100, dim: 20 };
export function Template13({ data, ...p }) {
  const c = data.colors;
  const L = { ...LAYOUT13, ...(data.layout || {}) };
  const s = L.scale / 100;
  const strip = L.mode === 'strip';
  const baseW = strip ? 1840 : 860, baseH = strip ? 400 : 960;
  const w = baseW * s, h = baseH * s;
  const left = strip ? (1920 - w) / 2 : L.side === 'left' ? 50 : L.side === 'center' ? (1920 - w) / 2 : 1920 - 50 - w;
  const top = strip ? (L.vpos === 'top' ? 40 : 1080 - 40 - h) : (1080 - h) / 2;
  const slot = { x: 0, y: 0, w: 1920, h: 1080 };
  const alpha = { backgroundColor: `color-mix(in srgb, ${L.style === 'dark' ? '#0b0d1c' : 'var(--panel)'} ${L.opacity}%, transparent)` };
  return (
    <div className="canvas t13" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={0} />
      <div className="t13-dim" style={{ background: `rgba(0,0,0,${L.dim / 100})` }} />
      <div className={`t13-panel s-${L.style} m-${L.mode}`} style={{ left, top, width: baseW, height: baseH, transform: `scale(${s})`, transformOrigin: 'top left', ...(L.style === 'clean' ? {} : alpha) }}>
        <div className="t13-head">
          <div className="t13-title">{data.title}</div>
          <div className="t13-sub"><span>{data.sns}</span><b>{data.badge}</b></div>
        </div>
        <div className="t13-rows">
          {data.rows.map((r, i) => {
            const off = isOff(r.time);
            return (
              <div className={'t13-row' + (off ? ' off' : '')} key={i}>
                <div className="t13-day" style={{ background: i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--accent)' }}>{DAYS[i]}</div>
                <div className="t13-text">{off ? '휴방' : r.text}</div>
                <div className="t13-time">{off ? 'OFF' : r.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const SLOT_COMPONENTS_4 = { 11: Template11, 12: Template12, 13: Template13 };
