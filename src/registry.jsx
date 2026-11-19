import React, { memo, useEffect, useRef, useState } from 'react';
import { Template1, Template2 } from './templates.jsx';
import { SLOT_COMPONENTS } from './templates2.jsx';
import { SLOT_COMPONENTS_3 } from './templates3.jsx';
import { SLOT_COMPONENTS_4 } from './templates4.jsx';
import { SLOT_COMPONENTS_5 } from './templates5.jsx';
import { defaultState } from './state.js';

const SLOT = { ...SLOT_COMPONENTS, ...SLOT_COMPONENTS_3, ...SLOT_COMPONENTS_4, ...SLOT_COMPONENTS_5 };
export const sizeOf = (id) => (id === 1 ? { w: 1080, h: 1080 } : id === 11 ? { w: 1080, h: 1000 } : id === 14 || id === 15 ? { w: 1606, h: 1200 } : { w: 1920, h: 1080 });

export function renderTemplate(id, data, common) {
  if (id === 1) return <Template1 data={data} />;
  if (id === 2) return <Template2 data={data} {...common} />;
  const C = SLOT[id];
  return <C data={data} {...common} />;
}

const noop = () => {};
const SAMPLE = defaultState();
const THUMB_H = 84;

/** 갤러리용 작은 미리보기 (기본 샘플 데이터, 한 번만 렌더) */
export const TemplateThumb = memo(function TemplateThumb({ id }) {
  const sz = sizeOf(id);
  const k = THUMB_H / sz.h;
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  // 화면에 보일 때만 그린다 (시작이 빨라짐)
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setOn(true); return undefined; }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '240px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="ui-thumb-box" style={{ width: sz.w * k, height: THUMB_H }}>
      {on && (
        <div style={{ width: sz.w, height: sz.h, transform: `scale(${k})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
          {renderTemplate(id, SAMPLE['t' + id], { scale: 1, onPhoto: noop, selected: false, setSelected: noop })}
        </div>
      )}
    </div>
  );
});
