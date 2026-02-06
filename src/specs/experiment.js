export const EXPERIMENT_SPECS = {
    // --- Basic Info Rules ---
    'rule_basic_required': {
        id: 'rule_basic_required',
        title: '必填项校验',
        content: '实验名称、关联 Feature、负责人均为必填项。实验名称全局唯一。',
        level: 'critical',
        source: 'PRD 2.1 实验基本信息'
    },
    'rule_feature_bind': {
        id: 'rule_feature_bind',
        title: 'Feature 绑定',
        content: '必须关联 Feature 才能进入第三步分组。遵循“一 Feature 一实验”原则。已关联实验或已固化的 Feature 将不在列表中显示。',
        level: 'critical',
        source: 'PRD 2.1 实验基本信息'
    },

    // --- Strategy Rules ---
    'rule_traffic_limit': {
        id: 'rule_traffic_limit',
        title: '流量互斥原则',
        content: '同一流量层内的实验互斥执行，共享该层 100% 的流量槽位。如果预占用规模超过剩余可用流量，输入框需报错提示。',
        level: 'critical',
        source: 'PRD 1. 核心约束原则 / 5.1 故事 02'
    },
    'rule_traffic_range': {
        id: 'rule_traffic_range',
        title: '流量范围约束',
        content: '实验在所属层中占据的流量比例必须在 1-100% 之间。',
        level: 'warning',
        source: 'PRD 2.2 生效策略'
    },
    'rule_audience_lock': {
        id: 'rule_audience_lock',
        title: '状态机-人群筛选规则',
        content: '【进行中】实验禁止修改“人群筛选 (Audience)”。支持同时选择多个人群包，多个人群之间遵循 OR (或) 逻辑，命中其一即生效。',
        level: 'warning',
        source: 'PRD 4. 权限矩阵 / 2.2 生效策略'
    },

    // --- Grouping Rules ---
    'rule_state_permissions': {
        id: 'rule_state_permissions',
        title: '状态机驱动权限',
        content: '【进行中】实验仅允许修改“预占用流量比例”和“分组内部配比”，禁止修改流量层、人群及实验值绑定。',
        level: 'info',
        source: 'PRD 4. 权限矩阵'
    },
    'rule_control_group': {
        id: 'rule_control_group',
        title: '对照组唯一性',
        content: '每个实验必须且仅有一个对照组 (Control Group)。',
        level: 'critical',
        source: 'PRD 2.3 实验分组'
    },
    'rule_experimental_group': {
        id: 'rule_experimental_group',
        title: '实验组必要性',
        content: '每个实验必须至少有一个实验组 (Experimental Group)，否则不构成对比实验。建议将实验组命名为准确描述该次尝试的名称。',
        level: 'critical',
        source: 'PRD 2.3 实验分组'
    },
    'rule_group_ratio_sum': {
        id: 'rule_group_ratio_sum',
        title: '流量闭环原则',
        content: '该组分配到的实验总流量百分比（全组总和需为 100%）。',
        level: 'critical',
        source: 'PRD 2.3 实验分组'
    },
    'rule_whitelist_priority': {
        id: 'rule_whitelist_priority',
        title: '白名单优先级',
        content: '白名单 UID 具备最高优先级，不受人群筛选和流量比例限制，强制进入指定分组。',
        level: 'info',
        source: 'PRD 1. 核心约束原则'
    },
    'rule_uid_unique': {
        id: 'rule_uid_unique',
        title: 'UID 唯一性约束',
        content: '同一实验内，一个 UID 禁止同时出现在多个分组的白名单中，以防分流逻辑冲突。【进行中】允许增删 UID。',
        level: 'critical',
        source: 'PRD 1. 核心约束原则 / 5.1 故事 04'
    },
    'rule_variation_bind': {
        id: 'rule_variation_bind',
        title: '实验值绑定',
        content: '实验分组必须绑定 Feature 下的具体配置方案。允许同一个实验不同组绑定相同实验值。',
        level: 'critical',
        source: 'PRD 2.3 实验分组'
    },

    // --- Feature Rules ---
    'rule_feature_lock': {
        id: 'rule_feature_lock',
        title: 'Feature 状态锁定',
        content: '当关联实验处于【进行中】或【已结束】状态时，禁止编辑 Feature 及其实验值配置。若处于【已固化】状态，则永久只读。',
        level: 'warning',
        source: 'Feature PRD 核心约束原则 2'
    },
    'rule_feature_solidify': {
        id: 'rule_feature_solidify',
        title: 'Feature 固化原则',
        content: '固化结论后，该实验值将作为全量生产环境默认配置，Feature 将永久锁定。若关联实验正在【进行中】，固化操作将同步终止该实验。',
        level: 'critical',
        source: 'Feature PRD 核心约束原则 3'
    },
    'rule_feature_solidify_sync': {
        id: 'rule_feature_solidify_sync',
        title: '实验与 Feature 状态同步',
        content: '为了保证业务连续性，系统支持双向同步：\n1. 【实验侧】：进行中的实验点击“结束”时，可选择固化版本，完成“决策并发布”的闭环。\n2. 【Feature侧】：可以通过“固化”关联了进行中实验的项目，触发实验结束并下发全量配置。\n\n这消除了实验结束到固化决策期间的“业务空窗期”。',
        level: 'info',
        source: 'PRD 5.3 决策闭环优化'
    },
    'rule_feature_unique_key': {
        id: 'rule_feature_unique_key',
        title: 'Feature Key 唯一性',
        content: 'Feature Key 是全局唯一标识，创建后不可修改，用于系统后台识别。',
        level: 'critical',
        source: 'Feature PRD 2.1 数据字典'
    },
    'rule_variation_courses': {
        id: 'rule_variation_courses',
        title: '高级课程选择',
        content: '支持层级选择 (TreeSelect) 与 选中/排除 (Include/Exclude) 两种模式。',
        level: 'info',
        source: 'Feature PRD 4. 故事 02'
    },
    'rule_feature_single_exp': {
        id: 'rule_feature_single_exp',
        title: '单一实验关联制',
        content: '一个 Feature 在同一时间内只能关联一个实验（含【草稿】、【进行中】、【已结束】）。',
        level: 'critical',
        source: 'Feature PRD 核心约束原则 1'
    },
    'rule_feature_delete': {
        id: 'rule_feature_delete',
        title: '删除 Feature',
        content: '仅【未锁定】状态的 Feature 可被删除。删除操作不可恢复。',
        level: 'critical',
        source: 'Feature PRD 核心约束原则'
    },
    'rule_feature_status_desc': {
        id: 'rule_feature_status_desc',
        title: 'Feature 状态说明（与实验状态关联）',
        content: 'Feature 状态由其关联实验的生命周期决定，具体规则如下：\n\n1. 【未锁定】\n- 判断依据：Feature 未关联实验，或关联实验处于【草稿】状态。\n- 权限：支持自由修改 Feature 信息、实验值配置及其参数，可建立新实验。\n\n2. 【锁定中】\n- 判断依据：关联实验处于【进行中】或【已结束】状态（尚未固化）。\n- 权限：Feature 及实验值配置转为只读，禁止修改，以确保分流数据与实验结论的一致性。\n\n3. 【已固化】\n- 判断依据：用户已手动将某一实验值结论固化为默认配置。\n- 权限：配置已转为全量生产环境默认值，Feature 永久只读锁定。',
        level: 'info',
        source: 'Feature PRD 核心约束原则'
    },
    'rule_feature_name_unique': {
        id: 'rule_feature_name_unique',
        title: 'Feature 名称唯一性',
        content: 'Feature 名称作为业务识别标识，在系统中必须全局唯一，不可重复。',
        level: 'critical',
        source: 'Feature PRD 2.1 数据字典'
    },
    'rule_variation_edit': {
        id: 'rule_variation_edit',
        title: '实验值详情/编辑',
        content: '当 Feature 处于【锁定中】或【已固化】状态时，仅支持查看配置详情。只有在【未锁定】状态下才允许编辑参数。',
        level: 'info',
        source: 'Feature PRD 4. 权限矩阵'
    },
    'rule_variation_delete': {
        id: 'rule_variation_delete',
        title: '删除实验值',
        content: '仅在 Feature 处于【未锁定】状态下允许删除实验值。删除操作不可逆。',
        level: 'warning',
        source: 'Feature PRD 核心约束原则'
    },

    // --- List/Lifecycle Rules ---
    'rule_experiment_start': {
        id: 'rule_experiment_start',
        title: '开启实验',
        content: '将实验从【草稿】推进至【进行中】。此操作将锁定实验的核心结构（如关联Feature、人群筛选），并正式开始分流。\n状态流转：【草稿】 -> 【进行中】 \n开启实验时实验需要自检配置，确保所有必填字段均有值、流量比例是否正确、是否设置了实验组和对照组、实验组对照组流量总和是否100%，否则无法开启实验并给于报错。',
        level: 'info',
        source: 'PRD 3. 实验生命周期状态机'
    },
    'rule_experiment_end': {
        id: 'rule_experiment_end',
        title: '结束实验',
        content: '将实验从【进行中】变更至【已结束】。实验停止分流，数据不再更新。此操作不可逆。若实验表现符合预期，可在结束的同时选择“固化”某一分组版本。',
        level: 'warning',
        source: 'PRD 3. 实验生命周期状态机'
    },
    'rule_experiment_delete': {
        id: 'rule_experiment_delete',
        title: '删除实验',
        content: '仅【草稿】状态下的实验可删除。操作需经过二次确认，删除后不可恢复。',
        level: 'critical',
        source: 'PRD 3. 实验生命周期状态机'
    },
    'rule_experiment_edit_draft': {
        id: 'rule_experiment_edit_draft',
        title: '编辑实验 (草稿)',
        content: '【草稿】状态下可自由编辑实验的所有属性（基本信息、分流策略、分组设置）。',
        level: 'info',
        source: 'PRD 2. 实验核心流程'
    },
    'rule_experiment_edit_ongoing': {
        id: 'rule_experiment_edit_ongoing',
        title: '编辑实验 (进行中)',
        content: '【进行中】状态下仅支持有限编辑：可调整流量比例和分组比例，禁止修改关联 Feature、人群筛选及核心实验结构。',
        level: 'warning',
        source: 'PRD 4. 权限矩阵'
    },
    'rule_experiment_view_ended': {
        id: 'rule_experiment_view_ended',
        title: '查看详情 (已结束)',
        content: '【已结束】状态下的实验为只读模式，仅支持查看配置详情与数据报告，禁止任何修改。',
        level: 'info',
        source: 'PRD 3. 实验生命周期状态机'
    },
    'rule_list_layer': {
        id: 'rule_list_layer',
        title: '流量层管理',
        content: '系统预置标准流量层（如首页UI层、推荐算法层）供选择。若现有流量层无法满足需求（如已满或需要新的正交实验域），请联系研发团队协助新增流量层。',
        level: 'info',
        source: 'PRD 1. 核心约束原则'
    },
    'rule_list_status': {
        id: 'rule_list_status',
        title: '实验状态流转',
        content: '实验包含三种状态：\n1. 【草稿】：初始状态，可自由编辑。\n2. 【进行中】：正在分流，核心配置锁定。\n3. 【已结束】：停止分流，数据只读。\n流转关系：【草稿】 -> 【进行中】 -> 【已结束】。',
        level: 'info',
        source: 'PRD 3. 实验生命周期状态机'
    },
    'rule_no_new_users': {
        id: 'rule_no_new_users',
        title: '不进入新用户模式',
        content: '当【进行中】实验的“层内流量占比”设为 0% 时，实验进入“不进入新用户”模式。此时老用户保持原分组逻辑，但新用户将不再被分配进该实验。',
        level: 'info',
        source: 'PRD 5.2 运行中优化与管控'
    }
};

export const SCENARIOS = {
    'DEFAULT': { label: '默认状态 (Happy Path)', value: 'DEFAULT' },
    'LAYER_FULL': { label: '场景: 流量层已满', value: 'LAYER_FULL' },
    'UID_CONFLICT': { label: '场景: UID 冲突', value: 'UID_CONFLICT' },
    'NO_NEW_USERS': { label: '场景: 不进入新用户', value: 'NO_NEW_USERS' }
};
