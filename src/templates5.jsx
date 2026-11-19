import React from 'react';
import { DAYS, DAYS_KO } from './state.js';
import { PhotoSlot, vars } from './templates2.jsx';

const isOff = (t) => /^(off|offline|휴방)$/i.test((t || '').trim());
const Spark = ({ x, y, s = 38, c = '#222' }) => (
  <svg style={{ position: 'absolute', left: x, top: y, width: s, height: s, pointerEvents: 'none' }} viewBox="0 0 24 24" aria-hidden="true">
    <path fill={c} d="M12 0 C12.6 8 16 11.4 24 12 C16 12.6 12.6 16 12 24 C11.4 16 8 12.6 0 12 C8 11.4 11.4 8 12 0Z" />
  </svg>
);
const Plus = ({ x, y, s = 38, c }) => (
  <svg style={{ position: 'absolute', left: x, top: y, width: s, height: s, pointerEvents: 'none' }} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2 V22 M2 12 H22" stroke={c} strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </svg>
);

/* ───────── 템플릿 14 · 라벤더 모눈 노트 (1606x1200) ───────── */
export function Template14({ data, ...p }) {
  const c = data.colors;
  const hl = data.hl === undefined ? 0 : data.hl;
  const slot = { x: 62, y: 186, w: 960, h: 900 };
  return (
    <div className="canvas t14" style={{ width: 1606, height: 1200, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t14-stars" />
      <div className="t14-card">
        <div className="t14-head">{data.caption}</div>
        <div className="t14-line" />
      </div>
      <div className="t14-tape a" /><div className="t14-tape b" />
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={10} emptyText="+ 이미지 배치" />
      <Plus x={982} y={190} s={40} c="var(--accent)" />
      <Plus x={86} y={968} s={44} c="var(--accent)" />
      {[248, 331, 414, 498, 581, 664, 747].map((y) => <i key={y} className="t14-dot" style={{ top: y }} />)}
      <div className="t14-panel">
        <div className="t14-kicker">{data.kicker}</div>
        <div className="t14-title">{data.title}</div>
        <div className="t14-pill">{data.badge}</div>
        <div className="t14-rows">
          {data.rows.map((r, i) => {
            const off = isOff(r.time);
            const chip = i === 5 ? 'var(--sat)' : i === 6 ? 'var(--sun)' : 'color-mix(in srgb, var(--accent) 25%, #fff)';
            const ink = i === 5 ? '#6f62d6' : i === 6 ? '#d97a7a' : 'var(--accent)';
            return (
              <div className={'t14-row' + (i === hl ? ' hl' : '')} key={i}>
                <div className="t14-chip" style={{ background: chip, color: ink }}>{DAYS_KO[i]}</div>
                <div className="t14-mid">
                  <div className="t14-t">{r.title}</div>
                  <div className="t14-d">{r.desc}</div>
                </div>
                <div className={'t14-time' + (off ? ' off' : '')}>{off ? '—' : r.time}</div>
              </div>
            );
          })}
        </div>
        <div className="t14-note">{data.note}</div>
      </div>
    </div>
  );
}

/* ───────── 템플릿 15 · 모노 체커 폴라로이드 (1606x1200) ───────── */
export function Template15({ data, ...p }) {
  const c = data.colors;
  const hl = data.hl === undefined ? 0 : data.hl;
  const slot = { x: 172, y: 241, w: 780, h: 722, angle: -2.7 };
  return (
    <div className="canvas t15" style={{ width: 1606, height: 1200, ...vars(c) }} onPointerDown={() => p.setSelected(false)}>
      <div className="t15-check" />
      <div className="t15-tag a">{data.caption}</div>
      <Spark x={1002} y={112} s={40} />
      <Spark x={1136} y={156} s={34} />
      <Spark x={1572} y={112} s={40} />
      <Spark x={86} y={1070} s={32} />
      <i className="t15-dot" style={{ left: 954, top: 138 }} /><i className="t15-dot s" style={{ left: 64, top: 1098 }} />
      <div className="t15-sheet" />
      <div className="t15-card"><i /></div>
      <PhotoSlot slot={slot} photo={data.photo} {...p} radius={3} emptyText="VISUAL / PHOTO SPACE" />
      <div className="t15-tag b">{data.caption2}</div>
      <div className="t15-right">
        <div className="t15-kicker">{data.kicker}</div>
        <div className="t15-title">{data.title}</div>
        <div className="t15-date">{data.badge}</div>
        <div className="t15-rows">
          {data.rows.map((r, i) => {
            const off = isOff(r.time);
            return (
              <div className={'t15-row' + (i === hl ? ' hl' : '')} key={i}>
                <div className={'t15-chip' + (i % 2 === 0 ? ' dark' : '')}>{DAYS[i].toLowerCase()}</div>
                <div className="t15-mid">
                  <div className="t15-t">{r.title}</div>
                  <div className="t15-d">{r.desc}</div>
                </div>
                <div className="t15-time">{off ? '—' : r.time}</div>
              </div>
            );
          })}
        </div>
        <div className="t15-note">{data.note}</div>
      </div>
    </div>
  );
}

export const SLOT_COMPONENTS_5 = { 14: Template14, 15: Template15 };
