'use client';
import { cls } from '../lib/utils.js';

export default function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        'px-3 py-1 rounded-full text-sm border',
        active ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'
      )}
    >
      {children}
    </button>
  );
}
