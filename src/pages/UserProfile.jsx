// src/pages/UserProfile.jsx
import React, { useContext } from 'react';
import { Layout, Row, Col, Card, Typography } from 'antd';
import NavBar from '../components/NavBar';
import { AuthContext } from '../context/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function UserProfile() {
  const { user } = useContext(AuthContext);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavBar title="User Profile" />

      <Content style={{ padding: 24 }}>
        {user ? (
          <Row justify="center">
            <Col xs={24} sm={18} md={12} lg={8}>
              <Card>
                <Title level={4}>Your Profile</Title>
                <Text>
                  <strong>ID:</strong> {user.id}
                </Text>
                <br />
                <Text>
                  <strong>Email:</strong> {user.email}
                </Text>
                <br />
                {/* Если на бэке станут возвращаться эти поля, их можно раскомментировать */}
                {/* 
                {user.createdAt && (
                  <>
                    <Text>
                      <strong>Member Since:</strong>{' '}
                      {new Date(user.createdAt).toLocaleString()}
                    </Text>
                    <br />
                  </>
                )}
                {user.updatedAt && (
                  <>
                    <Text>
                      <strong>Last Updated:</strong>{' '}
                      {new Date(user.updatedAt).toLocaleString()}
                    </Text>
                    <br />
                  </>
                )} 
                */}
              </Card>
            </Col>
          </Row>
        ) : (
          <Row justify="center">
            <Col>
              <Text>User is not logged in.</Text>
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
}
