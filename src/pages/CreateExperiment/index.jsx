import React, { useState } from 'react';
import { Steps, Button, message, Layout, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Strategy from './Step2Strategy';
import Step3Grouping from './Step3Grouping';

const { Content } = Layout;

const CreateExperiment = () => {
    const [current, setCurrent] = useState(0);
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        owner: '',
        description: '',
        startTime: null,

        // Strategy
        layer: '流量层 A',
        isOrthogonal: true,
        mutexLayer: null,
        totalTraffic: 10,
        audience: [],

        // Grouping
        groups: [
            { id: 1, name: '对照组', ratio: 50, isControl: true, description: '', whitelist: '', config: [], courses: [] },
            { id: 2, name: '实验组 1', ratio: 50, isControl: false, description: '', whitelist: '', config: [], courses: [] }
        ]
    });

    const navigate = useNavigate();
    const { token } = theme.useToken();

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const done = () => {
        message.success('实验创建成功！');
        navigate('/experiments');
    };

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    const steps = [
        {
            title: '基本信息',
            description: '名称与负责人',
            content: <Step1BasicInfo data={formData} updateData={updateFormData} />,
        },
        {
            title: '生效策略',
            description: '流量与人群',
            content: <Step2Strategy data={formData} updateData={updateFormData} />,
        },
        {
            title: '实验分组',
            description: '分配与配置',
            content: <Step3Grouping data={formData} updateData={updateFormData} />,
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
                    <Button type="primary" onClick={() => done()}>
                        创建实验
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CreateExperiment;
