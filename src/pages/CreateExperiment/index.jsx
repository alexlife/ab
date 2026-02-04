import React, { useState, useEffect } from 'react';
import { Steps, Button, message, Layout, theme } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Strategy from './Step2Strategy';
import Step3Grouping from './Step3Grouping';
import { addExperiment, getExperiments, updateExperiment } from '../../store/mockStore';

const { Content } = Layout;

const CreateExperiment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
                setFormData(exp);
            }
        }
    }, [id]);

    const isReadOnly = formData.status === '已结束';
    const isOngoing = formData.status === '进行中';

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const done = () => {
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

        if (id) {
            updateExperiment(formData);
            message.success('实验保存成功！');
        } else {
            const newExp = {
                id: `exp_${Date.now()}`,
                ...formData,
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
                        {isReadOnly ? '完成' : (id ? '保存修改' : '创建实验')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CreateExperiment;
