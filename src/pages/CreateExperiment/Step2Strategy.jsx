import React, { useState, useMemo } from 'react';
import { Form, Select, Alert, Typography, Tooltip, Empty, InputNumber, Card, Badge, List, Divider } from 'antd';
import { InfoCircleOutlined, PartitionOutlined } from '@ant-design/icons';
import { useExperiments } from '../../hooks/useExperiments';
import SpecOverlay from '../../components/DevTools/SpecOverlay';

const { Text } = Typography;

// Base Layer Definitions (Structure only, no traffic data)
const LAYER_DEFS = [
    { id: 'layer_1', name: '首页 UI 层' },
    { id: 'layer_2', name: '课程推荐算法层' },
    { id: 'layer_3', name: '支付/定价策略层' }
];

const Step2Strategy = ({ data, updateData, isReadOnly, isOngoing }) => {
    const readOnly = isReadOnly || isOngoing;
    const allExperiments = useExperiments();

    // Dynamically calculate layer status
    const layers = useMemo(() => {
        return LAYER_DEFS.map(layer => {
            const layerExps = allExperiments.filter(e =>
                e.layerId === layer.id &&
                e.status === '进行中' &&
                e.id !== data.id // Exclude current experiment if it's already in the list (for editing)
            );
            return {
                ...layer,
                experiments: layerExps.map(e => ({
                    id: e.id,
                    name: e.name,
                    traffic: e.layerTrafficShare || 0
                }))
            };
        });
    }, [allExperiments, data.id]);

    // Current layer based on selection
    const selectedLayer = useMemo(() =>
        layers.find(l => l.id === data.layerId)
        , [data.layerId, layers]);

    const handleLayerChange = (layerId) => {
        updateData('layerId', layerId);
        // Reset traffic occupancy when layer changes to avoid overflow immediately
        updateData('totalTraffic', 0);
    };

    const usedTraffic = selectedLayer?.experiments.reduce((sum, e) => sum + e.traffic, 0) || 0;
    const availableTraffic = 100 - usedTraffic;
    const currentExpTraffic = data.totalTraffic || 0;
    const isOverflow = usedTraffic + currentExpTraffic > 100;

    return (
        <Form layout="vertical" style={{ maxWidth: 700, margin: '0 auto' }} disabled={isReadOnly}>
            <Alert
                message="生效策略配置"
                description="请先选择实验所在的流量层。每层都占 APP 100% 流量。同一层内的实验互斥执行共享该层 100% 的流量槽位。"
                type="info"
                showIcon
                style={{ marginBottom: 32 }}
            />

            <SpecOverlay specId="rule_state_permissions">
                <Form.Item label={<Text strong style={{ fontSize: 16 }}>选择流量层</Text>} required>
                    <Select
                        id="layer-selector"
                        placeholder="请选择流量层"
                        value={data.layerId}
                        onChange={handleLayerChange}
                        options={layers.map(l => ({
                            value: l.id,
                            label: l.name,
                            disabled: (100 - l.experiments.reduce((sum, e) => sum + e.traffic, 0)) <= 0
                        }))}
                        style={{ width: '100%', height: 45 }}
                        disabled={readOnly}
                    />
                </Form.Item>
            </SpecOverlay>

            {selectedLayer && (
                <div style={{ marginBottom: 32, animation: 'fadeIn 0.5s' }}>
                    <Card size="small" style={{ background: '#fafafa', borderRadius: 12 }}>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>层内状态：{selectedLayer.name}</Text>
                        </div>

                        {/* Traffic Bar Visual */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text type="secondary">流量分布概览</Text>
                                <Text type="secondary">
                                    剩余可用：<Text strong type={availableTraffic - currentExpTraffic < 0 ? 'danger' : 'success'}>
                                        {Math.max(0, availableTraffic - currentExpTraffic)}%
                                    </Text>
                                </Text>
                            </div>
                            <div style={{ height: 32, display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #ddd' }}>
                                {selectedLayer.experiments.map((e, idx) => {
                                    const colors = [
                                        '#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#bae637', '#73d13d', '#52c41a',
                                        '#36cfc9', '#40a9ff', '#1677ff', '#597ef7', '#722ed1', '#eb2f96'
                                    ];
                                    const bgColor = colors[idx % colors.length];
                                    return (
                                        <Tooltip key={e.id} title={`${e.name}: ${e.traffic}%`}>
                                            <div style={{
                                                width: `${e.traffic}%`,
                                                background: bgColor + '33', // 20% opacity for existing exps
                                                color: bgColor,
                                                fontSize: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRight: '1px solid #fff',
                                                borderBottom: `2px solid ${bgColor}`
                                            }}>
                                                {e.traffic}%
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                                {currentExpTraffic > 0 && (
                                    <Tooltip title={`本实验预期占用: ${currentExpTraffic}%`}>
                                        <div style={{
                                            width: `${currentExpTraffic}%`,
                                            background: '#1677ff',
                                            color: 'white',
                                            fontSize: '11px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRight: '1px solid #fff',
                                            fontWeight: 'bold'
                                        }}>
                                            新实验 {currentExpTraffic}%
                                        </div>
                                    </Tooltip>
                                )}
                                <div style={{ flex: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '11px' }}>
                                    空闲
                                </div>
                            </div>
                        </div>

                        {/* Existing Experiments List */}
                        <div style={{ marginBottom: 20 }}>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>当前层在跑实验：</Text>
                            {selectedLayer.experiments.length > 0 ? (
                                <List
                                    size="small"
                                    dataSource={selectedLayer.experiments}
                                    renderItem={item => (
                                        <List.Item style={{ padding: '8px 12px' }}>
                                            <Badge status="processing" text={item.name} />
                                            <Text type="secondary">{item.traffic}% 流量</Text>
                                        </List.Item>
                                    )}
                                    style={{ background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0' }}
                                />
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前层暂无正在运行的实验" style={{ margin: '10px 0' }} />
                            )}
                        </div>

                        {/* Traffic Input */}
                        <SpecOverlay specId="rule_traffic_limit">
                            <Form.Item
                                label={<Text strong>本实验预占用规模 (%)</Text>}
                                extra={`该比例代表该实验在全量用户中占据的 Hash 槽位比例。`}
                                validateStatus={isOverflow ? 'error' : ''}
                                help={isOverflow ? '当前层流量已耗尽，请减少本实验占用或调整层内其他实验。' : ''}
                                required
                            >
                                <InputNumber
                                    min={0}
                                    max={availableTraffic}
                                    value={data.totalTraffic}
                                    onChange={(val) => updateData('totalTraffic', val)}
                                    addonAfter="%"
                                    style={{ width: 150 }}
                                    disabled={isReadOnly && !isOngoing} // Allow edit if ongoing
                                />
                                {isOngoing && data.totalTraffic === 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <SpecOverlay specId="rule_no_new_users">
                                            <Text type="warning">已进入“不进入新用户”观察期</Text>
                                        </SpecOverlay>
                                    </div>
                                )}
                            </Form.Item>
                        </SpecOverlay>
                    </Card>
                </div>
            )}

            <Divider style={{ margin: '32px 0' }} />

            <SpecOverlay specId="rule_audience_lock">
                <Form.Item label={<Text strong>目标人群筛选 (必填)</Text>} required>
                    <Select
                        mode="multiple"
                        placeholder="输入关键词搜索并回车添加人群包"
                        value={data.audience}
                        onChange={(val) => updateData('audience', val)}
                        showSearch
                        disabled={readOnly}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未找到匹配人群" />}
                        onSearch={(val) => updateData('audience_search_text', val)}
                        options={[
                            { value: '新用户', label: '新用户包' },
                            { value: 'iOS', label: 'iOS 活跃用户' },
                            { value: 'Android', label: 'Android 活跃用户' },
                            { value: '付费用户', label: '高级付费会员' },
                            { value: '地区: 华东/华北', label: '地区: 华东/华北' },
                            { value: '高活跃用户', label: '高活跃用户' },
                            { value: '全量用户', label: '全量用户' },
                        ].filter(item =>
                            !data.audience_search_text ||
                            item.label.toLowerCase().includes(data.audience_search_text.toLowerCase()) ||
                            data.audience?.includes(item.value) // 确保已选中的项始终在 options 中，否则 AntD 无法回显 Label
                        )}
                    >
                    </Select>
                </Form.Item>
            </SpecOverlay>
        </Form>
    );
};

export default Step2Strategy;
