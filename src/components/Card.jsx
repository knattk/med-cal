'use client';
import { cls } from '../lib/utils.js';

export default function Card({ children, actions, title, subtitle, isFav, onToggleFav }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-base font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
            onClick={onToggleFav}
            className={cls(
              'rounded-full px-3 py-1 text-xs border',
              isFav ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-gray-300'
            )}
          >
            {isFav ? '★ Saved' : '☆ Save'}
          </button>
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}
