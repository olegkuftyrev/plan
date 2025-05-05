// src/pages/Register.jsx
import React, { useContext } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const { Title } = Typography;

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onFinish = async ({ email, password }) => {
    try {
      // Сначала регистрация
      await api.post('/auth/register', { email, password });
      message.success('Registration successful! Logging you in…');

      // Потом автоматический логин
      await login(email, password);

      // И перенаправление
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Показываем ошибку
      message.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '0 16px' }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Card bordered={false}>
          <Title level={3} style={{ textAlign: 'center' }}>
            Register
          </Title>
          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              hasFeedback
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
