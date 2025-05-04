import { safe } from './calcUtils';

export default function parseValues(rows) {
  if (!rows || rows.length < 2) return {};

  const headers = rows[0];

  const actualIdx = headers.findIndex(h => h === 'Actuals');
  const priorIdx  = headers.findIndex(h => h === 'Prior Year');
  const planIdx   = headers.findIndex(h => h === 'Plan');
  if (actualIdx === -1) {
    console.warn('⚠️ Колонка "Actuals" не найдена — парсинг невозможен');
    return {};
  }

  const values = {};

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const label = (row?.[0] || '').toString().trim();
    if (label === 'Net Sales') {
      console.log('🧠 Net Sales Row:', row);
      console.log('🔢 row[priorIdx]:', row[priorIdx]);
    }
    if (!label) continue;

    if (row.length > actualIdx) values[label] = safe(row[actualIdx]);
    if (priorIdx !== -1 && row.length > priorIdx) values[`Prior ${label}`] = safe(row[priorIdx]);
    if (planIdx  !== -1 && row.length > planIdx)  values[`Plan ${label}`]  = safe(row[planIdx]);
  }

  return values;
}
