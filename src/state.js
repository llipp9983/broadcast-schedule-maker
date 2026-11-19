export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const DAYS_KO = ['월', '화', '수', '목', '금', '토', '일'];

export const defaultState = () => ({
  template: 1,
  t1: {
    period: '2025.05.05 ~ 2025.05.11',
    rows: DAYS.map((_, i) => ({ title: i === 6 ? '휴방' : '방송 제목', desc: i === 6 ? '푹 쉬는 날' : '방송 설명을 입력하세요', time: i === 6 ? 'OFF' : '20:00' })),
    colors: { bg: '#6a3fd6', panel: '#8e6bf0', accent: '#ffe066', text: '#ffffff', sat: '#8ec5ff', sun: '#ff8a8a' },
  },
  t2: {
    sns: '@my_streamer_id',
    badge: '09.16 ~ 09.22',
    rows: DAYS.map((_, i) => ({ text: i === 6 ? '휴방' : '방송 내용', time: i === 6 ? 'OFF' : '20:00' })),
    colors: { bg: '#8fd3f4', panel: '#ffffff', accent: '#3a9ad9', text: '#2b4a63', sat: '#2f7be5', sun: '#e5484d' },
    photo: null, // {src, x, y, w, h}
  },
});

const KEY = 'bsm-state-v1';
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    const d = defaultState();
    return { ...d, ...s, t1: { ...d.t1, ...s.t1, colors: { ...d.t1.colors, ...(s.t1 || {}).colors } }, t2: { ...d.t2, ...s.t2, colors: { ...d.t2.colors, ...(s.t2 || {}).colors } } };
  } catch { return defaultState(); }
}
export function saveState(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); }
  catch { try { localStorage.setItem(KEY, JSON.stringify({ ...s, t2: { ...s.t2, photo: null } })); } catch {} }
}
