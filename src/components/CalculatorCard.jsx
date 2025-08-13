'use client';
import { useEffect, useState } from 'react';
import InputField from './InputField.jsx';
import SectionTitle from './SectionTitle.jsx';
import ResultRow from './ResultRow.jsx';
import Card from './Card.jsx';
import { round, copyToClipboard } from '../lib/utils.js';

export default function CalculatorCard({ def, values, setValues, favorites, setFavorites, last, setLast }) {
  const [results, setResults] = useState({});
  const [showFormula, setShowFormula] = useState(false);

  useEffect(() => {
    const out = def.compute(values || {});
    setResults(out || {});
    const hasValid = out && Object.values(out).some((v) => v !== null && v !== undefined && v !== '');
    if (hasValid) {
      setLast({ results: out, at: Date.now(), inputs: values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  const isFav = favorites.includes(def.id);
  const toggleFav = () => {
    setFavorites((prev) => (isFav ? prev.filter((x) => x !== def.id) : [...prev, def.id]));
  };

  const copyResult = async () => {
    const lines = Object.entries(results)
      .map(([k, v]) => `${k}: ${typeof v === 'number' ? round(v, 2) : v}`)
      .join('\n');
    const text = `${def.name}\n${lines}`;
    const ok = await copyToClipboard(text);
    alert(ok ? 'Copied results to clipboard' : 'Copy failed – your browser may block clipboard access.');
  };

  const fmtTime = (t) => new Date(t).toLocaleString();

  return (
    <Card
      title={def.name}
      subtitle={def.refs?.[0]}
      isFav={isFav}
      onToggleFav={toggleFav}
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setShowFormula((s) => !s)}
            className="rounded-full px-3 py-1 text-xs border bg-white border-gray-300"
          >
            {showFormula ? 'ซ่อนสูตร' : 'สูตร/ที่มา'}
          </button>
          <button onClick={copyResult} className="rounded-full px-3 py-1 text-xs border bg-white border-gray-300">
            Copy
          </button>
        </div>
      }
    >
      {showFormula && (
        <div className="mb-3 text-[13px] text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="font-medium mb-1">สูตรคำนวณ</div>
          <div className="whitespace-pre-wrap leading-snug">{(def.formula || def.refs?.join('\n'))}</div>
          {def.notes && <div className="mt-2 text-[12px] text-gray-500">หมายเหตุ: {def.notes}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {def.fields.map((f) => (
          <InputField key={f.key} field={f} value={values?.[f.key]} onChange={(k, v) => setValues((prev) => ({ ...prev, [k]: v }))} />
        ))}
      </div>

      <div className="mt-4 border-t pt-3">
        <SectionTitle>ผลลัพธ์ (คำนวณจากอินพุตปัจจุบัน)</SectionTitle>
        <div className="flex flex-col gap-1">
          {Object.keys(results || {}).length === 0 && (
            <div className="text-sm text-gray-500">กรอกข้อมูลเพื่อคำนวณ</div>
          )}
          {Object.entries(results || {}).map(([k, v]) => (
            <ResultRow key={k} label={k} value={typeof v === 'number' ? round(v, 2) : v} />
          ))}
        </div>
      </div>

      {last && (
        <div className="mt-3 border-t pt-3">
          <SectionTitle>ผลล่าสุด (บันทึกอัตโนมัติ)</SectionTitle>
          <div className="text-[11px] text-gray-500 mb-1">บันทึกเมื่อ {fmtTime(last.at)}</div>
          <div className="flex flex-col gap-1">
            {Object.entries(last.results || {}).map(([k, v]) => (
              <ResultRow key={k} label={k} value={typeof v === 'number' ? round(v, 2) : v} />
            ))}
          </div>
        </div>
      )}

      {def.refs?.length ? (
        <div className="mt-3 text-[11px] text-gray-500 leading-snug">
          {def.refs.join(' • ')}
        </div>
      ) : null}
    </Card>
  );
}
