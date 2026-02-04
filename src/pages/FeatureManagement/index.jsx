import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Tag, Divider, message, Badge, Tooltip, TreeSelect, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, SearchOutlined, RocketOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getFeatures, updateFeature, addFeature, getExperiments } from '../../store/mockStore';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Text, Title } = Typography;

const COURSE_MOCK_DATA = {
    spus: [{ value: 'gamified', label: '游戏化' }, { value: 'traditional', label: '传统直播' }],
    skus: {
        gamified: [{ value: 'ja', label: '日语' }, { value: 'ko', label: '韩语' }],
        traditional: [{ value: 'en', label: '英语' }]
    },
    lessons: [
        {
            title: 'L1 入门阶段 (Level 1)',
            value: 'l1',
            children: [
                {
                    title: 'A1.1 基础听力 (Unit 1)',
                    value: 'ja-a1.1',
                    children: [
                        { title: 'Lesson 01: 问候语', value: 'lesson-01' },
                        { title: 'Lesson 02: 数字与时间', value: 'lesson-02' },
                        { title: 'Lesson 03: 自我介绍', value: 'lesson-03' }
                    ]
                },
                {
                    title: 'A1.2 常用口语 (Unit 2)',
                    value: 'ja-a1.2',
                    children: [
                        { title: 'Lesson 04: 购物场景', value: 'lesson-04' },
                        { title: 'Lesson 05: 问路', value: 'lesson-05' }
                    ]
                }
            ]
        },
        {
            title: 'L2 进阶阶段 (Level 2)',
            value: 'l2',
            children: [
                {
                    title: 'B1.1 职场对话',
                    value: 'ja-b1.1',
                    children: [
                        { title: 'Lesson 10: 面试准备', value: 'lesson-10' }
                    ]
                }
            ]
        }
    ]
};

const FeatureManagement = () => {
    const navigate = useNavigate();
    const [features, setFeatures] = useState([]);
    const [experiments, setExperiments] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isFeatModalOpen, setIsFeatModalOpen] = useState(false);
    const [isVarModalOpen, setIsVarModalOpen] = useState(false);
    const [editingFeat, setEditingFeat] = useState(null);
    const [editingVar, setEditingVar] = useState(null);
    const [currentFeatForVar, setCurrentFeatForVar] = useState(null);
    const [form] = Form.useForm();
    const [varForm] = Form.useForm();

    const loadData = () => {
        setFeatures(getFeatures());
        setExperiments(getExperiments());
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredFeatures = useMemo(() => {
        return features.filter(f => f.name.toLowerCase().includes(searchText.toLowerCase()));
    }, [features, searchText]);

    const isFeatureLocked = (feat) => {
        if (!feat) return false;
        const hasLockedExperiment = experiments.some(exp =>
            exp.featureId === feat.id && (exp.status === '进行中' || exp.status === '已结束')
        );
        return hasLockedExperiment || feat.isSolidified;
    };

    const hasEndedExperiment = (featId) => {
        return experiments.some(exp => exp.featureId === featId && exp.status === '已结束');
    };

    const showFeatModal = (feat = null) => {
        setEditingFeat(feat);
        if (feat) {
            form.setFieldsValue({ name: feat.name, key: feat.key });
        } else {
            form.resetFields();
        }
        setIsFeatModalOpen(true);
    };

    const handleFeatSubmit = () => {
        form.validateFields().then(values => {
            if (editingFeat) {
                updateFeature({ ...editingFeat, ...values });
                message.success('Feature 修改成功');
            } else {
                addFeature({
                    id: `feat_${Date.now()}`,
                    ...values,
                    variations: [],
                    isSolidified: false,
                    defaultVariationId: null
                });
                message.success('Feature 创建成功');
            }
            setIsFeatModalOpen(false);
            loadData();
        });
    };

    const showVarModal = (feat, variation = null) => {
        setCurrentFeatForVar(feat);
        setEditingVar(variation);
        if (variation) {
            varForm.setFieldsValue({
                name: variation.name,
                params: variation.content?.params || [],
                courses: variation.content?.courses || []
            });
        } else {
            varForm.resetFields();
            varForm.setFieldsValue({ params: [], courses: [] });
        }
        setIsVarModalOpen(true);
    };

    const handleVarSubmit = () => {
        varForm.validateFields().then(values => {
            const newVar = {
                id: editingVar ? editingVar.id : `var_${Date.now()}`,
                name: values.name,
                content: {
                    params: values.params || [],
                    courses: values.courses || []
                }
            };

            const updatedFeat = { ...currentFeatForVar };
            if (editingVar) {
                updatedFeat.variations = updatedFeat.variations.map(v => v.id === editingVar.id ? newVar : v);
            } else {
                updatedFeat.variations.push(newVar);
            }

            updateFeature(updatedFeat);
            message.success('操作成功');
            setIsVarModalOpen(false);
            loadData();
        });
    };

    const handleSolidify = (feat, varId) => {
        Modal.confirm({
            title: '确定固化配置吗？',
            content: '固化之后该配置将应用在全量人群成为默认配置，且不可再编辑。',
            okText: '确定固化',
            cancelText: '取消',
            onOk: () => {
                const updated = { ...feat, isSolidified: true, defaultVariationId: varId };
                updateFeature(updated);
                message.success('已成功固化并锁定 Feature');
                loadData();
            }
        });
    };

    const variationColumns = (feat) => [
        {
            title: '实验值名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Text>{text}</Text>
                    {feat.defaultVariationId === record.id && <Tag color="gold" icon={<CheckCircleOutlined />}>默认配置</Tag>}
                </Space>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 320,
            render: (_, record) => {
                const lockedArr = isFeatureLocked(feat);
                const locked = lockedArr === true || feat.isSolidified;
                const canSolidify = hasEndedExperiment(feat.id) && !feat.isSolidified;

                return (
                    <Space>
                        <Button type="link" size="small" onClick={() => showVarModal(feat, record)}>
                            {locked ? '详情' : '编辑配置'}
                        </Button>
                        {canSolidify && (
                            <Button type="link" size="small" style={{ color: '#fa8c16' }} onClick={() => handleSolidify(feat, record.id)}>
                                固化为默认
                            </Button>
                        )}
                        {!locked && <Button type="link" size="small" danger>删除</Button>}
                    </Space>
                );
            }
        }
    ];

    const columns = [
        {
            title: 'Feature 名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                const locked = isFeatureLocked(record);
                let lockMsg = "配置已锁定";
                if (record.isSolidified) lockMsg = "已固化为全量默认配置，不可编辑";
                else {
                    const relatedExp = experiments.find(e => e.featureId === record.id);
                    if (relatedExp?.status === '进行中') lockMsg = "关联实验进行中，配置已锁定";
                    else if (relatedExp?.status === '已结束') lockMsg = "关联实验已结束，在固化决策前不可修改配置";
                }

                return (
                    <Space direction="vertical" size={0}>
                        <Space>
                            <Text strong>{text}</Text>
                            {locked && (
                                <Tooltip title={lockMsg}>
                                    <LockOutlined style={{ color: '#faad14' }} />
                                </Tooltip>
                            )}
                        </Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>Key: {record.key}</Text>
                    </Space>
                );
            }
        },
        {
            title: '关联实验',
            key: 'experiments',
            render: (_, record) => {
                const linkedExps = experiments.filter(e => e.featureId === record.id);
                if (linkedExps.length === 0) return <Text type="secondary">暂无关联</Text>;
                return (
                    <Space wrap>
                        {linkedExps.map(exp => {
                            let color = 'default';
                            if (exp.status === '进行中') color = 'processing';
                            if (exp.status === '已结束') color = 'success';
                            return (
                                <Tag key={exp.id} color={color} style={{ borderRadius: 10 }}>
                                    {exp.name}（{exp.status}）
                                </Tag>
                            );
                        })}
                    </Space>
                );
            }
        },
        {
            title: '状态',
            key: 'status',
            width: 100,
            render: (_, record) => {
                if (isFeatureLocked(record)) {
                    return <Badge status="error" text="锁定中" />;
                }
                return null;
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => {
                const locked = isFeatureLocked(record);
                return (
                    <Space>
                        <Button type="link" icon={<EditOutlined />} onClick={() => showFeatModal(record)} disabled={locked}>编辑项目</Button>
                        <Button
                            type="primary"
                            size="small"
                            ghost
                            icon={<RocketOutlined />}
                            onClick={() => navigate('/experiments/create', { state: { featureId: record.id } })}
                            disabled={locked || experiments.some(e => e.featureId === record.id)}
                        >
                            创建实验
                        </Button>
                    </Space>
                );
            }
        }
    ];

    return (
        <div style={{ background: '#fff', padding: 24, borderRadius: 16 }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>Feature 列表</Title>
                <Space>
                    <Input
                        placeholder="输入名称搜索"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 220 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showFeatModal()}>新建项目</Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={filteredFeatures}
                rowKey="id"
                expandable={{
                    expandedRowRender: (record) => (
                        <div style={{ padding: '0 48px' }}>
                            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: 13 }}>实验值配置详情</Text>
                                {!isFeatureLocked(record) && (
                                    <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => showVarModal(record)}>添加</Button>
                                )}
                            </div>
                            <Table
                                columns={variationColumns(record)}
                                dataSource={record.variations || []}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                bordered
                            />
                        </div>
                    ),
                    rowExpandable: (record) => true,
                }}
            />

            {/* Feature Modal */}
            <Modal title={editingFeat ? "编辑 Feature" : "新建 Feature"} open={isFeatModalOpen} onOk={handleFeatSubmit} onCancel={() => setIsFeatModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Feature 名称" rules={[{ required: true }]}><Input placeholder="例如：主底按钮样式" /></Form.Item>
                    <Form.Item name="key" label="Feature Key" rules={[{ required: true }]}><Input placeholder="例如：main_btn_style" disabled={editingFeat} /></Form.Item>
                </Form>
            </Modal>

            {/* Variation Modal */}
            <Modal
                title={isFeatureLocked(currentFeatForVar) ? "详情" : (editingVar ? "编辑" : "添加")}
                open={isVarModalOpen}
                onOk={isFeatureLocked(currentFeatForVar) ? () => setIsVarModalOpen(false) : handleVarSubmit}
                onCancel={() => setIsVarModalOpen(false)}
                width={1000}
                destroyOnClose
            >
                <Form form={varForm} layout="vertical" disabled={isFeatureLocked(currentFeatForVar)}>
                    <Form.Item name="name" label="实验值名称" rules={[{ required: true }]}><Input /></Form.Item>

                    <Divider orientation="left">参数配置</Divider>
                    <Form.List name="params">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item {...restField} name={[name, 'key']} rules={[{ required: true }]}><Input placeholder="Key" /></Form.Item>
                                        <Form.Item {...restField} name={[name, 'type']}><Select style={{ width: 100 }}><Option value="string">字符串</Option><Option value="number">数字</Option><Option value="boolean">布尔值</Option></Select></Form.Item>
                                        <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true }]}><Input placeholder="Value" /></Form.Item>
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加参数</Button>
                            </>
                        )}
                    </Form.List>

                    <Divider orientation="left">课程绑定 (业务参数)</Divider>
                    <Form.List name="courses">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} style={{ marginBottom: 16, background: '#fafafa', padding: 16, borderRadius: 12, border: '1px solid #f0f0f0' }}>
                                        <Space align="start" style={{ display: 'flex', width: '100%' }}>
                                            <Form.Item {...restField} name={[name, 'mode']} label="模式" style={{ width: 100 }} initialValue="include">
                                                <Select options={[{ value: 'include', label: '选中' }, { value: 'exclude', label: '排除' }]} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'spu']} label="SPU" style={{ width: 140 }}>
                                                <Select options={COURSE_MOCK_DATA.spus} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'sku']} label="SKU" style={{ width: 140 }}>
                                                <Select options={COURSE_MOCK_DATA.skus.gamified} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'lessons']} label="Lessons" style={{ flex: 1, minWidth: 400 }}>
                                                <TreeSelect
                                                    treeData={COURSE_MOCK_DATA.lessons}
                                                    multiple
                                                    treeCheckable
                                                    showCheckedStrategy={TreeSelect.SHOW_ALL}
                                                    placeholder="请选择课程 (支持分类全选)"
                                                    style={{ width: '100%' }}
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                />
                                            </Form.Item>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} style={{ marginTop: 30 }} />
                                        </Space>
                                        {fields.length > 1 && <Divider dashed style={{ margin: '12px 0' }} />}
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加课程绑定项</Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default FeatureManagement;
