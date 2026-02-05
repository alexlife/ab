import React, { useState } from 'react';
import { Table, Tag, Space, Button, Input, Badge, Typography, Popconfirm, message, Select, Modal, Radio, Alert, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getExperiments, saveExperiments, getFeatures, deleteExperiment, updateFeature } from '../store/mockStore';
import { useExperiments } from '../hooks/useExperiments';
import SpecOverlay from '../components/DevTools/SpecOverlay';

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;

const ExperimentList = () => {
    const navigate = useNavigate();
    const experiments = useExperiments();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Solidify Modal State
    const [solidifyModalVisible, setSolidifyModalVisible] = useState(false);
    const [selectedExp, setSelectedExp] = useState(null);
    const [selectedVariationId, setSelectedVariationId] = useState(null);

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
        saveExperiments(updated);
    };

    const handleEndClick = (exp) => {
        setSelectedExp(exp);
        // Default to the first variation or control group
        setSelectedVariationId(exp.groups[0]?.variationId);
        setSolidifyModalVisible(true);
    };

    const handleSolidifyConfirm = () => {
        if (!selectedExp || !selectedVariationId) return;

        // 1. Update Experiment Status
        const updatedExps = experiments.map(exp => {
            if (exp.id === selectedExp.id) {
                return {
                    ...exp,
                    status: '已结束',
                    endTime: new Date().toLocaleString()
                };
            }
            return exp;
        });
        saveExperiments(updatedExps);

        // 2. Update Feature Solidification
        const features = getFeatures();
        const feature = features.find(f => f.id === selectedExp.featureId);
        if (feature) {
            updateFeature({
                ...feature,
                isSolidified: true,
                defaultVariationId: selectedVariationId
            });
        }

        message.success('实验已结束，Feature 已成功固化');
        setSolidifyModalVisible(false);
        setSelectedExp(null);
    };

    const handleDelete = (id) => {
        deleteExperiment(id);
        message.success('实验已删除');
    };

    const getLayerColor = (layerId) => {
        const colorPalette = [
            { bg: '#e6f7ff', text: '#1677ff', border: '#91d5ff' }, // Blue
            { bg: '#f6ffed', text: '#52c41a', border: '#b7eb8f' }, // Green
            { bg: '#fff7e6', text: '#fa8c16', border: '#ffd591' }, // Orange
            { bg: '#fff1f0', text: '#f5222d', border: '#ffa39e' }, // Red
            { bg: '#f9f0ff', text: '#722ed1', border: '#d3adf7' }, // Purple
            { bg: '#fcffe6', text: '#a0d911', border: '#eaff8f' }, // Lime
            { bg: '#fff0f6', text: '#eb2f96', border: '#ffadd2' }, // Magenta
            { bg: '#e6fffb', text: '#13c2c2', border: '#87e8de' }, // Cyan
        ];

        const fixedMap = {
            'layer_1': colorPalette[0],
            'layer_2': colorPalette[1],
            'layer_3': colorPalette[2],
            'layer_4': colorPalette[3],
        };

        if (fixedMap[layerId]) return fixedMap[layerId];

        // Deterministic color generation for any layer ID
        if (!layerId) return { bg: '#f5f5f5', text: '#555', border: '#d9d9d9' };
        let hash = 0;
        for (let i = 0; i < layerId.length; i++) {
            hash = layerId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colorPalette.length;
        return colorPalette[index];
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
            title: '关联 Feature',
            dataIndex: 'featureId',
            key: 'featureId',
            render: (featId) => {
                const features = getFeatures();
                const feature = features.find(f => f.id === featId);
                return feature ? <Tag color="blue">{feature.name}</Tag> : <Text type="secondary">-</Text>;
            }
        },
        {
            title: (
                <SpecOverlay specId="rule_list_layer">
                    <span>流量层</span>
                </SpecOverlay>
            ),
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
                            border: `1px solid ${colors.border}`,
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
            render: (share, record) => {
                if (record.status === '进行中' && share === 0) {
                    return (
                        <SpecOverlay specId="rule_no_new_users">
                            <Text type="warning">不进入新用户</Text>
                        </SpecOverlay>
                    );
                }
                return <Text strong>{(share !== undefined && share !== null) ? `${share}%` : '-'}</Text>;
            }
        },
        {
            title: '实验人群',
            dataIndex: 'audience',
            key: 'audience',
            render: (audience) => (
                <Space wrap size={[0, 4]}>
                    {audience && audience.length > 0 ? (
                        audience.map(tag => (
                            <Tag key={tag} color="default" style={{ fontSize: 11 }}>{tag}</Tag>
                        ))
                    ) : (
                        <Text type="secondary">-</Text>
                    )}
                </Space>
            )
        },
        {
            title: (
                <SpecOverlay specId="rule_list_status">
                    <span>状态</span>
                </SpecOverlay>
            ),
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
                        <SpecOverlay specId="rule_experiment_start">
                            <Popconfirm title="确定开启实验吗？" onConfirm={() => updateStatus(record.id, '进行中')}>
                                <a style={{ color: '#1677ff' }}>开启</a>
                            </Popconfirm>
                        </SpecOverlay>
                    )}
                    {record.status === '进行中' && (
                        <SpecOverlay specId={['rule_experiment_end', 'rule_feature_solidify_sync']}>
                            <a style={{ color: '#52c41a' }} onClick={() => handleEndClick(record)}>结束</a>
                        </SpecOverlay>
                    )}
                    {(record.status === '草稿' || record.status === '进行中') && (
                        <SpecOverlay specId={record.status === '草稿' ? 'rule_experiment_edit_draft' : 'rule_experiment_edit_ongoing'}>
                            <a onClick={() => navigate(`/experiments/${record.id}`)} style={{ marginRight: 8 }}>编辑</a>
                        </SpecOverlay>
                    )}
                    {record.status === '已结束' && (
                        <SpecOverlay specId="rule_experiment_view_ended">
                            <a onClick={() => navigate(`/experiments/${record.id}`)}>查看详情</a>
                        </SpecOverlay>
                    )}
                    {record.status === '草稿' && (
                        <SpecOverlay specId="rule_experiment_delete">
                            <Popconfirm title="确定删除该实验吗？" onConfirm={() => handleDelete(record.id)}>
                                <a style={{ color: '#ff4d4f' }}>删除</a>
                            </Popconfirm>
                        </SpecOverlay>
                    )}
                </Space>
            ),
        },
    ];

    const filtered = experiments.filter(e => {
        const matchesName = e.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
        return matchesName && matchesStatus;
    });

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
                    <Select
                        defaultValue="ALL"
                        style={{ width: 120 }}
                        onChange={value => setStatusFilter(value)}
                        value={statusFilter}
                    >
                        <Option value="ALL">全部状态</Option>
                        <Option value="草稿">草稿</Option>
                        <Option value="进行中">进行中</Option>
                        <Option value="已结束">已结束</Option>
                    </Select>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/experiments/create')}>
                    新建实验
                </Button>
            </div>
            <Table columns={columns} dataSource={filtered} rowKey="id" />

            {/* Solidification Modal */}
            <Modal
                title={
                    <Space>
                        <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                        <span>结束实验并固化 Feature</span>
                    </Space>
                }
                open={solidifyModalVisible}
                onOk={handleSolidifyConfirm}
                onCancel={() => setSolidifyModalVisible(false)}
                okText="确认固化并结束"
                cancelText="仅结束实验"
                okButtonProps={{ type: 'primary' }}
                cancelButtonProps={{
                    onClick: () => {
                        updateStatus(selectedExp?.id, '已结束');
                        setSolidifyModalVisible(false);
                        message.success('已结束实验，未固化 Feature');
                    }
                }}
                width={550}
                destroyOnClose
            >
                <div style={{ marginBottom: 20 }}>
                    <Alert
                        message="检测到实验正在进行中，建议同步选择最优实验值固化为 Feature 默认配置，以实现无缝切换。"
                        type="success"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Paragraph type="secondary">请选择一个版本作为全量默认配置：</Paragraph>
                    <Radio.Group
                        onChange={e => setSelectedVariationId(e.target.value)}
                        value={selectedVariationId}
                        style={{ width: '100%' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {selectedExp?.groups.map(group => {
                                const features = getFeatures();
                                const feature = features.find(f => f.id === selectedExp.featureId);
                                const variation = feature?.variations.find(v => v.id === group.variationId);
                                return (
                                    <div key={group.id} style={{
                                        padding: '12px 16px',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: 8,
                                        background: selectedVariationId === group.variationId ? '#f6ffed' : '#fff',
                                        transition: 'all 0.3s'
                                    }}>
                                        <Radio value={group.variationId}>
                                            <Space direction="vertical" size={0}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <Text strong>{group.name}</Text>
                                                    {group.isControl && <Tag>对照组</Tag>}
                                                </div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    绑定实验值: {variation?.name || '未知'}
                                                </Text>
                                            </Space>
                                        </Radio>
                                    </div>
                                );
                            })}
                        </Space>
                    </Radio.Group>
                </div>
                <Divider dashed style={{ margin: '12px 0' }} />
                <SpecOverlay specId={['rule_feature_solidify', 'rule_feature_solidify_sync']}>
                    <div style={{ background: '#fafafa', padding: '12px', borderRadius: 6, border: '1px dashed #d9d9d9' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            💡 确定固化后，该 Feature 的默认值将立即变更为所选版本，且关联实验会同步变为“已结束”并回放流量层比例。
                        </Text>
                    </div>
                </SpecOverlay>
            </Modal>
        </div>
    );
};

export default ExperimentList;
