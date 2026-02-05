import React from 'react';
import { Typography, Card, Steps, Divider, Row, Col, Tag, Timeline, Badge, Alert, Space, Table } from 'antd';
import {
    RocketOutlined,
    SyncOutlined,
    StopOutlined,
    CheckCircleOutlined,
    DeploymentUnitOutlined,
    PartitionOutlined,
    MergeCellsOutlined,
    SafetyOutlined,
    ArrowsAltOutlined,
    ExperimentOutlined,
    AppstoreOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Introduction = () => {
    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <Title level={1}>A/B 测试平台产品说明</Title>
                <Paragraph style={{ fontSize: 18, color: '#666' }}>
                    助力业务快速迭代，基于数据驱动决策的高性能实验中枢
                </Paragraph>
            </div>

            {/* Experiment Lifecycle Section */}
            <Title level={2} id="lifecycle"><RocketOutlined /> 实验生命周期</Title>
            <Card style={{ marginBottom: 40, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Steps
                    current={-1}
                    items={[
                        {
                            title: '草稿 (Draft)',
                            description: '配置实验基本信息、人群策略、分流比例及 Feature 实验值绑定。',
                            icon: <Text strong style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '50%' }}>1</Text>
                        },
                        {
                            title: '运行中 (Ongoing)',
                            description: '实验上线，流量按哈希命中下发。支持动态调整流量比例进行扩容。',
                            icon: <SyncOutlined spin style={{ color: '#1677ff' }} />
                        },
                        {
                            title: '不进新 (Checking)',
                            description: '流量调至0%。新用户不再进入，老用户保持分桶逻辑以保证体验一致。',
                            icon: <StopOutlined style={{ color: '#faad14' }} />
                        },
                        {
                            title: '已结束 (Ended)',
                            description: '将获胜组方案固化为生产默认功能并把实验归档。',
                            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        }
                    ]}
                />

                <Divider />

                <Title level={4}>关键操作节点：</Title>
                <Row gutter={24}>
                    <Col span={8}>
                        <Card size="small" title="中途变更" bordered={false} style={{ background: '#f0f7ff' }}>
                            <Text type="secondary">保持严谨性的同时兼顾灵活性：</Text>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li>允许调整 <Text strong>实验流量在当前流量层内占用比例</Text> (扩缩容)</li>
                                <li>不允许调整 <Text strong>组内配比</Text> (调优)</li>
                                <li>禁止修改流量层、人群及实验值</li>
                            </ul>
                            <Alert
                                message="流量层内比例降至 0 不代表结束实验，只是不新增用户"
                                type="info"
                                showIcon
                                style={{
                                    marginTop: 10,
                                    backgroundColor: '#e6f7ff',
                                    border: '1px solid #91d5ff'
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="如何停止" bordered={false} style={{ background: '#fff7e6' }}>
                            <Paragraph>当前不具备数据闭环能力，因此需要线下评估实验结果后在后台手动停止实验</Paragraph>
                            <Alert
                                message="目前暂时只支持手动停止，且停止需要与 Feature 固化绑定"
                                type="warning"
                                showIcon
                                style={{
                                    backgroundColor: '#fffbe6',
                                    border: '1px solid #ffe58f'
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="结果固化" bordered={false} style={{ background: '#f6ffed' }}>
                            <Paragraph>当实验组效果显著优于对照组：</Paragraph>
                            <ul style={{ paddingLeft: 20 }}>
                                <li>将获胜组的配置同步至 Feature 默认值</li>
                                <li>下线实验并释放流量层占用</li>
                                <li>所有新旧用户均生效新默认方案</li>
                            </ul>
                            <Alert
                                message="实验与固化已同步：可在结束实验时直接触发决策固化，或在 Feature 页固化时自动结束实验。"
                                type="success"
                                showIcon
                                style={{
                                    marginTop: 10,
                                    backgroundColor: '#f6ffed',
                                    border: '1px solid #b7eb8f'
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* A/B Testing Basics Section */}
            <Title level={2} id="basics"><PartitionOutlined /> A/B 测试核心基础知识</Title>
            <Row gutter={24} style={{ marginBottom: 40 }}>
                <Col span={12}>
                    <Card title="1. 流量层 (Layer) 与 哈希 (Hashing)" hoverable>
                        <div style={{ padding: '0 10px' }}>
                            <Paragraph strong>流量层：像并行的“赛道”</Paragraph>
                            <Paragraph type="secondary" style={{ fontSize: 13, marginTop: -10 }}>
                                想象每层楼都有完整的 100% 用户。UI层和算法层互不干涉，用户可以同时参加两边的实验。
                            </Paragraph>
                        </div>

                        <div style={{ height: 160, background: '#fafafa', borderRadius: 8, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                <Badge status="processing" text="用户 (UID)" />
                                <div style={{ flex: 1, height: 2, background: 'linear-gradient(to right, #1677ff, #52c41a)', margin: '0 15px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: -20, left: '30%', fontSize: 10, color: '#999' }}>Hash(UID + Salt)</div>
                                </div>
                                <Tag color="blue">分桶 (0-99)</Tag>
                            </div>
                            <div style={{ display: 'flex', gap: 2 }}>
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        height: 24,
                                        background: i < 8 ? '#1677ff' : '#f0f0f0',
                                        borderRadius: 2,
                                        opacity: i === 7 ? 0.6 : 1
                                    }} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>实验 A 占用 40% (0-39号桶)</Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>剩余 60%</Text>
                            </div>
                        </div>

                        <ul style={{ marginTop: 15, paddingLeft: 20, fontSize: 13, color: '#666' }}>
                            <li><Text strong>确定性</Text>：同一用户在同一层，永远命中同一个桶。</li>
                            <li><Text strong>独立性</Text>：不同层使用不同“盐值”，用户在各层间的分布是随机打散的，互不污染。</li>
                        </ul>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="2. 正交与互斥" hoverable style={{ height: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <Alert
                                icon={<SafetyOutlined />}
                                message="互斥 (同层)"
                                description="实验 A 和 B 在同一层。用户进了 A，就绝对进不了 B。"
                                type="info"
                                showIcon
                            />
                            <Alert
                                icon={<DeploymentUnitOutlined />}
                                message="正交 (跨层)"
                                description="实验 A 在 UI 层，实验 C 在 算法层。用户可以同时命中 A 和 C，互不干扰。"
                                type="success"
                                showIcon
                            />
                        </div>
                        <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid #f0f0f0' }}>
                            <Text strong size="small" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>配置建议：</Text>
                            <ul style={{ paddingLeft: 18, fontSize: 12, color: '#666', marginBottom: 0 }}>
                                <li><Text strong>互斥</Text>：修改同一个视觉位置（如都在改同一按钮）或影响同一个核心指标时，务必互斥。</li>
                                <li><Text strong>正交</Text>：修改点完全不相关（如 UI 样式 vs 搜索算法）时，可利用正交成倍提升流量利用率。</li>
                            </ul>
                        </div>
                    </Card>
                </Col>
            </Row>


            {/* Traffic Allocation Detail Section */}
            <Title level={2} id="allocation"><MergeCellsOutlined /> 具体流量分配机制</Title>
            <Card style={{ marginBottom: 40, borderLeft: '6px solid #1677ff' }}>
                <Timeline
                    items={[
                        {
                            color: 'blue',
                            children: (
                                <>
                                    <Text strong>预留优先模式</Text>
                                    <Paragraph type="secondary">当前不具备数据闭环能力，采用简单分配方式满足业务侧需求。配置某流量层 40% 流量后，系统会立即锁定该比例。不随实际进入人数波动，防止后来实验无法算清可用额度。</Paragraph>
                                </>
                            ),
                        },
                        {
                            color: 'blue',
                            children: (
                                <>
                                    <Text strong>两步命中策略 (Layer Filter & Audience Filter)</Text>
                                    <Paragraph type="secondary">
                                        1. 用户必须落在实验占据的哈希桶位内（流量命中）。<br />
                                        2. 用户必须满足人群标签判定（人群命中）。<br />
                                        <Text type="danger" style={{ fontSize: 12 }}>* 如果人群极窄导致流量用不满，多余流量不会自动释放给同层其他实验，保持确定性。</Text>
                                    </Paragraph>
                                </>
                            ),
                        },
                        {
                            color: 'green',
                            children: (
                                <>
                                    <Text strong>高灵活性：流量回收与打散</Text>
                                    <Paragraph type="secondary">
                                        调低进行中实验流量会立刻释放“空闲流量”供其他实验使用。且每层具备独立 Salt，确保不同层间的流量分布逻辑上完全独立（打散效应）。
                                    </Paragraph>
                                </>
                            ),
                        },
                    ]}
                />

                <div style={{ marginTop: 20, padding: 20, background: '#f9f9f9', borderRadius: 8 }}>
                    <Title level={5}>典型分配案例：</Title>
                    <Paragraph>
                        若 Layer 剩余 40% 流量，实验 B 申请 30%。系统校验成功并预留。
                        哪怕 B 的人群设为“仅 iOS 且 上海”，实验 B 依然占据了该层 30% 的绝对坑位，安卓用户虽然命中该桶位但因人群不符会被下发默认值，而非被分给同层其他在线实验。
                    </Paragraph>
                </div>
            </Card>

            {/* System Relationship Section */}
            <Title level={2} id="relationship"><DeploymentUnitOutlined /> 核心模块协同关系</Title>
            <Card style={{ marginBottom: 40, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Paragraph>
                    为了实现高效的配置分发，系统被划分为三个核心协作层级：
                </Paragraph>
                <Table
                    pagination={false}
                    bordered
                    dataSource={[
                        {
                            key: '1',
                            module: 'Feature 模块',
                            responsibility: '功能定义与配置。负责 Feature 的生命周期管理（创建、默认值、历史版本、全量切流）。',
                            example: '“首页瀑布流”功能是否存在？默认颜色是什么？',
                            icon: <SafetyOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                        },
                        {
                            key: '2',
                            module: 'AB 测试模块',
                            responsibility: '策略逻辑与分流。负责人群抽样算法 (Hashing)、实验分组规则、实验状态流转。',
                            example: '将 5% 的用户命中实验组 A，5% 命中实验组 B，剩余用户不命中。',
                            icon: <ExperimentOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                        },
                        {
                            key: '3',
                            module: '下发/路由模块',
                            responsibility: '执行与最终分发。根据 UID 以及上下文信息，动态查询 AB 策略或灰度策略并匹配 Feature 配置，产生最终结果。Feature 模块和 AB 测试模块都会用到下发',
                            example: 'UID:123 经过 Hash 命中实验组 B → 匹配该组绑定的实验值 → 返回配置: color: red；某些 Feature 需要按一定时间节奏或者人群节奏来逐步下发等',
                            icon: <DeploymentUnitOutlined style={{ color: '#722ed1', fontSize: 20 }} />
                        }
                    ]}
                    columns={[
                        {
                            title: '系统模块',
                            dataIndex: 'module',
                            key: 'module',
                            width: 220,
                            render: (text, record) => (
                                <Space>
                                    {record.icon}
                                    <Text strong>{text}</Text>
                                </Space>
                            )
                        },
                        {
                            title: '核心职责',
                            dataIndex: 'responsibility',
                            key: 'responsibility',
                            render: (text) => <Text style={{ fontSize: 13 }}>{text}</Text>
                        },
                        {
                            title: '典型举例',
                            dataIndex: 'example',
                            key: 'example',
                            render: (text) => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text>
                        }
                    ]}
                />

                <div style={{ marginTop: 40, padding: '32px', background: '#f5f7fa', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                    <Title level={5} style={{ textAlign: 'center', marginBottom: 32 }}>下发决策工作流</Title>
                    <Row align="middle" justify="center" gutter={32}>
                        <Col span={7}>
                            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                                <Card size="small" style={{ textAlign: 'center' }}>
                                    <Badge status="processing" offset={[10, 0]} color="#1677ff" />
                                    <AppstoreOutlined style={{ fontSize: 24, display: 'block', margin: '0 auto 8px', color: '#1677ff' }} />
                                    <Text strong>Feature 模块</Text>
                                    <div style={{ fontSize: 11, color: '#888' }}>定义默认值 / 灰度比例</div>
                                </Card>
                                <Card size="small" style={{ textAlign: 'center' }}>
                                    <Badge status="processing" offset={[10, 0]} color="#52c41a" />
                                    <ExperimentOutlined style={{ fontSize: 24, display: 'block', margin: '0 auto 8px', color: '#52c41a' }} />
                                    <Text strong>AB 测试模块</Text>
                                    <div style={{ fontSize: 11, color: '#888' }}>定义实验分组策略</div>
                                </Card>
                            </Space>
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                                <ArrowRightOutlined style={{ fontSize: 20, color: '#ccc' }} />
                                <ArrowRightOutlined style={{ fontSize: 20, color: '#ccc' }} />
                            </div>
                        </Col>
                        <Col span={8}>
                            <Card style={{ textAlign: 'center', border: '2px solid #722ed1', background: '#f9f0ff', padding: '10px 0' }}>
                                <DeploymentUnitOutlined style={{ fontSize: 40, display: 'block', margin: '0 auto 12px', color: '#722ed1' }} />
                                <Text strong style={{ fontSize: 16 }}>路由/下发模块 (Router)</Text>
                                <div style={{ fontSize: 12, color: '#722ed1', marginTop: 8 }}>「最终执行与决策中枢」</div>
                            </Card>
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>
                            <ArrowRightOutlined style={{ fontSize: 20, color: '#ccc' }} />
                        </Col>
                        <Col span={5}>
                            <Card size="small" style={{ textAlign: 'center', background: '#fff' }}>
                                <CheckCircleOutlined style={{ fontSize: 24, display: 'block', margin: '0 auto 8px', color: '#52c41a' }} />
                                <Text strong>最终配置值</Text>
                                <div style={{ fontSize: 11, color: '#888' }}>下发给端侧/业务</div>
                            </Card>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Space direction="vertical" size={12}>
                            <Text type="secondary" style={{ fontSize: 12 }}>分步决策路径：</Text>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <Tag color="blue" bordered={false}>路径 A：Request ➔ 直接匹配 Feature 灰度/默认值 ➔ 下发</Tag>
                                <Tag color="green" bordered={false}>路径 B：Request ➔ 匹配 AB 策略分桶 ➔ 提取绑定配置 ➔ 下发</Tag>
                            </div>
                        </Space>
                    </div>
                </div>
            </Card>

            <Divider />

            <div style={{ textAlign: 'center', paddingBottom: 40 }}>
                <Paragraph type="secondary">
                    如有开发或测试疑问，请咨询 A/B 平台架构组
                </Paragraph>
            </div>
        </div>
    );
};

export default Introduction;
