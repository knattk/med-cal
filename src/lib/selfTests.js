import { CALCULATORS } from '../data/calculators.js';

export function runSelfTests() {
  try {
    const find = (id) => CALCULATORS.find((c) => c.id === id);
    const approx = (a, b, tol = 1e-2) => Math.abs(a - b) <= tol;

    {
      const out = find('map').compute({ sbp: 120, dbp: 80 });
      if (!approx(out.MAP, 93.3333)) throw new Error('MAP test failed');
    }

    {
      const out = find('shockIndex').compute({ hr: 90, sbp: 120 });
      if (!approx(out.SI, 0.75)) throw new Error('Shock Index value wrong');
      if (out.status !== '\u2705 Normal') throw new Error('Shock Index status wrong');
    }

    {
      const out = find('crcl').compute({ age: 40, weight: 70, scr: 1.0, sex: 'Male' });
      if (!approx(out.CrCl, 97.22, 0.2)) throw new Error('CrCl test failed');
    }

    {
      const out = find('anionGap').compute({ na: 140, cl: 100, hco3: 24 });
      if (!approx(out.AG, 16)) throw new Error('Anion gap test failed');
    }

    {
      const out = find('pfratio').compute({ pao2: 80, fio2: 0.4 });
      if (!approx(out.PFratio, 200)) throw new Error('P/F value failed');
      if (out.severity !== 'Mild') throw new Error('P/F severity mapping failed');
    }

    {
      const out = find('bmi').compute({ height: 180, weight: 81 });
      if (!approx(out.BMI, 25, 0.05)) throw new Error('BMI value failed');
      if (out.category !== 'Overweight') throw new Error('BMI category failed');
    }

    {
      const out = find('bsa').compute({ height: 170, weight: 65 });
      if (!approx(out.BSA, 1.73, 0.03)) throw new Error('BSA value failed');
    }

    console.info('MedCalc self-tests: all passed ✅');
  } catch (e) {
    console.warn('MedCalc self-tests: failed ❌', e);
    process.exitCode = 1;
  }
}
