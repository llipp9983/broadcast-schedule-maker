import React, { useId } from 'react';

const abs = (x, y, s, r, extra = {}) => ({
  position: 'absolute', left: x, top: y, width: s, height: s,
  transform: r ? `rotate(${r}deg)` : undefined, pointerEvents: 'none', overflow: 'visible', ...extra,
});
const useGid = () => 'g' + useId().replace(/[^a-zA-Z0-9]/g, '');

/** 둥근 5각 별 (그라데이션 + 흰 테두리 + 하이라이트) */
export function Star({ x, y, s = 60, r = 0, c1 = '#ffe98a', c2 = '#ffb21f', stroke = '#fff' }) {
  const id = useGid();
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 4px 5px rgba(0,0,0,.28))' })} viewBox="0 0 100 100">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
      <path d="M50 8 L62 36 L92 38 L69 58 L77 88 L50 72 L23 88 L31 58 L8 38 L38 36 Z" fill={`url(#${id})`} stroke={stroke} strokeWidth="7" strokeLinejoin="round" />
      <path d="M42 30 L50 20" stroke="#fff" strokeOpacity=".85" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** 광택 하트 */
export function Heart({ x, y, s = 60, r = 0, c1 = '#ff9fc6', c2 = '#ff4f93', stroke = '#fff' }) {
  const id = useGid();
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 5px 6px rgba(0,0,0,.25))' })} viewBox="0 0 100 100">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
      <path d="M50 90 C8 62 2 32 22 18 C37 8 50 18 50 30 C50 18 63 8 78 18 C98 32 92 62 50 90Z" fill={`url(#${id})`} stroke={stroke} strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx="29" cy="30" rx="9" ry="5.5" fill="#fff" fillOpacity=".8" transform="rotate(-35 29 30)" />
      <circle cx="40" cy="22" r="3" fill="#fff" fillOpacity=".8" />
    </svg>
  );
}

/** 몽실몽실 구름 */
export function Cloud({ x, y, s = 200, c1 = '#ffffff', c2 = '#dff2ff', o = 1 }) {
  const id = useGid();
  return (
    <svg style={{ ...abs(x, y, s, 0, { height: s * 0.62 }), opacity: o, filter: 'drop-shadow(0 8px 10px rgba(60,120,180,.18))' }} viewBox="0 0 160 100">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
      <path d="M36 92 C10 92 4 62 28 56 C26 34 56 22 72 40 C82 18 118 22 122 48 C148 46 156 90 126 92 Z" fill={`url(#${id})`} />
      <path d="M44 40 C52 30 62 30 68 36" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".9" />
    </svg>
  );
}

/** 고양이 발바닥 */
export function Paw({ x, y, s = 60, r = 0, c = '#ff8fbf' }) {
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.2))' })} viewBox="0 0 100 100" fill={c}>
      <ellipse cx="50" cy="66" rx="24" ry="19" />
      <ellipse cx="22" cy="40" rx="9" ry="12" transform="rotate(-18 22 40)" />
      <ellipse cx="40" cy="26" rx="9" ry="13" transform="rotate(-6 40 26)" />
      <ellipse cx="60" cy="26" rx="9" ry="13" transform="rotate(6 60 26)" />
      <ellipse cx="78" cy="40" rx="9" ry="12" transform="rotate(18 78 40)" />
    </svg>
  );
}

/** 고양이 귀 (프레임 위에 얹기) */
export function Ears({ x, y, w, h = 120, fill = '#ff6fae', inner = '#ffd3e6', edge = '#fff' }) {
  return (
    <svg style={{ position: 'absolute', left: x, top: y, width: w, height: h, pointerEvents: 'none', overflow: 'visible', filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.25))' }} viewBox="0 0 400 120" preserveAspectRatio="none">
      <path d="M34 120 C34 70 40 30 62 10 C100 22 150 62 178 118 Z" fill={fill} stroke={edge} strokeWidth="12" strokeLinejoin="round" />
      <path d="M366 120 C366 70 360 30 338 10 C300 22 250 62 222 118 Z" fill={fill} stroke={edge} strokeWidth="12" strokeLinejoin="round" />
      <path d="M70 108 C70 78 74 54 84 42 C108 54 128 78 144 108 Z" fill={inner} />
      <path d="M330 108 C330 78 326 54 316 42 C292 54 272 78 256 108 Z" fill={inner} />
    </svg>
  );
}

/** 꽃 */
export function Flower({ x, y, s = 60, r = 0, c = '#ffb3d1', center = '#ffe27a' }) {
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.18))' })} viewBox="0 0 100 100">
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="50" cy="26" rx="15" ry="22" fill={c} stroke="#fff" strokeWidth="4" transform={`rotate(${a} 50 50)`} />)}
      <circle cx="50" cy="50" r="13" fill={center} stroke="#fff" strokeWidth="4" />
    </svg>
  );
}

/** 번개 */
export function Bolt({ x, y, s = 60, r = 0, c1 = '#d9c8ff', c2 = '#a98af5' }) {
  const id = useGid();
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 4px 4px rgba(0,0,0,.2))' })} viewBox="0 0 100 100">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
      <path d="M58 4 L20 56 H46 L38 96 L80 40 H54 Z" fill={`url(#${id})`} stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}

/** 반짝이(4각 별) — 글로우 */
export function Twinkle({ x, y, s = 40, r = 0, c = '#fff' }) {
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 0 8px rgba(255,255,255,.95))' })} viewBox="0 0 24 24">
      <path fill={c} d="M12 0 C12.8 8 16 11.2 24 12 C16 12.8 12.8 16 12 24 C11.2 16 8 12.8 0 12 C8 11.2 11.2 8 12 0Z" />
    </svg>
  );
}

/** 초승달 */
export function Moon({ x, y, s = 120, r = 0 }) {
  const id = useGid();
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 0 22px rgba(255,226,140,.65))' })} viewBox="0 0 100 100">
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6c9" /><stop offset="1" stopColor="#ffc94d" /></linearGradient></defs>
      <path d="M62 8 A42 42 0 1 0 92 66 A34 34 0 1 1 62 8 Z" fill={`url(#${id})`} />
    </svg>
  );
}

/** 지도 핀 */
export function Pin({ x, y, s = 60, r = 0, c = '#e8935a' }) {
  return (
    <svg style={abs(x, y, s, r, { filter: 'drop-shadow(0 4px 4px rgba(0,0,0,.25))' })} viewBox="0 0 100 100">
      <path d="M50 94 C26 62 18 52 18 38 A32 32 0 1 1 82 38 C82 52 74 62 50 94Z" fill={c} stroke="#fff" strokeWidth="6" />
      <circle cx="50" cy="38" r="12" fill="#fff" />
    </svg>
  );
}

/** 결정적(고정) 난수 별 필드 */
export function starField(n, w, h, seed = 7) {
  let a = seed;
  const rnd = () => ((a = (a * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => ({ x: rnd() * w, y: rnd() * h, r: 1.2 + rnd() * 3.2, o: 0.3 + rnd() * 0.7 }));
}
