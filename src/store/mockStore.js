const FEATURE_KEY = 'ab_platform_features_v6';
const EXPERIMENT_KEY = 'ab_platform_experiments_v6';

const INITIAL_DATA = {
    features: [
        {
            id: 'feat_1',
            name: '主底按钮颜色',
            key: 'main_btn_color',
            isSolidified: false,
            defaultVariationId: null,
            variations: [
                { id: 'v1', name: '蓝色大底', content: { params: [{ key: 'color', value: 'blue', type: 'string' }], courses: [] } },
                { id: 'v2', name: '绿色中底', content: { params: [{ key: 'color', value: 'green', type: 'string' }], courses: [] } }
            ]
        },
        {
            id: 'feat_2',
            name: '新用户引导流程',
            key: 'new_user_guide',
            isSolidified: false,
            defaultVariationId: null,
            variations: [
                { id: 'v1', name: '方案 A', content: { params: [{ key: 'steps', value: 3, type: 'number' }, { key: 'theme', value: 'light', type: 'string' }], courses: [] } },
                { id: 'v2', name: '方案 B', content: { params: [{ key: 'steps', value: 5, type: 'number' }, { key: 'theme', value: 'dark', type: 'string' }], courses: [] } }
            ]
        },
        {
            id: 'feat_3',
            name: '详情页改版',
            key: 'detail_page_v2',
            isSolidified: true,
            defaultVariationId: 'v1',
            variations: [
                { id: 'v1', name: '新版布局', content: { params: [{ key: 'layout', value: 'grid', type: 'string' }, { key: 'show_reviews', value: true, type: 'boolean' }], courses: [] } },
                { id: 'v2', name: '旧版对照', content: { params: [{ key: 'layout', value: 'list', type: 'string' }, { key: 'show_reviews', value: false, type: 'boolean' }], courses: [] } }
            ]
        },
        {
            id: 'feat_4',
            name: '课程推荐算法',
            key: 'recommend_algo',
            isSolidified: false,
            defaultVariationId: null,
            variations: [
                { id: 'v1', name: '协同过滤', content: { params: [{ key: 'algo', value: 'collaboration', type: 'string' }, { key: 'limit', value: 10, type: 'number' }], courses: [] } },
                { id: 'v2', name: '深度学习', content: { params: [{ key: 'algo', value: 'deep_learning', type: 'string' }, { key: 'limit', value: 20, type: 'number' }], courses: [] } }
            ]
        },
        {
            id: 'feat_5',
            name: '支付成功页卡片',
            key: 'pay_success_card',
            isSolidified: false,
            defaultVariationId: null,
            variations: [
                { id: 'v1', name: '运营活动 A', content: { params: [{ key: 'banner', value: 'activity_red.png', type: 'string' }, { key: 'discount', value: 0.8, type: 'number' }], courses: [] } },
                { id: 'v2', name: '静态文案', content: { params: [{ key: 'banner', value: 'default_welcome.png', type: 'string' }, { key: 'discount', value: 1.0, type: 'number' }], courses: [] } }
            ]
        },
        {
            id: 'feat_6',
            name: '支付按钮吸底样式',
            key: 'pay_btn_style',
            isSolidified: false,
            defaultVariationId: null,
            variations: [
                { id: 'v1', name: '呼吸灯效果', content: { params: [{ key: 'animation', value: 'pulse', type: 'string' }, { key: 'duration', value: 1.2, type: 'number' }], courses: [] } },
                { id: 'v2', name: '正常样式', content: { params: [{ key: 'animation', value: 'none', type: 'string' }, { key: 'duration', value: 0, type: 'number' }], courses: [] } }
            ]
        }
    ],
    experiments: [
        {
            id: 'exp_1',
            name: '首页 Banner 颜色测试',
            featureId: 'feat_1',
            status: '进行中',
            layerId: 'layer_1',
            layerTrafficShare: 50,
            audience: ['新用户', 'iOS'],
            owner: '张伟',
            startTime: '2026-02-01 10:00',
            groups: [
                { id: 1, name: '对照组', ratio: 50, isControl: true, variationId: 'v1' },
                { id: 2, name: '实验组', ratio: 50, isControl: false, variationId: 'v2' }
            ]
        },
        {
            id: 'exp_2',
            name: '引导流程优化实验',
            featureId: 'feat_2',
            status: '已结束',
            layerId: 'layer_2',
            layerTrafficShare: 100,
            audience: ['全量用户'],
            owner: '李娜',
            startTime: '2026-01-01 10:00',
            endTime: '2026-01-15 10:00',
            groups: [
                { id: 1, name: '对照组', ratio: 50, isControl: true, variationId: 'v1' },
                { id: 2, name: '优化方案 B', ratio: 50, isControl: false, variationId: 'v2' }
            ]
        },
        {
            id: 'exp_3',
            name: '推荐算法初步探索',
            featureId: 'feat_4',
            status: '草稿',
            layerId: 'layer_1',
            layerTrafficShare: 20,
            audience: ['Android', '高活跃用户'],
            owner: '王强',
            startTime: '-',
            groups: [
                { id: 1, name: '对照组', ratio: 50, isControl: true, variationId: 'v1' },
                { id: 2, name: '深度学习实验组', ratio: 50, isControl: false, variationId: 'v2' }
            ]
        },
        {
            id: 'exp_4',
            name: '详情页改版实验',
            featureId: 'feat_3',
            status: '已结束',
            layerId: 'layer_3',
            layerTrafficShare: 50,
            audience: ['全量用户'],
            owner: '陈静',
            startTime: '2025-12-01 09:00',
            endTime: '2025-12-20 18:00',
            groups: [
                { id: 1, name: '对照组', ratio: 50, isControl: true, variationId: 'v2' },
                { id: 2, name: '实验组', ratio: 50, isControl: false, variationId: 'v1' }
            ]
        },
        {
            id: 'exp_5',
            name: '支付按钮样式存量灰度',
            featureId: 'feat_6',
            status: '进行中',
            layerId: 'layer_3',
            layerTrafficShare: 0,
            audience: ['付费用户'],
            owner: '周博',
            startTime: '2026-02-04 15:00',
            groups: [
                { id: 1, name: '对照组', ratio: 50, isControl: true, variationId: 'v2' },
                { id: 2, name: '实验组', ratio: 50, isControl: false, variationId: 'v1' }
            ]
        }
    ]
};

export const initializeData = () => {
    localStorage.setItem(FEATURE_KEY, JSON.stringify(INITIAL_DATA.features));
    localStorage.setItem(EXPERIMENT_KEY, JSON.stringify(INITIAL_DATA.experiments));
    window.dispatchEvent(new Event('ab_store_updated'));
};

export const getFeatures = () => {
    const data = localStorage.getItem(FEATURE_KEY);
    return data ? JSON.parse(data) : INITIAL_DATA.features;
};

export const saveFeatures = (features) => {
    localStorage.setItem(FEATURE_KEY, JSON.stringify(features));
    window.dispatchEvent(new Event('ab_store_updated'));
};

export const updateFeature = (updatedFeat) => {
    const features = getFeatures();
    const index = features.findIndex(f => f.id === updatedFeat.id);
    if (index !== -1) {
        features[index] = updatedFeat;
        saveFeatures(features);
    }
};

export const addFeature = (feature) => {
    const features = getFeatures();
    features.push(feature);
    saveFeatures(features);
};

export const getExperiments = () => {
    const data = localStorage.getItem(EXPERIMENT_KEY);
    return data ? JSON.parse(data) : INITIAL_DATA.experiments;
};

export const saveExperiments = (exps) => {
    localStorage.setItem(EXPERIMENT_KEY, JSON.stringify(exps));
    window.dispatchEvent(new Event('ab_store_updated'));
};

export const addExperiment = (exp) => {
    const exps = getExperiments();
    exps.push(exp);
    saveExperiments(exps);
};

export const updateExperiment = (updatedExp) => {
    const exps = getExperiments();
    const index = exps.findIndex(e => e.id === updatedExp.id);
    if (index !== -1) {
        exps[index] = updatedExp;
        saveExperiments(exps);
    }
};

export const deleteExperiment = (id) => {
    const exps = getExperiments();
    const filtered = exps.filter(e => e.id !== id);
    saveExperiments(filtered);
};

export const deleteFeature = (id) => {
    const features = getFeatures();
    const filtered = features.filter(f => f.id !== id);
    saveFeatures(filtered);
};
