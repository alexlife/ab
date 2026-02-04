import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import ExperimentList from './pages/ExperimentList';
import CreateExperiment from './pages/CreateExperiment';
import FeatureManagement from './pages/FeatureManagement';

const App = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/experiments" replace />} />
            <Route path="experiments" element={<ExperimentList />} />
            <Route path="experiments/create" element={<CreateExperiment />} />
            <Route path="experiments/:id" element={<CreateExperiment />} />
            <Route path="features" element={<FeatureManagement />} />
            <Route path="*" element={<div style={{ padding: 20 }}>页面未找到</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
