import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, Row, Col, Space, Typography, Select, Divider, Tag, Empty, Modal, List, Badge, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, RocketOutlined, EyeOutlined } from '@ant-design/icons';
import { getFeatures } from '../../store/mockStore';
import SpecOverlay from '../../components/DevTools/SpecOverlay';

const { Text } = Typography;

const Step3Grouping = ({ data, updateData, isReadOnly, isOngoing }) => {
    const [features, setFeatures] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState(null);

    const isLocked = isReadOnly || isOngoing;

    useEffect(() => {
        setFeatures(getFeatures());
    }, []);

    // Get variations specifically for the feature selected in Step 1
    const selectedFeature = features.find(f => f.id === data.featureId);
    const variations = selectedFeature?.variations || [];

    const updateGroup = (id, field, value) => {
        const newGroups = data.groups.map(g => {
            if (g.id === id) return { ...g, [field]: value };
            return g;
        });
        updateData('groups', newGroups);
    };

    const addGroup = () => {
        const newId = Math.max(...data.groups.map(g => g.id), 0) + 1;
        const newGroup = {
            id: newId,
            name: `实验组 ${newId}`,
            ratio: 0,
            isControl: false,
            variationId: undefined,
            description: '',
            whitelist: ''
        };
        updateData('groups', [...data.groups, newGroup]);
    };

    const removeGroup = (id) => {
        updateData('groups', data.groups.filter(g => g.id !== id));
    };

    const showPreview = (varId) => {
        const variation = variations.find(v => v.id === varId);
        if (variation) {
            setPreviewContent(variation);
            setIsPreviewOpen(true);
        }
    };

    const totalRatio = data.groups.reduce((sum, g) => sum + (g.ratio || 0), 0);

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e6f4ff', padding: '16px 24px', borderRadius: 12 }}>
                <Space direction="vertical" size={0}>
                    <Text type="secondary">当前实验绑定的 Feature 项目</Text>
                    <Text strong style={{ fontSize: 18, color: '#1677ff' }}>
                        {selectedFeature ? selectedFeature.name : '未选择 (请返回第一步选择)'}
                    </Text>
                </Space>
                <div style={{ textAlign: 'right' }}>
                    <SpecOverlay specId="rule_group_ratio_sum">
                        <Text strong style={{ display: 'block', color: totalRatio !== 100 ? '#ff4d4f' : 'inherit' }}>
                            各实验组流量总计: {totalRatio}% / 100%
                        </Text>
                    </SpecOverlay>
                    {!isLocked && <Button type="primary" ghost size="small" icon={<PlusOutlined />} onClick={addGroup} style={{ marginTop: 8 }}>添加新分组</Button>}
                </div>
            </div>

            <Form layout="vertical">
                {data.groups.map((group) => (
                    <Card
                        key={group.id}
                        title={
                            <Space>
                                <Input
                                    value={group.name}
                                    onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                                    style={{ width: 180, fontWeight: 'bold' }}
                                    disabled={isLocked}
                                />
                                {group.isControl ? (
                                    <SpecOverlay specId="rule_control_group">
                                        <Tag color="default">对照组 (Control)</Tag>
                                    </SpecOverlay>
                                ) : (
                                    <SpecOverlay specId="rule_experimental_group">
                                        <Tag color="blue">实验组 (Variation)</Tag>
                                    </SpecOverlay>
                                )}
                            </Space>
                        }
                        extra={!group.isControl && !isLocked && <Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeGroup(group.id)} />}
                        style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    >
                        <Row gutter={48}>
                            <Col span={9}>
                                <SpecOverlay specId={isOngoing ? 'rule_state_permissions' : 'rule_group_ratio_sum'}>
                                    <Form.Item label={<Text strong>流量比例 (%)</Text>} required>
                                        <InputNumber
                                            min={0} max={100}
                                            style={{ width: '100%' }}
                                            value={group.ratio}
                                            onChange={(val) => updateGroup(group.id, 'ratio', val)}
                                            addonAfter="%"
                                            disabled={isLocked} // Lock ratio if ongoing or ended
                                        />
                                    </Form.Item>
                                </SpecOverlay>
                                <SpecOverlay specId="rule_experiment_edit_ongoing">
                                    <Form.Item label={<Text strong>分组介绍</Text>}>
                                        <Input.TextArea
                                            placeholder="请输入分组详细描述"
                                            value={group.description}
                                            onChange={(e) => updateGroup(group.id, 'description', e.target.value)}
                                            rows={2}
                                            disabled={isReadOnly}
                                        />
                                    </Form.Item>
                                </SpecOverlay>
                                <SpecOverlay specId="rule_uid_unique">
                                    <Form.Item
                                        label={
                                            <Space>
                                                <Text strong>白名单 (UID)</Text>
                                                <SpecOverlay specId="rule_whitelist_priority">
                                                    <Tooltip title="UID 命中的用户将强制进入该组，不受人群筛选流量比例等限制">
                                                        <Text type="secondary" style={{ fontSize: 12, cursor: 'help' }}>(?)</Text>
                                                    </Tooltip>
                                                </SpecOverlay>
                                            </Space>
                                        }
                                    >
                                        <Input.TextArea
                                            placeholder="强制入组的用户 UID，多个用逗号分隔"
                                            value={group.whitelist}
                                            onChange={(e) => updateGroup(group.id, 'whitelist', e.target.value)}
                                            rows={2}
                                            disabled={isReadOnly}
                                        />
                                    </Form.Item>
                                </SpecOverlay>
                            </Col>

                            <Col span={15} style={{ borderLeft: '1px solid #f0f0f0' }}>
                                <SpecOverlay specId={isOngoing ? 'rule_state_permissions' : 'rule_variation_bind'}>
                                    <Form.Item
                                        label={<Text strong><RocketOutlined /> 绑定配置实验值</Text>}
                                        required
                                        extra={selectedFeature ? `请选择 ${selectedFeature.name} 下的实验值` : "请先在第一步选择 Feature"}
                                    >
                                        <Select
                                            placeholder="请选择实验值"
                                            disabled={isLocked || !selectedFeature}
                                            value={group.variationId}
                                            onChange={(val) => updateGroup(group.id, 'variationId', val)}
                                            options={variations.map(v => ({ label: v.name, value: v.id }))}
                                            size="large"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </SpecOverlay>

                                {group.variationId ? (
                                    <div style={{ marginTop: 12, padding: '16px', background: '#f6ffed', borderRadius: 12, border: '1px solid #b7eb8f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Space direction="vertical" size={2}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>已选实验值摘要：</Text>
                                            <Text strong style={{ color: '#52c41a', fontSize: 15 }}>
                                                {variations.find(v => v.id === group.variationId)?.name}
                                            </Text>
                                        </Space>
                                        <Button
                                            type="primary"
                                            ghost
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() => showPreview(group.variationId)}
                                        >
                                            预览配置详情
                                        </Button>
                                    </div>
                                ) : (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未绑定实验值" />
                                )}
                            </Col>
                        </Row>
                    </Card>
                ))}
            </Form>

            <Modal
                title="实验值配置预览"
                open={isPreviewOpen}
                onCancel={() => setIsPreviewOpen(false)}
                footer={[<Button key="close" onClick={() => setIsPreviewOpen(false)}>关闭</Button>]}
                width={600}
            >
                {previewContent && (
                    <div>
                        <Divider orientation="left" style={{ margin: '8px 0' }}>参数列表</Divider>
                        <List
                            bordered
                            size="small"
                            dataSource={previewContent.content?.params || []}
                            renderItem={item => (
                                <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text code>{item.key}</Text>
                                    <Space>
                                        <Text type="secondary">[{item.type}]</Text>
                                        <Text strong>{String(item.value)}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                        {(previewContent.content?.courses?.length > 0) && (
                            <>
                                <Divider orientation="left" style={{ margin: '24px 0 8px 0' }}>课程绑定</Divider>
                                <List
                                    bordered
                                    size="small"
                                    dataSource={previewContent.content.courses}
                                    renderItem={item => (
                                        <List.Item>
                                            <Badge status="processing" text={item.spu} />
                                            <Divider type="vertical" />
                                            <Text>{item.sku}</Text>
                                            <Divider type="vertical" />
                                            <Text type="secondary">{item.lessons?.join(', ')}</Text>
                                        </List.Item>
                                    )}
                                />
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Step3Grouping;
