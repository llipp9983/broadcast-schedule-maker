import React from 'react';
import { DAYS } from './state.js';
import { PhotoSlot, vars } from './templates2.jsx';
import { Star, Heart, Twinkle, Moon, Pin, Paw, starField } from './decor.jsx';

const isOff = (t) => /^(off|offline|휴방)$/i.test((t || '').trim());
const STARS = starField(70, 1920, 1080, 11);

/* ───────── 템플릿 8 · 우드 클립보드 ───────── */
export function Template8({ data, ...p }) {
  const c = data.colors;
  const slot = { x: 70, y: 320, w: 540, h: 690 };
  return (
    <div className="canvas t8" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t8-vignette" />
      <div className="t8-sign">
        <div className="t8-title">{data.title}</div>
        <i className="nail l" /><i className="nail r" />
      </div>
      <div className="t8-badge">{data.badge}</div>
      <Star x={600} y={70} s={64} r={14} />
      <div className="t8-board"><i className="screw a" /><i className="screw b" /></div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={14}>
        <div className="t8-paperframe" />
        <div className="t8-clip"><i /></div>
        <div className="t8-sns">{data.sns}</div>
      </PhotoSlot>
      <Paw x={560} y={940} s={64} r={16} c="rgba(90,61,46,.55)" />
      <div className="t8-rows">
        <div className="t8-rope" />
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          const col = i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'var(--accent)';
          return (
            <div className={'t8-row' + (off ? ' off' : '')} key={i} style={{ marginLeft: i % 2 ? 24 : 0 }}>
              <div className="t8-date" style={i >= 5 && !off ? { background: `linear-gradient(180deg, color-mix(in srgb, ${col} 70%, #fff), ${col})` } : undefined}>{r.date}</div>
              <div className="t8-bar">
                <div className="t8-meta">
                  <small style={{ background: col }}>{DAYS[i]}</small>
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
      <div className="t9-neb a" /><div className="t9-neb b" /><div className="t9-neb c" />
      <svg className="t9-stars" width="1920" height="1080">
        {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />)}
        <polyline points="1260,50 1340,100 1420,60 1500,130" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="2" strokeDasharray="6 8" />
      </svg>
      <Moon x={1730} y={20} s={130} r={-10} />
      <div className="t9-wave top" /><div className="t9-wave bot" />
      <div className="t9-title">{data.title}</div>
      <div className="t9-badge">{data.badge}</div>
      <Twinkle x={640} y={110} s={42} c="#ffd27a" />
      <Twinkle x={1000} y={560} s={34} c="#ffd27a" />
      <div className="t9-photoframe"><i className="pin" /></div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={6} />
      <div className="t9-sticky">{data.sns}</div>
      <Star x={520} y={820} s={60} r={14} />
      <div className="t9-cards">
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          const [cx, cy] = pos[i];
          return (
            <div className={'t9-card' + (off ? ' off' : '')} key={i} style={{ left: 700 + cx * 400, top: 85 + cy * 315 }}>
              <div className="t9-ribbon">{r.date}</div>
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
  const slot = { x: 68, y: 250, w: 560, h: 600 };
  return (
    <div className="canvas t10" style={{ width: 1920, height: 1080, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t10-map m1" /><div className="t10-map m2" />
      <svg className="t10-route" width="1920" height="1080" viewBox="0 0 1920 1080">
        <path d="M730 935 C 800 1040 900 1040 1000 1010 S 1300 1030 1900 1040" fill="none" stroke="var(--accent)" strokeWidth="5" strokeDasharray="4 14" strokeLinecap="round" opacity=".7" />
      </svg>
      <Pin x={700} y={870} s={62} />
      <div className="t10-weekly"><small>WEEKLY NO.</small>{data.badge}</div>
      <div className="t10-title">{data.title}</div>
      <div className="t10-barcode" />
      <div className="t10-stamp"><i className="h t" /><i className="h b" /><i className="v l" /><i className="v r" /></div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={3} />
      <svg className="t10-postmark" width="260" height="260" viewBox="0 0 260 260">
        <defs><path id="pm" d="M130 130 m-92 0 a92 92 0 1 1 184 0 a92 92 0 1 1 -184 0" /></defs>
        <circle cx="130" cy="130" r="118" fill="none" stroke="var(--text)" strokeWidth="5" />
        <circle cx="130" cy="130" r="84" fill="none" stroke="var(--text)" strokeWidth="3" />
        <text fontFamily="Montserrat" fontWeight="800" fontSize="24" letterSpacing="5" fill="var(--text)"><textPath href="#pm" startOffset="0">WEEKLY SCHEDULE · STREAM ·</textPath></text>
        <text x="130" y="140" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="30" fill="var(--text)">LIVE</text>
      </svg>
      <div className="t10-art">{data.sns}</div>
      <div className="t10-rows">
        {data.rows.map((r, i) => {
          const off = isOff(r.time);
          return (
            <div className="t10-row" key={i}>
              <div className="t10-ic"><b>{r.date}</b><small>{DAYS[i]}</small></div>
              <div className="t10-bar" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${off ? 'var(--accent)' : 'var(--sat)'} 80%, #fff), ${off ? 'var(--accent)' : 'var(--sat)'})` }}>{r.text}</div>
              <div className="t10-ticket" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${off ? 'var(--sat)' : 'var(--accent)'} 80%, #fff), ${off ? 'var(--sat)' : 'var(--accent)'})` }}>{off ? 'OFF LINE' : r.time}</div>
            </div>
          );
        })}
      </div>
      <Heart x={1840} y={26} s={50} r={14} c1="#ffd0b0" c2="#e8935a" />
    </div>
  );
}

export const SLOT_COMPONENTS_3 = { 8: Template8, 9: Template9, 10: Template10 };
