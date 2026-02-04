import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Typography, Alert } from 'antd';
import { getFeatures, getExperiments } from '../../store/mockStore';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

const Step1BasicInfo = ({ data, updateData, isReadOnly, isOngoing }) => {
    const readOnly = isReadOnly || isOngoing;
    const [availableFeatures, setAvailableFeatures] = useState([]);
    const location = useLocation();

    const isValidDate = (dateStr) => {
        if (!dateStr || dateStr === '-') return false;
        try {
            const d = dayjs(dateStr);
            return d.isValid();
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        const allFeatures = getFeatures();
        const allExps = getExperiments();

        // Rule: One Feature can only be associated with one experiment.
        // Filter out features that already have an associated experiment.
        const usedFeatureIds = allExps.map(exp => exp.featureId);

        // If we are editing or have a pre-filled feature from state, we should keep it in the list if it matches data.featureId
        const filtered = allFeatures.filter(f => {
            if (f.id === data.featureId) return true; // Keep currently selected
            return !usedFeatureIds.includes(f.id) && !f.isSolidified;
        });

        setAvailableFeatures(filtered);

        // Handle pre-filled featureId from URL state
        if (location.state?.featureId && !data.featureId) {
            updateData('featureId', location.state.featureId);
        }
    }, [location.state, data.featureId, updateData]);

    return (
        <Form layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }} disabled={readOnly}>
            <Form.Item label="实验名称" required>
                <Input
                    placeholder="请输入实验名称"
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    size="large"
                    disabled={readOnly}
                />
            </Form.Item>

            <Form.Item
                label="关联 Feature"
                required
                extra="遵循“一个 Feature 只能关联一个实验”原则。已关联实验或已固化的 Feature 将不在列表中显示。"
            >
                <Select
                    placeholder="请选择 Feature"
                    value={data.featureId}
                    onChange={(val) => updateData('featureId', val)}
                    options={availableFeatures.map(f => ({ label: f.name, value: f.id }))}
                    size="large"
                    disabled={readOnly || !!data.id}
                />
            </Form.Item>

            {availableFeatures.length === 0 && (
                <Alert message="暂无可用 Feature" description="所有 Feature 都已关联实验或已固化，请先去 Feature 列表创建新项目。" type="warning" showIcon style={{ marginBottom: 24 }} />
            )}

            <Form.Item label="负责人" required>
                <Input
                    placeholder="请输入负责人姓名"
                    value={data.owner}
                    onChange={(e) => updateData('owner', e.target.value)}
                    size="large"
                    disabled={readOnly}
                />
            </Form.Item>

            <Form.Item label="开始时间">
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="选择开始日期和时间"
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    size="large"
                    value={isValidDate(data.startTime) ? dayjs(data.startTime) : null}
                    onChange={(date, dateString) => updateData('startTime', dateString)}
                    disabled={readOnly}
                />
            </Form.Item>

            <Form.Item label="实验描述">
                <TextArea
                    rows={4}
                    placeholder="简述实验的目标和背景"
                    value={data.description}
                    onChange={(e) => updateData('description', e.target.value)}
                    disabled={readOnly}
                />
            </Form.Item>
        </Form>
    );
};

export default Step1BasicInfo;
