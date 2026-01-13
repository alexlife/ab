import React from 'react';
import { Form, Input, InputNumber, Button, Card, Row, Col, Space, Typography, Select, TreeSelect, Divider, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

// Mock Data for Courses
const MOCK_DATA = {
    spus: [
        { value: 'gamified', label: '游戏化' },
        { value: 'traditional', label: '传统直播' },
    ],
    skus: {
        gamified: [
            { value: 'ja', label: '日语' },
            { value: 'ko', label: '韩语' },
            { value: 'fr', label: '法语' },
        ],
        traditional: [
            { value: 'en', label: '英语' },
            { value: 'zh', label: '中文' },
        ]
    },
    lessons: {
        ja: [
            {
                title: 'A1.1',
                value: 'ja-a1.1',
                children: [
                    {
                        title: 'U1',
                        value: 'ja-a1.1-u1',
                        children: [
                            { title: 'Lesson 1', value: 'ja-a1.1-u1-l1' },
                            { title: 'Lesson 2', value: 'ja-a1.1-u1-l2' },
                        ]
                    },
                    {
                        title: 'U2',
                        value: 'ja-a1.1-u2',
                        children: [
                            { title: 'Lesson 1', value: 'ja-a1.1-u2-l1' },
                        ]
                    }
                ]
            },
            {
                title: 'A1.2',
                value: 'ja-a1.2',
                children: [
                    { title: 'U1', value: 'ja-a1.2-u1' }
                ]
            }
        ],
        ko: [
            { title: '入门级', value: 'ko-intro', children: [{ title: '第一课', value: 'ko-l1' }] }
        ]
    }
};

const Step3Grouping = ({ data, updateData }) => {

    const updateGroup = (id, field, value) => {
        const newGroups = data.groups.map(g => {
            if (g.id === id) return { ...g, [field]: value };
            return g;
        });
        updateData('groups', newGroups);
    };

    // --- Feature Params Logic ---
    const addParam = (groupId) => {
        const newGroups = data.groups.map(g => {
            if (g.id === groupId) {
                return { ...g, config: [...(g.config || []), { key: '', type: 'string', value: '' }] };
            }
            return g;
        });
        updateData('groups', newGroups);
    };

    const updateParam = (groupId, index, field, value) => {
        const newGroups = data.groups.map(g => {
            if (g.id === groupId) {
                const newConfig = [...g.config];
                newConfig[index][field] = value;
                return { ...g, config: newConfig };
            }
            return g;
        });
        updateData('groups', newGroups);
    };

    const removeParam = (groupId, index) => {
        const newGroups = data.groups.map(g => {
            if (g.id === groupId) {
                const newConfig = [...g.config];
                newConfig.splice(index, 1);
                return { ...g, config: newConfig };
            }
            return g;
        });
        updateData('groups', newGroups);
    }

    // --- Course Logic ---
    const addCourse = (groupId) => {
        const newGroups = data.groups.map(g => {
            if (g.id === groupId) {
                return { ...g, courses: [...(g.courses || []), { spu: '', sku: '', lessons: [] }] };
            }
            return g;
        });
        updateData('groups', newGroups);
    };

    const updateCourse = (groupId, index, field, value) => {
        const newGroups = data.groups.map(g => {
            if (g.id === groupId) {
                const newCourses = [...(g.courses || [])];
                newCourses[index][field] = value;
                // If SPU changes, reset SKU and Lessons
                if (field === 'spu') {
                    newCourses[index].sku = '';
                    newCourses[index].lessons = [];
                }
                // If SKU changes, reset Lessons
                if (field === 'sku') {
                    newCourses[index].lessons = [];
                }
                return { ...g, courses: newCourses };
            }
            return g;
        });
        updateData('groups', newGroups);
    };

    const removeCourse = (groupId, index) => {
        const newGroups = data.groups.map(g => {
            if (g.id === groupId) {
                const newCourses = [...(g.courses || [])];
                newCourses.splice(index, 1);
                return { ...g, courses: newCourses };
            }
            return g;
        });
        updateData('groups', newGroups);
    };

    const addGroup = () => {
        const newId = Math.max(...data.groups.map(g => g.id)) + 1;
        const newGroup = { id: newId, name: `实验组 ${newId}`, ratio: 0, isControl: false, config: [], courses: [] };
        updateData('groups', [...data.groups, newGroup]);
    };

    const removeGroup = (id) => {
        updateData('groups', data.groups.filter(g => g.id !== id));
    };

    const totalRatio = data.groups.reduce((sum, g) => sum + (g.ratio || 0), 0);

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>当前流量分配总计: {totalRatio}% / 100%</Text>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addGroup}>添加分组</Button>
            </div>

            <Form layout="vertical">
                {data.groups.map((group, index) => (
                    <Card
                        key={group.id}
                        title={
                            <Space>
                                <Input
                                    value={group.name}
                                    onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                                    style={{ width: 200 }}
                                />
                                {group.isControl ? <Text type="secondary">(对照组)</Text> : <Text type="success">(实验组)</Text>}
                            </Space>
                        }
                        extra={!group.isControl && <Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeGroup(group.id)} />}
                        style={{ marginBottom: 24, borderColor: group.isControl ? '#d9d9d9' : '#1677ff', borderRadius: 12, overflow: 'hidden' }}
                        styles={{ body: { padding: '24px' } }}
                    >
                        <Row gutter={32}>
                            {/* Left Section: Group Basics, Description, Whitelist */}
                            <Col span={10} style={{ borderRight: '1px solid #f0f0f0', paddingRight: 32 }}>
                                <Form.Item label={<Text strong>流量比例 (%)</Text>} required>
                                    <InputNumber
                                        min={0} max={100}
                                        style={{ width: '85px' }}
                                        value={group.ratio}
                                        onChange={(val) => updateGroup(group.id, 'ratio', val)}
                                        addonAfter="%"
                                        controls={false}
                                    />
                                </Form.Item>

                                <Form.Item label={<Text strong>分组介绍</Text>}>
                                    <Input.TextArea
                                        rows={2}
                                        placeholder="请说明该分组的测试重点..."
                                        value={group.description}
                                        onChange={(e) => updateGroup(group.id, 'description', e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <Space>
                                            <Text strong>测试用户</Text>
                                            <Tag color="orange" style={{ fontSize: '10px', lineHeight: '16px' }}>最高优先级</Tag>
                                        </Space>
                                    }
                                    tooltip="UID 命中的用户将强制进入该组，不受流量比例限制"
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="多个 UID 用英文逗号隔开"
                                        value={group.whitelist}
                                        onChange={(e) => updateGroup(group.id, 'whitelist', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>

                            {/* Right Section: Configurations */}
                            <Col span={14}>
                                {/* Feature Parameters Section */}
                                <div style={{ background: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong><SettingOutlined /> Feature 参数配置</Text>
                                        <Button size="small" type="link" onClick={() => addParam(group.id)}>+ 添加参数</Button>
                                    </div>
                                    {group.config && group.config.map((param, pIndex) => (
                                        <Space key={pIndex} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                            <Input placeholder="Key" value={param.key} onChange={(e) => updateParam(group.id, pIndex, 'key', e.target.value)} />
                                            <Select value={param.type} onChange={(val) => updateParam(group.id, pIndex, 'type', val)} style={{ width: 100 }}>
                                                <Option value="string">字符串</Option>
                                                <Option value="number">数字</Option>
                                                <Option value="boolean">布尔值</Option>
                                                <Option value="json">JSON</Option>
                                            </Select>
                                            <Input placeholder="Value" value={param.value} onChange={(e) => updateParam(group.id, pIndex, 'value', e.target.value)} />
                                            <Button icon={<DeleteOutlined />} danger size="small" type="text" onClick={() => removeParam(group.id, pIndex)} />
                                        </Space>
                                    ))}
                                    {(!group.config || group.config.length === 0) && <Text type="secondary" style={{ fontSize: 12 }}>暂无参数配置。</Text>}
                                </div>

                                {/* Courses Section */}
                                <div style={{ background: '#f0f5ff', padding: 12, borderRadius: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong><BookOutlined /> 课程配置</Text>
                                        <Button size="small" type="link" onClick={() => addCourse(group.id)}>+ 添加课程</Button>
                                    </div>
                                    {group.courses && group.courses.map((course, cIndex) => (
                                        <div key={cIndex} style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                            <Select
                                                placeholder="选择 SPU"
                                                style={{ width: 140 }}
                                                value={course.spu || undefined}
                                                onChange={(val) => updateCourse(group.id, cIndex, 'spu', val)}
                                                options={MOCK_DATA.spus}
                                            />
                                            <Select
                                                placeholder="选择 SKU"
                                                style={{ width: 140 }}
                                                disabled={!course.spu}
                                                value={course.sku || undefined}
                                                onChange={(val) => updateCourse(group.id, cIndex, 'sku', val)}
                                                options={course.spu ? MOCK_DATA.skus[course.spu] : []}
                                            />
                                            <TreeSelect
                                                placeholder="选择 Lesson (必填)"
                                                style={{ flex: 1 }}
                                                multiple
                                                treeDefaultExpandAll
                                                disabled={!course.sku}
                                                value={course.lessons}
                                                onChange={(val) => updateCourse(group.id, cIndex, 'lessons', val)}
                                                treeData={course.sku ? MOCK_DATA.lessons[course.sku] || [] : []}
                                                treeCheckable={true}
                                                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                                            />
                                            <Button icon={<DeleteOutlined />} danger size="small" type="text" onClick={() => removeCourse(group.id, cIndex)} />
                                        </div>
                                    ))}
                                    {(!group.courses || group.courses.length === 0) && <Text type="secondary" style={{ fontSize: 12 }}>暂无课程配置。</Text>}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </Form>
        </div>
    );
};

export default Step3Grouping;
