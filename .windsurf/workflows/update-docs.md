---
description: 根据代码变更自动更新 docs/ 目录下的项目文档，按模块划分，保持文档与代码同步
---

# Update Docs — 项目文档更新工作流

> 本工作流用于在代码变更后同步更新 `docs/` 目录下的模块文档。
> 通常在 `/git-flow` 的步骤 3（读取 diff）之后、步骤 4（生成 commit message）之前执行，使文档变更随代码一起提交。

## 文档目录结构

```text
docs/
├── README.md           # 文档入口索引，列出所有模块文档及简要说明
├── request.md          # api/request 请求模块
├── store.md            # store 状态管理模块
├── utils.md            # utils 工具模块
├── components.md       # components 公共组件
├── composables.md      # composables 组合式函数
├── config.md           # config 配置与常量
├── uni-modules.md      # uni_modules 插件模块
└── style.md            # style 全局样式
```

## 模块与文档映射

| 变更路径前缀 | 对应文档 | 说明 |
| --- | --- | --- |
| `api/` | `docs/request.md` | 请求封装、拦截器、Token 刷新队列 |
| `store/` | `docs/store.md` | Pinia store 定义与用法 |
| `utils/` | `docs/utils.md` | 工具函数（event-emitter、storage、auth 等） |
| `components/` | `docs/components.md` | 全局公共组件 |
| `composables/` | `docs/composables.md` | 组合式函数（useModal 等） |
| `config/` | `docs/config.md` | 常量定义、配置项 |
| `uni_modules/` | `docs/uni-modules.md` | uni-app 插件模块 |
| `style/` | `docs/style.md` | 全局样式、SCSS 变量 |
| `pages/` 下的 `components/` | 对应模块文档或不更新 | 页面级组件跟随页面，一般不单独建文档 |

## 步骤 1：分析 diff 涉及的模块

从 `/git-flow` 步骤 3 获取到的 diff 中，提取所有变更文件路径，按上方映射表归类到对应的文档模块。

**判断逻辑：**

- 如果变更文件**不属于任何已映射模块**（如 `pages/`、`App.vue`、配置文件等）→ 跳过文档更新
- 如果变更文件**属于已映射模块** → 继续步骤 2

## 步骤 2：读取现有文档和变更模块源码

对于每个需要更新的模块：

1. 读取对应的现有文档文件（如果存在）
2. 读取该模块下被变更的源码文件，理解变更内容

## 步骤 3：更新或创建模块文档

根据变更内容更新对应的模块文档，遵循以下规则：

**文档内容规范：**

- 使用中文编写
- 包含模块概述、目录结构、核心 API/组件说明、使用示例
- 代码示例中的 import 路径使用 `@/` 别名
- 保持与实际代码一致，不编造不存在的 API 或参数
- 如果是新模块且文档不存在，创建新文档文件

**更新原则：**

- **增量更新**：只修改与本次变更相关的段落，不重写无关内容
- **保持结构**：维持文档原有的章节结构和格式风格
- **同步删除**：如果源码中删除了某个功能/API，文档中对应内容也要删除
- **新增补全**：如果新增了功能/API，在文档合适位置补充说明

## 步骤 4：更新入口索引

检查 `docs/README.md` 是否需要更新：

- 如果新建了模块文档 → 在 `README.md` 中添加链接和说明
- 如果删除了模块文档 → 从 `README.md` 中移除对应条目
- 如果无新增/删除 → 跳过

`README.md` 格式示例：

```markdown
# 项目文档

| 模块 | 文档 | 说明 |
|------|------|------|
| 请求模块 | [request.md](./request.md) | WxRequest 封装、拦截器、Token 刷新队列 |
| 状态管理 | [store.md](./store.md) | Pinia store 定义与用法 |
| 工具函数 | [utils.md](./utils.md) | event-emitter、storage、auth 等 |
| ... | ... | ... |
```

## 步骤 5：回到 git-flow

文档更新完成后，将变更的文档文件纳入本次提交：

- 回到 `/git-flow` 步骤 4，生成 commit message 时将文档更新体现在描述中
- 文档文件与代码文件一起暂存、提交

---

## 与 git-flow 的集成

在 `/git-flow` 中，步骤 3（读取 diff）完成后、步骤 4（生成 commit message）之前，插入本工作流：

```text
git-flow 步骤 1：检测分支
git-flow 步骤 2：检测变更
git-flow 步骤 3：读取 diff
  ↓
  ├─ 执行 /update-docs（分析 diff → 更新文档）
  ↓
git-flow 步骤 4：生成 commit message（包含文档变更）
git-flow 步骤 5：确认并提交（代码 + 文档一起提交）
git-flow 步骤 6-8：拉取、冲突处理、推送
```
