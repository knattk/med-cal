'use client';
import { useMemo, useState } from 'react';
import { CALCULATORS } from '../data/calculators.js';
import { CATEGORIES } from '../data/categories.js';
import { useLocalStorage, cls } from '../lib/utils.js';
import Chip from './Chip.jsx';
import CalculatorCard from './CalculatorCard.jsx';
import { runSelfTests } from '../lib/selfTests.js';

if (typeof window !== 'undefined') {
  runSelfTests();
}

export default function MedCalcDashboard() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [favorites, setFavorites] = useLocalStorage('medcalc.favorites', []);
  const [valuesMap, setValuesMap] = useLocalStorage('medcalc.values', {});
  const [lastResults, setLastResults] = useLocalStorage('medcalc.lastResults', {});

  const list = useMemo(() => {
    let arr = CALCULATORS;
    if (activeCat === 'Favorites') {
      arr = arr.filter((c) => favorites.includes(c.id));
    } else if (activeCat !== 'All') {
      arr = arr.filter((c) => c.category === activeCat);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [query, activeCat, favorites]);

  const resetAll = () => {
    if (!confirm('Clear all inputs and favorites?')) return;
    setValuesMap({});
    setFavorites([]);
    setLastResults({});
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-bold">MedCalc Dashboard</div>
            <div className="text-xs text-gray-500">เครื่องคิดเลขการแพทย์ – มือถือเป็นหลัก</div>
          </div>
          <button onClick={resetAll} className="text-xs rounded-full border px-3 py-1 bg-white">Reset</button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อสูตร/หมวด... (เช่น MAP, AG, BMI)"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>
        <div className="px-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max">
            {CATEGORIES.map((c) => (
              <Chip key={c.key} active={activeCat === c.key} onClick={() => setActiveCat(c.key)}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 grid grid-cols-1 gap-4 pb-28">
        {list.length === 0 ? (
          <div className="text-sm text-gray-500">ไม่พบเครื่องคิดเลขที่ตรงกับคำค้น</div>
        ) : (
          list.map((def) => (
            <CalculatorCard
              key={def.id}
              def={def}
              values={valuesMap[def.id] || {}}
              setValues={(updater) =>
                setValuesMap((prev) => ({ ...prev, [def.id]: typeof updater === 'function' ? updater(prev[def.id] || {}) : updater }))
              }
              favorites={favorites}
              setFavorites={setFavorites}
              last={lastResults[def.id]}
              setLast={(entry) => setLastResults((p) => ({ ...p, [def.id]: entry }))}
            />
          ))
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-3 text-xs">
          <button onClick={() => setActiveCat('All')} className={cls('py-3', activeCat === 'All' && 'text-black font-semibold')}>ทั้งหมด</button>
          <button onClick={() => setActiveCat('Favorites')} className={cls('py-3', activeCat === 'Favorites' && 'text-black font-semibold')}>ที่ชอบ</button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="py-3">ขึ้นบน</button>
        </div>
      </nav>
    </div>
  );
}
