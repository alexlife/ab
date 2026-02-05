import React, { useState } from 'react';
import { Layout, Menu, theme, Typography, Space, Breadcrumb, Drawer, Tag, Divider, Empty, Avatar } from 'antd';
import {
    DashboardOutlined,
    ExperimentOutlined,
    AppstoreOutlined,
    SettingOutlined,
    BulbOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    DesktopOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { SpecProvider, useSpec } from '../contexts/SpecContext';
import { EXPERIMENT_SPECS } from '../specs/experiment';
import DevToolbar from '../components/DevTools/DevToolbar';

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const SpecDetailsSidebar = () => {
    const { isSidebarOpen, closeSidebar, selectedSpecId } = useSpec();

    const specIds = Array.isArray(selectedSpecId) ? selectedSpecId : [selectedSpecId];
    const specs = specIds.map(id => EXPERIMENT_SPECS[id]).filter(Boolean);

    return (
        <Drawer
            title={
                <Space>
                    <BulbOutlined style={{ color: '#1677ff' }} />
                    <Title level={5} style={{ margin: 0 }}>PRD 需求详情</Title>
                </Space>
            }
            placement="right"
            onClose={closeSidebar}
            open={isSidebarOpen}
            width={450}
            zIndex={2000}
            mask={false}
            style={{ marginTop: 64 }}
            styles={{ header: { background: '#fafafa', borderBottom: '1px solid #f0f0f0' } }}
        >
            {specs.length > 0 ? (
                <div style={{ padding: '8px 4px' }}>
                    {specs.map((spec, index) => (
                        <div key={spec.id} style={{ marginBottom: index === specs.length - 1 ? 20 : 40 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Tag color={spec.level === 'critical' ? 'error' : spec.level === 'warning' ? 'warning' : 'processing'}>
                                    {spec.level === 'critical' ? '核心原则' : spec.level === 'warning' ? '强制约束' : '业务逻辑'}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 11 }}>ID: {spec.id}</Text>
                            </div>
                            <Title level={4} style={{ marginTop: 0, marginBottom: 16, fontSize: 18 }}>{spec.title}</Title>
                            <Paragraph style={{ fontSize: 14, lineHeight: '1.6', color: '#434343', background: '#f9f9f9', padding: '16px', borderRadius: 8, whiteSpace: 'pre-wrap', border: '1px solid #f0f0f0' }}>
                                {spec.content}
                            </Paragraph>
                            <div style={{ textAlign: 'right', marginTop: 8 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>来源: {spec.source}</Text>
                            </div>
                            {index < specs.length - 1 && <Divider style={{ margin: '32px 0' }} />}
                        </div>
                    ))}
                </div>
            ) : (
                <Empty description="请点击页面上的 💡 标记查看详情" style={{ marginTop: 100 }} />
            )}
        </Drawer>
    );
};

const LayoutContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const items = [
        { key: '/experiments', icon: <ExperimentOutlined />, label: '实验管理' },
        { key: '/features', icon: <DesktopOutlined />, label: 'Feature 列表' },
        { key: '/introduction', icon: <BulbOutlined />, label: '说明' },
        { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: 'bold', display: collapsed ? 'none' : 'block' }}>A/B 测试平台</span>
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={items}
                    onClick={(e) => navigate(e.key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', zIndex: 1001 }}>
                    <Title level={4} style={{ margin: 0 }}>
                        {location.pathname.includes('/experiments') ? '实验管理' :
                            location.pathname.includes('/features') ? 'Feature 列表' :
                                location.pathname.includes('/introduction') ? '说明' : '系统设置'}
                    </Title>
                    <Space size="large">
                        <Space>
                            <Avatar icon={<UserOutlined />} />
                            <Text strong>管理员</Text>
                        </Space>
                    </Space>
                </Header>
                <Content style={{ margin: '16px', overflow: 'initial' }}>
                    <div style={{ padding: 24, background: '#fff', borderRadius: 12, minHeight: 'calc(100vh - 180px)' }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>A/B 测试平台 ©2024 Demo</Footer>
            </Layout>
            <SpecDetailsSidebar />
            <DevToolbar />
        </Layout>
    );
};

const MainLayout = () => (
    <SpecProvider>
        <LayoutContent />
    </SpecProvider>
);

export default MainLayout;
