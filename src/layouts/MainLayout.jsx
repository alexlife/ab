import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Typography, Badge, Space } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    ExperimentOutlined,
    SettingOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('实验管理', '/experiments', <ExperimentOutlined />),
    getItem('Feature 列表', '/features', <DesktopOutlined />),
    //    getItem('数据分析', '/analysis', <PieChartOutlined />),
    // getItem('人群管理', '/segments', <TeamOutlined />),
    getItem('系统设置', '/settings', <SettingOutlined />),
];

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (e) => {
        navigate(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: 'bold', display: collapsed ? 'none' : 'block' }}>A/B 测试平台</span>
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['/experiments']}
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={items}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>实验列表</Title>
                    <Space size="large">

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar icon={<UserOutlined />} />
                            <Text>管理员</Text>
                        </div>
                    </Space>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>实验列表</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>A/B 测试平台 ©2024 Demo</Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
