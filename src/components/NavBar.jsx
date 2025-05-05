// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Layout, Row, Col, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Header } = Layout;
const { Title } = Typography;

export default function NavBar({ title }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Header style={{ background: '#fff', padding: '0 24px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title onClick={() => navigate('/Dashboard')} level={4} style={{ margin: 0 }}>{title}</Title>
        </Col>
        <Col>
          <Button
            style={{ marginRight: 16 }}
            onClick={() => navigate('/UserProfile')}
          >
            Profile
          </Button>
          <Button
            type="primary"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Header>
  );
}
