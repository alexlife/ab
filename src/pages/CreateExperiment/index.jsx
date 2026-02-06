import React, { useState, useEffect } from 'react';
import { Steps, Button, message, Layout, theme } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Strategy from './Step2Strategy';
import Step3Grouping from './Step3Grouping';
import { addExperiment, getExperiments, updateExperiment } from '../../store/mockStore';

const { Content } = Layout;

const CreateExperiment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        owner: '',
        description: '',
        startTime: null,
        featureId: undefined,

        // Strategy
        layerId: undefined,
        totalTraffic: 0,
        audience: [],

        // Grouping
        groups: [
            { id: 1, name: '对照组', ratio: 50, isControl: true, description: '', whitelist: '', variationId: undefined },
            { id: 2, name: '实验组 1', ratio: 50, isControl: false, description: '', whitelist: '', variationId: undefined }
        ]
    });

    useEffect(() => {
        if (id) {
            const experiments = getExperiments();
            const exp = experiments.find(e => e.id === id);
            if (exp) {
                // Map store data to form data
                setFormData({
                    ...exp,
                    totalTraffic: exp.layerTrafficShare || 0,
                    audience: exp.audience || []
                });
            }
        } else if (location.state?.featureId) {
            // Pre-fill feature ID if passed from Feature Management
            setFormData(prev => ({ ...prev, featureId: location.state.featureId }));
        }
    }, [id, location.state]);

    const isReadOnly = formData.status === '已结束';
    const isOngoing = formData.status === '进行中';

    const validateStep1 = () => {
        if (!formData.name?.trim()) { message.error('请输入实验名称'); return false; }
        if (!formData.featureId) { message.error('请选择关联 Feature'); return false; }

        // 校验 Feature 是否已被其他实验使用
        const experiments = getExperiments();
        const isFeatureUsed = experiments.some(exp =>
            exp.featureId === formData.featureId &&
            exp.id !== (id || formData.id) // 排除自身
        );

        if (isFeatureUsed) {
            message.error('该 Feature 已被其他实验使用，一个 Feature 只能关联一个实验。');
            return false;
        }

        if (!formData.owner?.trim()) { message.error('请输入负责人'); return false; }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.layerId) { message.error('请选择流量层'); return false; }

        // 逻辑调整：如果是草稿状态，流量占比不能为 0；如果是进行中状态，允许调优至 0（进入“不进新”观察期）
        if (!formData.totalTraffic && !isOngoing) {
            message.error('请输入本实验预占用规模');
            return false;
        }

        if (!formData.audience || formData.audience.length === 0) { message.error('请选择目标人群'); return false; }
        return true;
    };

    const validateStep3 = () => {
        const hasExperimentalGroup = formData.groups.some(g => !g.isControl);
        if (!hasExperimentalGroup) {
            message.error('实验必须包含至少一个实验组 (Variation)');
            return false;
        }

        const totalRatio = formData.groups.reduce((sum, g) => sum + (g.ratio || 0), 0);
        if (formData.groups.length > 20) {
            message.error('单个实验的分组总数不能超过 20 个');
            return false;
        }
        if (totalRatio !== 100) {
            message.error(`各实验组流量总和必须为 100%，当前为 ${totalRatio}%`);
            return false;
        }

        for (const group of formData.groups) {
            if (!group.variationId) {
                message.error(`分组 "${group.name}" 未绑定实验值`);
                return false;
            }
        }
        return true;
    };

    const next = () => {
        if (current === 0) {
            if (!validateStep1()) return;
        } else if (current === 1) {
            if (!validateStep2()) return;
        }
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const done = () => {
        // Step 1 Validation (Again to prevent concurrency issues)
        if (!validateStep1()) return;

        // Step 3 Validation
        if (!validateStep3()) return;

        // 校验白名单 UID 是否在不同分组间重复
        const uidMap = new Map(); // uid -> groupName
        let duplicateUid = null;
        let duplicateGroups = [];

        for (const group of formData.groups) {
            if (!group.whitelist) continue;

            // 解析所有 UID，支持逗号、换行或空格分隔
            const uids = group.whitelist.split(/[,\n\s]+/).map(u => u.trim()).filter(u => u !== '');

            for (const uid of uids) {
                if (uidMap.has(uid)) {
                    duplicateUid = uid;
                    duplicateGroups = [uidMap.get(uid), group.name];
                    break;
                }
                uidMap.set(uid, group.name);
            }
            if (duplicateUid) break;
        }

        if (duplicateUid) {
            message.error(`相同 UID 不能出现在不同分组！具体 UID: ${duplicateUid} (出现在 ${duplicateGroups.join(' 和 ')})`);
            return;
        }

        const experimentToSave = {
            ...formData,
            layerTrafficShare: formData.totalTraffic
        };

        if (id) {
            updateExperiment(experimentToSave);
            message.success('实验保存成功！');
        } else {
            const newExp = {
                id: `exp_${Date.now()}`,
                ...experimentToSave,
                status: '草稿'
            };
            addExperiment(newExp);
            message.success('实验创建成功！');
        }
        navigate('/experiments');
    };

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    const steps = [
        {
            title: '基本信息',
            description: '名称与负责人',
            content: <Step1BasicInfo data={formData} updateData={updateFormData} isReadOnly={isReadOnly} isOngoing={isOngoing} />,
        },
        {
            title: '生效策略',
            description: '流量与人群',
            content: <Step2Strategy data={formData} updateData={updateFormData} isReadOnly={isReadOnly} isOngoing={isOngoing} />,
        },
        {
            title: '实验分组',
            description: '分配与配置',
            content: <Step3Grouping data={formData} updateData={updateFormData} isReadOnly={isReadOnly} isOngoing={isOngoing} />,
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title, description: item.description }));

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Steps current={current} items={items} style={{ marginBottom: 24, padding: '0 40px' }} />
            <div style={{
                minHeight: '400px',
                backgroundColor: token.colorFillAlter,
                borderRadius: token.borderRadiusLG,
                border: `1px dashed ${token.colorBorder}`,
                padding: '40px',
                marginBottom: 24
            }}>
                {steps[current].content}
            </div>
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => navigate('/experiments')} style={{ marginRight: 8 }}>
                    {isReadOnly ? '返回列表' : '取消并返回'}
                </Button>
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={isReadOnly ? () => navigate('/experiments') : () => done()}
                    >
                        {isReadOnly ? '确定' : (id ? '保存修改' : '创建实验')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CreateExperiment;
