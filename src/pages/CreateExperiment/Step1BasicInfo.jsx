import React from 'react';
import { Form, Input, DatePicker, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const Step1BasicInfo = ({ data, updateData }) => {
    return (
        <Form layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }}>
            <Form.Item label="实验名称" required tooltip="实验的唯一标识名称">
                <Input
                    placeholder="例如：首页 Banner 改版 V2"
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                />
            </Form.Item>
            <Form.Item label="负责人" required>
                <Input
                    placeholder="请输入负责人姓名"
                    value={data.owner}
                    onChange={(e) => updateData('owner', e.target.value)}
                />
            </Form.Item>
            <Form.Item label="开始时间" required>
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="选择开始日期和时间"
                    showTime
                    onChange={(date, dateString) => updateData('startTime', dateString)}
                />
            </Form.Item>
            <Form.Item label="实验描述">
                <TextArea
                    rows={4}
                    placeholder="描述实验假设和目标..."
                    value={data.description}
                    onChange={(e) => updateData('description', e.target.value)}
                />
            </Form.Item>
        </Form>
    );
};

export default Step1BasicInfo;
