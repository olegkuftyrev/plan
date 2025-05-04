import { Upload, Table, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import useExcelRows from '../hooks/useExcelRows';

export default function ExcelLoader() {
  const { rows, load } = useExcelRows();

  const beforeUpload = (file) => {
    load(file);          // парсим
    return false;        // отменяем автозагрузку Ant Upload
  };

  // первый ряд — заголовки
  const columns = rows[0]?.map((title, i) => ({
    title,
    dataIndex: i,
    key: i,
  })) || [];

  const dataSource = rows.slice(1).map((r, idx) => {
    const obj = { key: idx };
    r.forEach((cell, i) => (obj[i] = cell));
    return obj;
  });

  return (
    <>
      <Upload.Dragger accept=".xlsx,.xls" beforeUpload={beforeUpload} showUploadList={false}>
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p className="ant-upload-text">Перетащите Excel сюда или кликните для выбора</p>
      </Upload.Dragger>

      {rows.length > 1 && (
        <>
          <Button type="primary" style={{ marginTop: 16 }} onClick={() => console.log('rows→', rows)}>
            Console‑log rows
          </Button>
          <Table
            style={{ marginTop: 16 }}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: true }}
            size="small"
          />
        </>
      )}
    </>
  );
}
