import React, { memo } from 'react';
import { Template1, Template2 } from './templates.jsx';
import { SLOT_COMPONENTS } from './templates2.jsx';
import { SLOT_COMPONENTS_3 } from './templates3.jsx';
import { defaultState } from './state.js';

const SLOT = { ...SLOT_COMPONENTS, ...SLOT_COMPONENTS_3 };
export const sizeOf = (id) => (id === 1 ? { w: 1080, h: 1080 } : { w: 1920, h: 1080 });

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
  return (
    <div className="ui-thumb-box" style={{ width: sz.w * k, height: THUMB_H }}>
      <div style={{ width: sz.w, height: sz.h, transform: `scale(${k})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        {renderTemplate(id, SAMPLE['t' + id], { scale: 1, onPhoto: noop, selected: false, setSelected: noop })}
      </div>
    </div>
  );
});
