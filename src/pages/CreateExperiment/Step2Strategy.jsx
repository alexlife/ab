import React, { useState } from 'react';
import { Form, Select, Radio, Alert, Space, Typography, Progress, Tooltip, Empty, InputNumber } from 'antd';
import { InfoCircleOutlined, SwapOutlined, PartitionOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Mock active experiments for exclusivity selection
const ACTIVE_EXPERIMENTS = [
    { id: 'exp_101', name: '首页 Banner CTR 测试', traffic: 30, layer: 'layer_1' },
    { id: 'exp_102', name: '单词推荐算法优化', traffic: 50, layer: 'layer_2' },
    { id: 'exp_103', name: '新用户引导弹窗', traffic: 20, layer: 'layer_1' }, // Note: 101 and 103 are already in the same "room"
];

const Step2Strategy = ({ data, updateData }) => {
    const [selectedMutexExp, setSelectedMutexExp] = useState(null);

    const handleMutexChange = (expId) => {
        const exp = ACTIVE_EXPERIMENTS.find(e => e.id === expId);
        setSelectedMutexExp(exp);
        updateData('mutexExpId', expId);
    };

    // Calculate traffic visualization for the selected "room"
    const renderTrafficBar = () => {
        if (!selectedMutexExp) return null;

        // Find all exps in the same "room" (layer)
        const roomExps = ACTIVE_EXPERIMENTS.filter(e => e.layer === selectedMutexExp.layer);
        const usedByOthers = roomExps.reduce((sum, e) => sum + e.traffic, 0);
        const currentExpTraffic = data.totalTraffic || 0;
        const totalUsed = usedByOthers + currentExpTraffic;
        const freeTraffic = Math.max(0, 100 - totalUsed);

        return (
            <div style={{ marginTop: 16, background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>流量房间预览</Text>
                    <Text type="secondary">
                        剩余可用：
                        <Text strong type={100 - usedByOthers - currentExpTraffic < 0 ? 'danger' : 'success'}>
                            {Math.max(0, 100 - usedByOthers - currentExpTraffic)}%
                        </Text>
                    </Text>
                </div>
                <div style={{ height: 32, display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #ddd', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    {roomExps.map((e, i) => (
                        <Tooltip key={e.id} title={`${e.name}: ${e.traffic}%`}>
                            <div style={{
                                width: `${e.traffic}%`,
                                background: '#d9d9d9',
                                color: '#666',
                                fontSize: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRight: '1px solid #fff'
                            }}>
                                {e.traffic}%
                            </div>
                        </Tooltip>
                    ))}
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
                <div style={{ marginTop: 12 }}>
                    <Form.Item
                        label={<Text strong>本实验占用总流量 (%)</Text>}
                        extra={`您打算从剩余的 ${100 - usedByOthers}% 流量中分配多少给本实验？`}
                        validateStatus={totalUsed > 100 ? 'error' : ''}
                        help={totalUsed > 100 ? '流量总计不能超过 100%' : ''}
                    >
                        <InputNumber
                            min={1}
                            max={100 - usedByOthers}
                            value={data.totalTraffic}
                            onChange={(val) => updateData('totalTraffic', val)}
                            addonAfter="%"
                            style={{ width: 150 }}
                        />
                    </Form.Item>
                </div>
            </div>
        );
    };

    return (
        <Form layout="vertical" style={{ maxWidth: 700, margin: '0 auto' }}>
            <Alert
                message="生效策略配置"
                description="默认情况下实验为“正交”，即不与其他实验产生流量竞争。如需对特定场景进行流量隔离（例如都在修改首页），请选择“互斥”。"
                type="info"
                showIcon
                style={{ marginBottom: 32 }}
            />

            <Form.Item label={<Text strong style={{ fontSize: 16 }}>流量运行模式</Text>} required>
                <Radio.Group
                    value={data.isOrthogonal}
                    onChange={(e) => {
                        updateData('isOrthogonal', e.target.value);
                        if (e.target.value === true) setSelectedMutexExp(null);
                    }}
                    style={{ width: '100%' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Card
                            hoverable
                            size="small"
                            style={{
                                cursor: 'pointer',
                                border: data.isOrthogonal ? '2px solid #1677ff' : '1px solid #f0f0f0',
                                backgroundColor: data.isOrthogonal ? '#f0f5ff' : '#fff'
                            }}
                            onClick={() => updateData('isOrthogonal', true)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                                <div style={{ fontSize: 24, marginRight: 16, color: data.isOrthogonal ? '#1677ff' : '#888' }}>
                                    <PartitionOutlined />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Radio value={true}><Text strong>正交运行 (独立流量空间)</Text></Radio>
                                    <div style={{ color: '#888', paddingLeft: 24, fontSize: 13 }}>
                                        该实验将独立获得 100% 流量，不占用现有其他实验的份额。适用于新功能、算法优化等独立场景。
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            hoverable
                            size="small"
                            style={{
                                cursor: 'pointer',
                                border: !data.isOrthogonal ? '2px solid #1677ff' : '1px solid #f0f0f0',
                                backgroundColor: !data.isOrthogonal ? '#f0f5ff' : '#fff'
                            }}
                            onClick={() => updateData('isOrthogonal', false)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                                <div style={{ fontSize: 24, marginRight: 16, color: !data.isOrthogonal ? '#1677ff' : '#888' }}>
                                    <SwapOutlined />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Radio value={false}><Text strong>互斥运行 (流量竞争/隔离)</Text></Radio>
                                    <div style={{ color: '#888', paddingLeft: 24, fontSize: 13 }}>
                                        由于改动位置冲突，该实验需与现有实验共享流量。同一用户进入本实验后，将不再进入互斥组内的其他实验。
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Space>
                </Radio.Group>
            </Form.Item>

            {!data.isOrthogonal && (
                <Form.Item
                    label="关联互斥实验"
                    required
                    style={{ marginTop: 24 }}
                    extra="选择一个正在运行的实验，系统将为您关联对应的互斥组（流量房间）"
                >
                    <Select
                        placeholder="请搜索并选择要与其互斥的实验"
                        showSearch
                        optionFilterProp="label"
                        onChange={handleMutexChange}
                        options={ACTIVE_EXPERIMENTS.map(e => ({ value: e.id, label: e.name }))}
                    />
                    {renderTrafficBar()}
                </Form.Item>
            )}

            <Divider style={{ margin: '32px 0' }} />

            <Form.Item label={<Text strong>目标人群筛选 (必填)</Text>} required>
                <Select
                    mode="multiple"
                    placeholder="输入关键词搜索并回车添加人群包"
                    value={data.audience}
                    onChange={(val) => updateData('audience', val)}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未找到匹配人群" />}
                    onSearch={(val) => updateData('audience_search_text', val)}
                    options={
                        data.audience_search_text ? [
                            { value: 'New Users', label: '新用户包' },
                            { value: 'iOS', label: 'iOS 活跃用户' },
                            { value: 'Android', label: 'Android 活跃用户' },
                            { value: 'Premium', label: '高级订阅会员' },
                            { value: 'Region: CN', label: '地区: 华东/华北' },
                            { value: 'Heavy_Users', label: '高频学习用户' },
                        ].filter(item => item.label.includes(data.audience_search_text)) : []
                    }
                >
                </Select>
            </Form.Item>
        </Form>
    );
};

// Help Card component to make radio look better
const Card = ({ children, style, onClick, hoverable, size }) => (
    <div
        onClick={onClick}
        style={{
            ...style,
            borderRadius: '8px',
            transition: 'all 0.3s',
            boxShadow: hoverable ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
        }}
    >
        {children}
    </div>
);

const Divider = ({ style }) => <div style={{ height: '1px', background: '#f0f0f0', ...style }} />;

export default Step2Strategy;
