import { Card, Col, Row, Tooltip, Typography } from 'antd';
import {
  calcSSS,
  calcLabor,
  calcControllableProfit,
  calcAdjustedCP,
  calcRestaurantContribution,
  calcCashFlow,
  calcFlowThru,
  calcLaborPercent,
  calcControllableProfitPercent,
  calcCPImprovement,
  safe,
} from '../utils/calcUtils';

const { Text, Title } = Typography;

// 🔧 новая функция — ищет правильный Advertising
function getLastAdvertisingBeforeCP(rows, actualIdx) {
  const cpIndex = rows.findIndex(row => row[0] === 'Controllable Profit');
  if (cpIndex === -1) return 0;

  for (let i = cpIndex - 1; i >= 0; i--) {
    if (rowLabel(rows[i]) === 'Advertising') {
      return safe(rows[i][actualIdx]);
    }
  }
  return 0;
}

function rowLabel(row) {
  return (row?.[0] ?? '').toString().trim();
}

function Stat({ label, value, color, formula, applied }) {
  return (
    <Card style={{ height: '100%' }}>
      <Title level={5} style={{ marginBottom: 8 }}>
        {label}
      </Title>
      <Text strong style={{ fontSize: '18px', color: color || 'black' }}>
        {value}
      </Text>
      <div style={{ marginTop: 8 }}>
        <Tooltip title={applied}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formula}
          </Text>
        </Tooltip>
      </div>
    </Card>
  );
}

export default function PLCalc({ rows, values, actualIdx }) {
  const actual = safe(values['Net Sales']);
  const prior = safe(values['Prior Net Sales']);
  const plan = safe(values['Plan Net Sales']);

  const direct = safe(values['Direct Labor']);
  const mgmt = safe(values['Management Labor']);
  const tax = safe(values['Taxes and Benefits']);
  const laborTotal = calcLabor({ 'Direct Labor': direct, 'Management Labor': mgmt, 'Taxes and Benefits': tax });

  const cogs = safe(values['Cost of Goods Sold']);
  const controllables = safe(values['Total Controllables']);

  const adv = getLastAdvertisingBeforeCP(rows, actualIdx); 

  const cp = calcControllableProfit({ netSales: actual, cogs, labor: laborTotal, controllables, advertising: adv });
  const cpPrior = safe(values['Prior Controllable Profit']);
  const cpChange = calcCPImprovement(cp, cpPrior);

  const bonus = safe(values['Bonus']);
  const wc = safe(values['Workers Comp']);
  const adjCP = calcAdjustedCP(cp, bonus, wc);

  const fixed = safe(values['Total Fixed Cost']);
  const rc = calcRestaurantContribution(cp, fixed);

  const amort = safe(values['Amortization']);
  const depr = safe(values['Depreciation']);
  const cashflow = calcCashFlow(rc, amort, depr);



  const flow = calcFlowThru(cp, cpPrior, actual, prior);
  const cpPercent = calcControllableProfitPercent(cp, actual);
  const laborPercent = calcLaborPercent(laborTotal, actual);
  const sss = calcSSS(actual, prior);
  const cogsPercent = actual !== 0 ? (cogs / actual) * 100 : 0;
  const cogsColor = cogsPercent >= 30 ? 'red' : 'green';


  

console.log('📎 CP actual:', cp);
console.log('📎 CP prior raw:', values['Prior Controllable Profit']);
console.log('📎 CP prior safe:', safe(values['Prior Controllable Profit']));

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Stat
            label="Net Sales (Actual)"
            value={`$${actual.toLocaleString()}`}
            formula="Net Sales (Actual)"
            applied={`Actual Net Sales: $${actual}`}
          />
        </Col>
        <Col span={6}>
        <Stat
  label="COGS $"
  value={`$${cogs.toLocaleString()}`}
  formula="Cost of Goods Sold"
  applied={`COGS: $${cogs}`}
  />
        </Col>
        <Col span={6}>
        <Stat
  label="COGS %"
  value={`${cogsPercent.toFixed(2)}%`}
  color={cogsColor}
  formula="COGS% / Net Sales"
  applied={`$${cogs} / $${actual}`}
/>
</Col>
        <Col span={6}>
          <Stat
            label="Labor Total"
            value={`$${laborTotal.toLocaleString()}`}
            formula="Direct + Management + Taxes"
            applied={`$${direct} + $${mgmt} + $${tax}`}
          />
        </Col>
        <Col span={6}>
          <Stat
            label="Labor %"
            value={`${laborPercent.toFixed(2)}%`}
            color={laborPercent > 30 ? 'red' : 'black'}
            formula="Total Labor / Net Sales * 100"
            applied={`$${laborTotal} / $${actual}`}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Stat
            label="Controllable Profit $"
            value={`$${cp.toLocaleString()}`}
            formula="Net Sales - (COGS + Labor + Controllables + Advertising)"
            applied={`$${actual} - ($${cogs} + $${laborTotal} + $${controllables} + $${adv})`}
          />
        </Col>
        <Col span={6}>
          <Stat
            label="CP %"
            value={`${cpPercent.toFixed(2)}%`}
            formula="CP / Net Sales"
            applied={`$${cp} / $${actual}`}
          />
        </Col>
        <Col span={6}>
          <Stat
            label="Adjusted CP"
            value={`$${adjCP.toLocaleString()}`}
            formula="CP + Bonus + Workers Comp"
            applied={`$${cp} + $${bonus} + $${wc}`}
          />
        </Col>
        <Col span={6}>
          <Stat
            label="CP Improvement"
            value={`$${cpChange.toLocaleString()}`}
            color={cpChange >= 0 ? 'green' : 'red'}
            formula="CP Actual - CP Prior"
            applied={`$${cp} - $${cpPrior}`}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Stat
            label="Restaurant Contribution"
            value={`$${rc.toLocaleString()}`}
            formula="CP - Fixed Cost"
            applied={`$${cp} - $${fixed}`}
          />
        </Col>
        <Col span={6}>
          <Stat
            label="Cash Flow"
            value={`$${cashflow.toLocaleString()}`}
            formula="RC + Amortization + Depreciation"
            applied={`$${rc} + $${amort} + $${depr}`}
          />
        </Col>
        <Col span={6}>
          <Stat
            label="Flow Thru %"
            value={`${flow.toFixed(2)}%`}
            formula="(CP Actual - CP Prior) / (Net Sales Actual - Net Sales Prior)"
            applied={`($${cp} - $${cpPrior}) / ($${actual} - $${prior})`}
          />
        </Col>
        <Col span={6}>
          <Stat
            label="SSS %"
            value={`${sss.toFixed(2)}%`}
            color={sss >= 0 ? 'green' : 'red'}
            formula="(Actual Net Sales - Prior Net Sales) / Prior Net Sales * 100"
            applied={`($${actual} - $${prior}) / $${prior}`}
          />
        </Col>
      </Row>
    </>
  );
}
