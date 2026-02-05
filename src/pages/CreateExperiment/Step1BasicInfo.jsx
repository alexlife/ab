import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Alert } from 'antd';
import dayjs from 'dayjs';
import { getFeatures, getExperiments } from '../../store/mockStore';
import SpecOverlay from '../../components/DevTools/SpecOverlay';

const { TextArea } = Input;

const isValidDate = (date) => date && dayjs(date).isValid();

const Step1BasicInfo = ({ data, updateData, isReadOnly, isOngoing }) => {
    const readOnly = isReadOnly;
    const [availableFeatures, setAvailableFeatures] = useState([]);

    useEffect(() => {
        setFeatures(getFeatures());
    }, [data.id, data.featureId]); // Add dependencies to re-validate if ID changes

    const setFeatures = (feats) => {
        // Filter: show if not locked (not ongoing/ended experiment) OR if it is the one currently selected
        // AND not solidified (unless it's the current one)
        // AND not associated with ANOTHER experiment

        const experiments = getExperiments();
        const usedFeatureIds = new Set();

        experiments.forEach(exp => {
            // If this is the current experiment (editing), ignore it
            if (exp.id === data.id) return;
            if (exp.featureId) {
                usedFeatureIds.add(exp.featureId);
            }
        });

        const displayed = feats.filter(f => {
            // If this feature is already selected by THIS experiment, show it.
            if (f.id === data.featureId) return true;

            // If solidified, hide
            if (f.isSolidified) return false;

            // If associated with another experiment, hide
            if (usedFeatureIds.has(f.id)) return false;

            return true;
        });
        setAvailableFeatures(displayed);
    }

    return (
        <Form layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }} disabled={readOnly}>
            <SpecOverlay specId="rule_basic_required">
                <Form.Item label="实验名称" required>
                    <Input
                        id="name"
                        placeholder="请输入实验名称"
                        value={data.name}
                        onChange={(e) => updateData('name', e.target.value)}
                        size="large"
                        disabled={readOnly}
                    />
                </Form.Item>
            </SpecOverlay>

            <SpecOverlay specId="rule_feature_bind">
                <Form.Item
                    label="关联 Feature"
                    required
                    extra="遵循“一个 Feature 只能关联一个实验”原则。已关联实验或已固化的 Feature 将不在列表中显示。"
                >
                    <Select
                        id="featureId"
                        placeholder="请选择 Feature"
                        value={data.featureId}
                        onChange={(val) => updateData('featureId', val)}
                        options={availableFeatures.map(f => ({ label: f.name, value: f.id }))}
                        size="large"
                        disabled={readOnly || !!data.id}
                    />
                </Form.Item>
            </SpecOverlay>

            {availableFeatures.length === 0 && (
                <Alert message="暂无可用 Feature" description="所有 Feature 都已关联实验或已固化，请先去 Feature 列表创建新项目。" type="warning" showIcon style={{ marginBottom: 24 }} />
            )}

            <SpecOverlay specId="rule_basic_required">
                <Form.Item label="负责人" required>
                    <Input
                        id="owner"
                        placeholder="请输入负责人姓名"
                        value={data.owner}
                        onChange={(e) => updateData('owner', e.target.value)}
                        size="large"
                        disabled={readOnly}
                    />
                </Form.Item>
            </SpecOverlay>

            <Form.Item label="开始时间">
                <DatePicker
                    id="startTime"
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
                    id="description"
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
