// src/pages/Login.jsx
import React, { useContext } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Title } = Typography;

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async ({ email, password }) => {
    try {
      await login(email, password);
      message.success('Logged in successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      message.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '0 16px' }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Card bordered={false}>
          <Title level={3} style={{ textAlign: 'center' }}>
            Sign In
          </Title>
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ email: '', password: '' }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email',    message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Log In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
