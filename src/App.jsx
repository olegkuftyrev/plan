import { useState } from 'react';
import { Layout, Upload, Collapse, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import useExcelRows from './hooks/useExcelRows';
import parseValues from './utils/parseValues';

import PLCalc from './components/PLCalc';
import Sales from './components/Sales';
import SalesChart from './components/SalesChart';
import COGS from './components/COGS';
import COGSChart from './components/COGSChart';
import Labor from './components/Labor';
import LaborChart from './components/LaborChart';
import Controllables from './components/Controllables';
import FixedCosts from './components/FixedCosts';
import Statistics from './components/Statistics';
import ControllablesChart from './components/ControllablesChart';
import FixedCostsChart from './components/FixedCostsChart';
import Knows from './components/Knows';
import ChartsGraphics from './components/ChartsGraphics';





const { Header, Content, Footer } = Layout;
const { Dragger } = Upload;
const { Panel } = Collapse;

export default function App() {
  const { rows, load } = useExcelRows();
  const [values, setValues] = useState({});

  const handleUpload = async ({ file }) => {
    if (!file) return;
    await load(file);
  };

  const actualIdx = rows[0]?.indexOf('Actuals') ?? 1;
  const parsedValues = rows.length > 1 ? parseValues(rows) : {};

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: 24 }}>
        {!rows.length ? (
          <Dragger
            multiple={false}
            accept=".xlsx"
            customRequest={handleUpload}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Drag & drop or click to upload Excel</p>
          </Dragger>
        ) : (
          <Collapse defaultActiveKey={['1']} accordion={false}>
            <Panel header="Business Snapshot" key="Z">
              <Knows values={parsedValues} />
            </Panel>
            <Panel header="Charts & Graphics" key="CG">
              <ChartsGraphics rows={rows} values={parsedValues} />
            </Panel>
            <Panel header="P&L Calculator" key="1">
              <PLCalc values={parsedValues} rows={rows} actualIdx={actualIdx} />
            </Panel>
            <Panel header="Sales Chart" key="3">
              <SalesChart rows={rows} />
            </Panel>
            <Panel header="Sales" key="2">
              <Sales rows={rows} />
            </Panel>
            <Panel header="COGS Chart" key="5">
              <COGSChart rows={rows} />
            </Panel>
            <Panel header="COGS" key="4">
              <COGS rows={rows} />
            </Panel>
            <Panel header="Labor Chart" key="7">
              <LaborChart rows={rows} />
            </Panel>
            <Panel header="Labor" key="6">
              <Labor rows={rows} />
            </Panel>
            <Panel header="Controllables Chart" key="X">
              <ControllablesChart rows={rows} />
            </Panel>
            <Panel header="Controllables" key="8">
              <Controllables rows={rows} />
            </Panel>
            <Panel header="Fixed Costs Chart" key="Y">
              <FixedCostsChart rows={rows} />
            </Panel>
            <Panel header="Fixed Costs" key="9">
              <FixedCosts rows={rows} />
            </Panel>
            <Panel header="Statistics" key="10">
              <Statistics rows={rows} />
            </Panel>
          </Collapse>
        )}
      </Content>

      <Footer style={{ textAlign: 'center' }}>© 2025 P&L Analyzer</Footer>
    </Layout>
  );
}
