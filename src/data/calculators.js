export const CALCULATORS = [
  {
    id: 'map',
    name: 'Mean Arterial Pressure (MAP)',
    category: 'Cardio',
    fields: [
      { key: 'sbp', label: 'SBP (mmHg)', type: 'number', min: 0, step: 1 },
      { key: 'dbp', label: 'DBP (mmHg)', type: 'number', min: 0, step: 1 },
    ],
    compute: ({ sbp, dbp }) => {
      if (!sbp && sbp !== 0) return { MAP: null };
      if (!dbp && dbp !== 0) return { MAP: null };
      const MAP = (Number(sbp) + 2 * Number(dbp)) / 3;
      const status = MAP < 65 ? '\u26A0\uFE0F Low perfusion risk (<65)' : '\u2705 Adequate (\u226565)';
      return { MAP, status };
    },
    formula: 'MAP = (SBP + 2×DBP) / 3',
    refs: ['Common approximation for MAP in sinus rhythm'],
    notes: 'ใช้กับ regular rhythm; ภาวะชีพจรไม่สม่ำเสมอควรวัดซ้ำหลายครั้งและใช้ค่าเฉลี่ย'
  },
  {
    id: 'shockIndex',
    name: 'Shock Index',
    category: 'Cardio',
    fields: [
      { key: 'hr', label: 'HR (bpm)', type: 'number', min: 0, step: 1 },
      { key: 'sbp', label: 'SBP (mmHg)', type: 'number', min: 0, step: 1 },
    ],
    compute: ({ hr, sbp }) => {
      if (!hr || !sbp) return { SI: null };
      const SI = Number(hr) / Number(sbp);
      const status = SI >= 0.9 ? '\u26A0\uFE0F Elevated (\u22650.9)' : '\u2705 Normal';
      return { SI, status };
    },
    formula: 'SI = HR / SBP',
    refs: ['Shock Index utility in triage'],
  },
  {
    id: 'crcl',
    name: 'Creatinine Clearance (Cockcroft–Gault)',
    category: 'Renal/Fluid',
    fields: [
      { key: 'age', label: 'Age (years)', type: 'number', min: 1, step: 1 },
      { key: 'weight', label: 'Weight (kg)', type: 'number', min: 1, step: 0.1 },
      { key: 'scr', label: 'Serum Cr (mg/dL)', type: 'number', min: 0, step: 0.01 },
      { key: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female'] },
    ],
    compute: ({ age, weight, scr, sex }) => {
      if (!age || !weight || !scr || !sex) return { CrCl: null };
      const base = ((140 - Number(age)) * Number(weight)) / (72 * Number(scr));
      const CrCl = sex === 'Female' ? base * 0.85 : base;
      return { CrCl };
    },
    formula: 'CrCl = ((140 − age) × weight) / (72 × SCr); ×0.85 if female',
    refs: ['Cockcroft–Gault (1976)'],
    notes: 'โดยทั่วไปใช้ actual body weight; ผู้ป่วยอ้วนมากพิจารณา Adjusted BW ตามแนวทางของยา'
  },
  {
    id: 'anionGap',
    name: 'Anion Gap (+ Albumin-corrected)',
    category: 'Renal/Fluid',
    fields: [
      { key: 'na', label: 'Na (mEq/L)', type: 'number', min: 50, max: 200, step: 1 },
      { key: 'cl', label: 'Cl (mEq/L)', type: 'number', min: 50, max: 200, step: 1 },
      { key: 'hco3', label: 'HCO₃⁻ (mEq/L)', type: 'number', min: 0, max: 60, step: 1 },
      { key: 'alb', label: 'Albumin (g/dL, optional)', type: 'number', min: 0, max: 6, step: 0.1 },
    ],
    compute: ({ na, cl, hco3, alb }) => {
      if (!na && na !== 0) return { AG: null };
      if (!cl && cl !== 0) return { AG: null };
      if (!hco3 && hco3 !== 0) return { AG: null };
      const AG = Number(na) - (Number(cl) + Number(hco3));
      const AGcorr = alb ? AG + 2.5 * (4 - Number(alb)) : null;
      return { AG, AGcorr };
    },
    formula: 'AG = Na − (Cl + HCO₃⁻)\nAG(corrected) = AG + 2.5 × (4 − albumin)',
    refs: ['Traditional AG calculation; albumin correction 2.5 per 1 g/dL'],
  },
  {
    id: 'corrCalcium',
    name: 'Corrected Calcium',
    category: 'Renal/Fluid',
    fields: [
      { key: 'ca', label: 'Total Ca (mg/dL)', type: 'number', min: 0, step: 0.1 },
      { key: 'alb', label: 'Albumin (g/dL)', type: 'number', min: 0, step: 0.1 },
    ],
    compute: ({ ca, alb }) => {
      if (!ca || !alb) return { CaCorrected: null };
      const CaCorrected = Number(ca) + 0.8 * (4 - Number(alb));
      return { CaCorrected };
    },
    formula: 'Ca(corrected) = Ca + 0.8 × (4 − albumin)',
    refs: ['Payne formula'],
  },
  {
    id: 'bmi',
    name: 'Body Mass Index (BMI)',
    category: 'General',
    fields: [
      { key: 'height', label: 'Height (cm)', type: 'number', min: 50, max: 260, step: 0.1 },
      { key: 'weight', label: 'Weight (kg)', type: 'number', min: 1, max: 500, step: 0.1 },
    ],
    compute: ({ height, weight }) => {
      if (!height || !weight) return { BMI: null };
      const m = Number(height) / 100;
      const BMI = Number(weight) / (m * m);
      let cat = '';
      if (BMI < 18.5) cat = 'Underweight';
      else if (BMI < 25) cat = 'Normal';
      else if (BMI < 30) cat = 'Overweight';
      else cat = 'Obesity';
      return { BMI, category: cat };
    },
    formula: 'BMI = weight / height² (kg/m²)',
    refs: ['WHO BMI categories'],
  },
  {
    id: 'bsa',
    name: 'Body Surface Area (Mosteller)',
    category: 'General',
    fields: [
      { key: 'height', label: 'Height (cm)', type: 'number', min: 50, max: 260, step: 0.1 },
      { key: 'weight', label: 'Weight (kg)', type: 'number', min: 1, max: 500, step: 0.1 },
    ],
    compute: ({ height, weight }) => {
      if (!height || !weight) return { BSA: null };
      const BSA = Math.sqrt((Number(height) * Number(weight)) / 3600);
      return { BSA };
    },
    formula: 'BSA = \u221A((height(cm) × weight(kg)) / 3600)',
    refs: ['Mosteller 1987'],
  },
  {
    id: 'pfratio',
    name: 'P/F Ratio',
    category: 'ICU/Resp',
    fields: [
      { key: 'pao2', label: 'PaO₂ (mmHg)', type: 'number', min: 0, step: 1 },
      { key: 'fio2', label: 'FiO₂ (% or fraction)', type: 'text', placeholder: 'e.g. 40 or 0.4' },
    ],
    compute: ({ pao2, fio2 }) => {
      if (!pao2 || !fio2) return { PFratio: null };
      let f = String(fio2).trim();
      let frac = parseFloat(f);
      if (Number.isNaN(frac)) return { PFratio: null };
      if (frac > 1.2) frac = frac / 100;
      if (frac <= 0) return { PFratio: null };
      const PFratio = Number(pao2) / frac;
      let sev = '';
      if (PFratio < 100) sev = 'Severe';
      else if (PFratio < 200) sev = 'Moderate';
      else if (PFratio < 300) sev = 'Mild';
      else sev = 'Normal';
      return { PFratio, severity: sev };
    },
    formula: 'P/F = PaO₂ / FiO₂ (FiO₂ เป็นสัดส่วน 0–1)',
    refs: ['Berlin ARDS categories for P/F'],
  },
  {
    id: 'fwd',
    name: 'Free Water Deficit',
    category: 'Renal/Fluid',
    fields: [
      { key: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female'] },
      { key: 'weight', label: 'Weight (kg)', type: 'number', min: 1, step: 0.1 },
      { key: 'na', label: 'Na (mEq/L)', type: 'number', min: 100, max: 200, step: 1 },
    ],
    compute: ({ sex, weight, na }) => {
      if (!sex || !weight || !na) return { DeficitL: null };
      const coef = sex === 'Male' ? 0.6 : 0.5;
      const TBW = coef * Number(weight);
      const DeficitL = TBW * (Number(na) / 140 - 1);
      return { TBW, DeficitL };
    },
    formula: 'TBW ≈ 0.6(M) / 0.5(F) × weight;\nDeficit = TBW × ((Na/140) − 1)',
    refs: ['Traditional hypernatremia water deficit estimate'],
  },
];
