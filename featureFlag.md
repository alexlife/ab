## 1) Feature flag 是什么？

**Feature flag（功能开关）是一种“可远程控制代码行为的配置”。**

它让你可以在**不改代码、不重新发版**的情况下，决定：

* 某个功能开还是关（bool）
* 某段逻辑走哪个版本（enum）
* 某些策略参数是多少（number / json）

### 例子

* `ff_checkout_new_ui_enabled = true/false`
* `search_ranker_version = "v1" | "v2"`
* `feed_diversity_lambda = 0.2`

---

## 2) Feature flag 管理什么？

Feature flag 通常管理：

* flag 的 key（名字）
* flag 的值（bool/enum/参数）
* 生效规则（哪些用户、哪些环境、灰度方案）
* 变更记录、权限、审计、回滚

---

## 3) Feature flag 和实验（A/B test）的关系是什么？

一句话：

> **实验负责“分桶/决定谁进 A 或 B”，Feature flag 负责“在代码里执行 A 或 B 的行为”。**

也就是：

* **实验 = 统计意义上的对照设计**
* **flag = 工程上的开关/路由机制**

---

## 4) 常见的搭配方式（最典型）

* 实验系统：把用户分到 A / B
* flag：让 A 走旧逻辑，B 走新逻辑

例如：

* A → `ff_new_checkout=false`
* B → `ff_new_checkout=true`

---

## 5) 关键原则（避免踩坑）

* 一个实验通常只有 **1 个实验入口 flag**（负责随机化）
* 一个实验可以控制多个子 feature flag（但要克制）
* 不要让多个实验去争夺同一个 flag 的控制权，否则会污染实验结果
