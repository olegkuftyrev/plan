// src/pages/Test.jsx
import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Title } = Typography;

export default function Test() {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col>
        <Title level={2}>Tes2</Title>
      </Col>
    </Row>
  );
}
