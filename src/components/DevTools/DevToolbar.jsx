import React from 'react';
import { Switch, Typography, Button, Tooltip, message } from 'antd';
import { ReadOutlined, RotateLeftOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useSpec } from '../../contexts/SpecContext';
import { initializeData } from '../../store/mockStore';

const { Text } = Typography;

const DevToolbar = () => {
    const { showSpecs, toggleSpecs } = useSpec();

    const handleReset = () => {
        initializeData();
        message.success('数据已重置为全状态演示模式');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100, // Above content, below Drawer if mask is needed (but mask is false)
            background: 'rgba(28, 28, 28, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: '4px 12px',
            borderRadius: 32,
            boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            animation: 'fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        }}>
            {/* Spec Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: showSpecs ? 'rgba(22, 119, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                }}>
                    <ReadOutlined style={{ color: showSpecs ? '#1677ff' : '#8c8c8c', fontSize: 16 }} />
                </div>
                <Text style={{ color: '#e8e8e8', fontSize: 13, fontWeight: 500 }}>显示需求标注</Text>
                <Switch
                    id="dev-specs-switch"
                    size="small"
                    checked={showSpecs}
                    onChange={toggleSpecs}
                />
            </div>

            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)' }} />

            {/* Reset Action */}
            <Tooltip title="将 Mock 数据重置为包含所有状态的演示集">
                <Button
                    type="text"
                    size="small"
                    icon={<RotateLeftOutlined style={{ fontSize: 15 }} />}
                    onClick={handleReset}
                    style={{
                        color: '#d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 8px',
                        borderRadius: 6
                    }}
                >
                    初始化数据 (All States)
                </Button>
            </Tooltip>

            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translate(-50%, 20px); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                `}
            </style>
        </div>
    );
};

export default DevToolbar;
