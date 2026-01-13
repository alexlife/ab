import React, { useState } from 'react';
import { Table, Tag, Space, Button, Input, Select, Badge, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ExperimentList = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([
        {
            key: '1',
            name: '首页 Banner CTR 测试',
            layer: '流量层 A',
            status: '进行中',
            groups: ['对照组', '变体 A'],
            traffic: '30%',
            owner: 'Alex Smith',
            startTime: '2024-01-10',
        },
        {
            key: '2',
            name: '新用户引导流程',
            layer: '流量层 B',
            status: '草稿',
            groups: ['对照组', '流程 X', '流程 Y'],
            traffic: '100%',
            owner: 'Sarah Jones',
            startTime: '-',
        },
        {
            key: '3',
            name: '定价页面布局',
            layer: '流量层 A',
            status: '已结束',
            groups: ['原始版', '紧凑版'],
            traffic: '50%',
            owner: 'Mike Brown',
            startTime: '2023-12-01',
        },
        {
            key: '4',
            name: '单词记忆功能测试',
            layer: '流量层 C',
            status: '进行中',
            groups: ['基础版', '增强版'],
            traffic: '10%',
            owner: 'Emily White',
            startTime: '2024-01-12',
        },
    ]);

    const columns = [
        {
            title: '实验名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '流量层',
            dataIndex: 'layer',
            key: 'layer',
            render: (layer) => {
                let color = 'geekblue';
                if (layer === '流量层 A') color = 'volcano';
                if (layer === '流量层 B') color = 'green';
                return (
                    <Tag color={color} key={layer}>
                        {layer.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: '流量占比',
            dataIndex: 'traffic',
            key: 'traffic',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                let color = 'default';
                let icon = null;
                if (status === '进行中') {
                    color = 'processing';
                    icon = <Badge status="processing" />;
                } else if (status === '已结束') {
                    color = 'success';
                } else if (status === '草稿') {
                    color = 'warning';
                }
                return (
                    <Tag color={color} icon={icon} style={{ borderRadius: '12px', padding: '0 10px' }}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: '负责人',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === '进行中' ? (
                        <Tooltip title="暂停实验">
                            <Button type="text" icon={<PauseCircleOutlined style={{ color: 'orange' }} />} />
                        </Tooltip>
                    ) : (
                        <Tooltip title="开启实验">
                            <Button type="text" icon={<PlayCircleOutlined style={{ color: 'green' }} />} />
                        </Tooltip>
                    )}
                    <a>编辑</a>
                    <a>数据</a>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Input placeholder="搜索实验名称" prefix={<SearchOutlined />} style={{ width: 200 }} />
                    <Select defaultValue="所有流量层" style={{ width: 120 }}>
                        <Option value="所有流量层">所有流量层</Option>
                        <Option value="流量层 A">流量层 A</Option>
                        <Option value="流量层 B">流量层 B</Option>
                    </Select>
                    <Select defaultValue="所有状态" style={{ width: 120 }}>
                        <Option value="所有状态">所有状态</Option>
                        <Option value="进行中">进行中</Option>
                        <Option value="草稿">草稿</Option>
                        <Option value="已结束">已结束</Option>
                    </Select>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/experiments/create')}>
                    新建实验
                </Button>
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default ExperimentList;
