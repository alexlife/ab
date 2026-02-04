import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Input, Badge, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getExperiments, saveExperiments } from '../store/mockStore';

const { Text } = Typography;

const ExperimentList = () => {
    const navigate = useNavigate();
    const [experiments, setExperiments] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setExperiments(getExperiments());
    }, []);

    const updateStatus = (id, status) => {
        const updated = experiments.map(exp => {
            if (exp.id === id) {
                return {
                    ...exp,
                    status,
                    startTime: status === '进行中' ? new Date().toLocaleString() : exp.startTime,
                    endTime: status === '已结束' ? new Date().toLocaleString() : exp.endTime
                };
            }
            return exp;
        });
        setExperiments(updated);
        saveExperiments(updated);
    };

    const getLayerColor = (layerId) => {
        const colorMap = {
            'layer_1': { bg: '#e6f7ff', text: '#1677ff', border: '#91d5ff' }, // Blue
            'layer_2': { bg: '#f6ffed', text: '#52c41a', border: '#b7eb8f' }, // Green
            'layer_3': { bg: '#fff7e6', text: '#fa8c16', border: '#ffd591' }, // Orange
            'layer_4': { bg: '#fff1f0', text: '#f5222d', border: '#ffa39e' }, // Red
        };
        return colorMap[layerId] || { bg: '#f5f5f5', text: '#555', border: '#d9d9d9' };
    };

    const columns = [
        {
            title: '实验名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <a onClick={() => navigate(`/experiments/${record.id}`)} style={{ fontWeight: 'bold' }}>
                    {text}
                </a>
            ),
        },
        {
            title: '流量层',
            dataIndex: 'layerId',
            key: 'layerId',
            render: (layerId) => {
                const colors = getLayerColor(layerId);
                const layerName = layerId === 'layer_1' ? '首页 UI 层' :
                    layerId === 'layer_2' ? '课程推荐算法层' :
                        layerId === 'layer_3' ? '支付/定价策略层' : layerId;
                return (
                    <Tag
                        style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: 'none',
                            padding: '2px 8px'
                        }}
                    >
                        {layerName || '默认层'}
                    </Tag>
                );
            },
        },
        {
            title: '层内流量占比',
            dataIndex: 'layerTrafficShare',
            key: 'layerTrafficShare',
            render: (share) => <Text strong>{share ? `${share}%` : '-'}</Text>
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                const statusMap = {
                    '草稿': { badge: 'default', text: '草稿' },
                    '进行中': { badge: 'processing', text: '进行中' },
                    '已结束': { badge: 'success', text: '已结束' }
                };
                const current = statusMap[status] || { badge: 'default', text: status };
                return <Badge status={current.badge} text={current.text} />;
            },
        },
        {
            title: '负责人',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: '时间',
            key: 'time',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 12 }}>起: {record.startTime || '-'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>止: {record.endTime || '-'}</Text>
                </Space>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === '草稿' && (
                        <Popconfirm title="确定开启实验吗？" onConfirm={() => updateStatus(record.id, '进行中')}>
                            <a style={{ color: '#1677ff' }}>开启</a>
                        </Popconfirm>
                    )}
                    {record.status === '进行中' && (
                        <Popconfirm title="确定结束实验吗？" onConfirm={() => updateStatus(record.id, '已结束')}>
                            <a style={{ color: '#52c41a' }}>结束</a>
                        </Popconfirm>
                    )}
                    <a onClick={() => navigate(`/experiments/${record.id}`)}>
                        {(record.status === '草稿' || record.status === '进行中') ? '编辑' : '查看详情'}
                    </a>
                </Space>
            ),
        },
    ];

    const filtered = experiments.filter(e => e.name.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div style={{ background: '#fff', padding: 24, borderRadius: 16 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Input
                        placeholder="搜索实验名称"
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </Space>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/experiments/create')}>
                    新建实验
                </Button>
            </div>
            <Table columns={columns} dataSource={filtered} rowKey="id" />
        </div>
    );
};

export default ExperimentList;
