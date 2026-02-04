const FEATURE_KEY = 'ab_platform_features_v5';
const EXPERIMENT_KEY = 'ab_platform_experiments_v5';

// Initial Mock Data
const DEFAULT_FEATURES = [
    {
        id: 'feat_btn_style',
        name: '主底按钮样式',
        key: 'main_button_style',
        isSolidified: false,
        defaultVariationId: null,
        variations: [
            {
                id: 'var_blue_large',
                name: '主底蓝色大字体按钮',
                content: { params: [{ key: 'btn_color', type: 'string', value: '#1677ff' }], courses: [] }
            },
            {
                id: 'var_green_mid',
                name: '主底绿色中字体按钮',
                content: { params: [{ key: 'btn_color', type: 'string', value: '#52c41a' }], courses: [] }
            }
        ]
    },
    {
        id: 'feat_onboarding',
        name: '新用户引导弹窗',
        key: 'onboarding_popup',
        isSolidified: false,
        defaultVariationId: null,
        variations: [
            { id: 'var_popup_a', name: '引导 A', content: { params: [], courses: [] } },
            { id: 'var_popup_b', name: '引导 B', content: { params: [], courses: [] } }
        ]
    },
    {
        id: 'feat_lesson_a',
        name: 'A关教学课程',
        key: 'lesson_a_teaching',
        isSolidified: false,
        defaultVariationId: null,
        variations: [
            { id: 'var_teacher_v', name: '增加虚拟教师', content: { params: [], courses: [] } },
            { id: 'var_teacher_n', name: '普通模式', content: { params: [], courses: [] } }
        ]
    },
    {
        id: 'feat_search',
        name: '全局搜索框',
        key: 'global_search',
        isSolidified: false,
        defaultVariationId: null,
        variations: [
            { id: 'var_s1', name: '顶栏居中', content: { params: [], courses: [] } },
            { id: 'var_s2', name: '侧边栏', content: { params: [], courses: [] } }
        ]
    }
];

const DEFAULT_EXPERIMENTS = [
    {
        id: 'exp_1',
        name: '首页 Banner CTR 测试',
        featureId: 'feat_btn_style',
        status: '进行中',
        layerId: 'layer_1',
        layerTrafficShare: 30,
        owner: 'Alex Smith',
        startTime: '2026-01-10 10:00',
        groups: [
            { id: 1, name: '对照组', ratio: 50, isControl: true, description: '原蓝底样式', whitelist: '', variationId: 'var_blue_large' },
            { id: 2, name: '实验组 1', ratio: 50, isControl: false, description: '新绿底样式', whitelist: '12345,67890', variationId: 'var_green_mid' }
        ]
    },
    {
        id: 'exp_5',
        name: '全局底色灰度测试',
        featureId: 'feat_search',
        status: '进行中',
        layerId: 'layer_1',
        layerTrafficShare: 40,
        owner: 'John Doe',
        startTime: '2026-01-15 11:30',
        groups: [
            { id: 1, name: '对照组', ratio: 100, isControl: true, description: '基准组', whitelist: '', variationId: 'var_s1' }
        ]
    },
    {
        id: 'exp_2',
        name: '新用户引导流程优化',
        featureId: 'feat_onboarding',
        status: '草稿',
        layerId: 'layer_2',
        layerTrafficShare: 50,
        owner: 'Sarah Jones',
        startTime: '-',
        groups: [
            { id: 1, name: '对照组', ratio: 50, isControl: true, description: '现有引导', whitelist: '', variationId: 'var_popup_a' },
            { id: 2, name: '策略 A', ratio: 50, isControl: false, description: '简化版流程', whitelist: '', variationId: 'var_popup_b' }
        ]
    },
    {
        id: 'exp_4',
        name: 'A关增加虚拟教师',
        featureId: 'feat_lesson_a',
        status: '已结束',
        layerId: 'layer_3',
        layerTrafficShare: 100,
        owner: 'Yubo',
        startTime: '2026-01-20 10:00',
        endTime: '2026-02-01 10:00',
        groups: [
            { id: 1, name: '对照组', ratio: 50, isControl: true, description: '无老师', whitelist: '', variationId: 'var_teacher_n' },
            { id: 2, name: '老师组', ratio: 50, isControl: false, description: '带老师引导', whitelist: '', variationId: 'var_teacher_v' }
        ]
    }
];

// Feature Helpers
export const getFeatures = () => {
    const data = localStorage.getItem(FEATURE_KEY);
    return data ? JSON.parse(data) : DEFAULT_FEATURES;
};

export const saveFeatures = (features) => {
    localStorage.setItem(FEATURE_KEY, JSON.stringify(features));
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

// Experiment Helpers
export const getExperiments = () => {
    const data = localStorage.getItem(EXPERIMENT_KEY);
    return data ? JSON.parse(data) : DEFAULT_EXPERIMENTS;
};

export const saveExperiments = (exps) => {
    localStorage.setItem(EXPERIMENT_KEY, JSON.stringify(exps));
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
