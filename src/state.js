export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const DAYS_KO = ['월', '화', '수', '목', '금', '토', '일'];

// 템플릿 목록 (id -> 이름). 3~7은 "사진 슬롯" 계열
export const TEMPLATES = [
  { id: 1, name: '고정형', sub: '보라 정사각형' },
  { id: 2, name: '사진 배경형', sub: '하늘색 16:9' },
  { id: 3, name: '큐티 핑크', sub: '핑크 · 체크' },
  { id: 4, name: '스카이 클라우드', sub: '하늘색 · 구름' },
  { id: 5, name: '라벤더 폴라로이드', sub: '연보라 · 폴라로이드' },
  { id: 6, name: '하트 프레임', sub: '보라 · 하트' },
  { id: 7, name: '노트 다이어리', sub: '크림 · 노트' },
  { id: 8, name: '우드 클립보드', sub: '나무 · 날짜 탭', dates: true, labels: { sat: '토요일 포인트색' } },
  { id: 9, name: '나이트 카드', sub: '어두운 보라 · 카드', dates: true, labels: { sat: '휴방 카드색' } },
  { id: 10, name: '스탬프 티켓', sub: '여행 · 우표', dates: true, labels: { sat: '보조색(파랑)' } },
  { id: 11, name: '블루 심플 카드', sub: '작은 표 · 하트', single: true, noPhoto: true },
  { id: 12, name: '사이버 HUD', sub: '네온 · 게임 화면', labels: { sat: '(사용 안 함)', sun: '휴방 태그색' } },
  { id: 13, name: '내 배경 자유형', sub: '내 이미지 위에 시간표', custom: true },
];

// 사진 슬롯 크기 (템플릿 안에서 사진이 보이는 영역)
export const SLOTS = {
  2: { w: 1100, h: 1080 },
  3: { w: 760, h: 900 },
  4: { w: 600, h: 650 },
  5: { w: 470, h: 520 },
  6: { w: 720, h: 660 },
  7: { w: 560, h: 560 },
  8: { w: 540, h: 700 },
  9: { w: 520, h: 600 },
  10: { w: 560, h: 600 },
  12: { w: 580, h: 640 },
  13: { w: 1920, h: 1080 },
};

const slotRows = (offText = '휴방') => DAYS.map((_, i) => ({ date: String(4 + i).padStart(2, '0'), text: i === 6 ? offText : '방송 내용을 입력하세요', time: i === 6 ? 'OFF' : '20:00' }));
const slotTpl = (title, colors, extra = {}) => ({ title, sns: '@my_streamer_id', badge: '11.10 ~ 11.16', rows: slotRows(), colors, photo: null, ...extra });

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
    photo: null,
  },
  t3: slotTpl('MY SCHEDULE', { bg: '#34343c', panel: '#ffe3f0', accent: '#ff6fae', text: '#7a2a55', sat: '#4f7bff', sun: '#ff3b5c' }),
  t4: slotTpl('SCHEDULE', { bg: '#bfe6ff', panel: '#ffffff', accent: '#2aa4f0', text: '#1c5a86', sat: '#2f7be5', sun: '#e5484d' }),
  t5: slotTpl('SCHEDULE', { bg: '#e9dcff', panel: '#ffffff', accent: '#9a7be0', text: '#5a4690', sat: '#4f7bff', sun: '#ff5c7a' }),
  t6: slotTpl('SCHEDULE', { bg: '#e6defc', panel: '#f6f2ff', accent: '#8b6fe0', text: '#5a4690', sat: '#4f7bff', sun: '#ff5c7a' }),
  t8: slotTpl('WEEKLY SCHEDULE', { bg: '#dcb893', panel: '#ffffff', accent: '#8a6a55', text: '#5a3d2e', sat: '#2f7be5', sun: '#e5484d' }),
  t9: slotTpl('WEEKLY SCHEDULE', { bg: '#3a2f5c', panel: '#ffe6d1', accent: '#f08a24', text: '#7a3d10', sat: '#c9c3dd', sun: '#e5484d' }),
  t10: slotTpl('SCHEDULE', { bg: '#e9eef5', panel: '#ffffff', accent: '#e8935a', text: '#3a2f2a', sat: '#6f8fd0', sun: '#e5484d' }),
  t11: slotTpl('방송 스케줄표', { bg: '#cdeaff', panel: '#ffffff', accent: '#2f9bd8', text: '#2b3b4a', sat: '#2f7be5', sun: '#e5484d' }),
  t12: slotTpl('STREAMER', { bg: '#04101f', panel: '#0a2a4a', accent: '#2fd6ff', text: '#ffffff', sat: '#ffd23f', sun: '#ff5a6e' }, { caption: 'FAN ART', rows: slotRows().map((r, i) => ({ ...r, icon: ['game', 'chat', 'game', 'music', 'chat', 'game', 'none'][i] })) }),
  t13: slotTpl('WEEKLY SCHEDULE', { bg: '#8fd3f4', panel: '#ffffff', accent: '#3a7bd9', text: '#26324a', sat: '#2f7be5', sun: '#e5484d' }, { layout: { style: 'glass', mode: 'list', side: 'right', vpos: 'bottom', opacity: 78, scale: 100, dim: 20 } }),
  t7: slotTpl('주간 스케줄', { bg: '#fdf6f0', panel: '#ffffff', accent: '#b9a6f2', text: '#5a4690', sat: '#4f7bff', sun: '#ff5c7a' }),
});

const KEY = 'bsm-state-v1';
export function loadState() {
  const d = defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return d;
    return mergeState(d, JSON.parse(raw));
  } catch { return d; }
}
export function mergeState(d, s) {
  const out = { ...d, template: s.template || 1 };
  for (const k of Object.keys(d)) {
    if (k === 'template') continue;
    if (s[k]) out[k] = { ...d[k], ...s[k], colors: { ...d[k].colors, ...(s[k].colors || {}) } };
  }
  return out;
}
export function saveState(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); }
  catch {
    try {
      const c = { ...s };
      for (const k of Object.keys(c)) if (c[k] && c[k].photo) c[k] = { ...c[k], photo: null };
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {}
  }
}
