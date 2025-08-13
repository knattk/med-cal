'use client';
import { cls } from '../lib/utils.js';

export default function InputField({ field, value, onChange }) {
  const common = {
    id: field.key,
    value: value ?? '',
    onChange: (e) => onChange(field.key, e.target.value),
    className: 'w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20',
  };
  if (field.type === 'select') {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={field.key} className="text-sm text-gray-700">{field.label}</label>
        <select {...common}>
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.key} className="text-sm text-gray-700">
        {field.label}
      </label>
      <input
        type={field.type || 'text'}
        inputMode={field.type === 'number' ? 'decimal' : undefined}
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        {...common}
      />
    </div>
  );
}
