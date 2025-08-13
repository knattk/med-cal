'use client';

export default function ResultRow({ label, value, unit }) {
  return (
    <div className="flex justify-between text-sm">
      <div className="text-gray-600">{label}</div>
      <div className="font-semibold">{value}{unit ? ` ${unit}` : ''}</div>
    </div>
  );
}
