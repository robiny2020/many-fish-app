# 多鱼回收 (Many Fish)

> 告别杂乱，拥抱清爽生活。多鱼致力于让回收变得更简单，为您提供一站式上门回收解决方案。

无论是旧衣物、书籍，还是家电、家具、数码 3C，只需一键预约，剩下的交给我们。

## 产品亮点

### 全网高价，有偿回收

- **旧衣变现** — 告别免费丢弃，全网极具竞争力的回收价格，最高可达 1 元/公斤
- **环保豆奖励** — 回收旧物不仅能得现金，还能赚取"环保豆"，在福利商城兑换超值好物或抵扣现金

### 顺丰、京东、德邦极速上门

- **0 运费** — 所有上门回收订单均免除快递费用，无需承担任何物流成本
- **2 小时响应** — 覆盖全国 300+ 城市，预约后最快 2 小时内安排快递员上门，附近 500 米内更享极速服务
- **一键预约** — 在线选择取件时间与地址，足不出户即可完成回收

### 全品类覆盖，一站式清理

| 品类 | 回收范围 | 说明 |
| --- | --- | --- |
| **旧衣回收** | 衣服、鞋子、包包、床单被罩、毛绒玩具等 | 纺织品统统回收 |
| **旧书回收** | 各类书籍教材 | 循环利用，传递知识 |
| **数码 3C** | 旧手机、平板、数码配件 | 高价回收，数据安全有保障 |
| **家电回收** | 冰箱、洗衣机、空调等 | 专业团队上门拆卸搬运，变废为宝 |
| **家具清运** | 沙发、床垫、衣柜等大件 | 付费清运，快速腾出空间 |

### 环保公益，全程溯源

- **资源再生** — 回收物品经专业分拣，符合标准的进行环保再生处理或公益捐赠，不符合标准的进行资源化处理，确保零填埋
- **环保证书** — 每一次回收都会生成专属环保证书，记录您的环保贡献，让爱心有迹可循

---

## 技术栈

| 类别 | 技术 |
| --- | --- |
| **框架** | [uni-app](https://uniapp.dcloud.net.cn/) + [Vue 3](https://vuejs.org/) |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) + pinia-plugin-persistedstate |
| **请求封装** | UniRequest（基于 uni.request，支持拦截器、Token 刷新队列） |
| **包管理** | [pnpm](https://pnpm.io/) |
| **代码规范** | ESLint + Prettier + Commitlint（Conventional Commits） |
| **构建工具** | [Vite](https://vitejs.dev/) |

## 项目结构

```text
many-fish-app/
├── api/                    # 接口层（请求封装 + 业务 API）
│   ├── request/
│   │   ├── core.js         # UniRequest 核心类
│   │   └── index.js        # 实例、拦截器、Token 刷新队列
│   └── index.js            # API 统一出口
├── components/             # 全局公共组件
├── composables/            # 组合式函数
├── config/                 # 常量与配置
├── docs/                   # 项目文档（按模块划分）
├── pages/                  # 页面
├── static/                 # 静态资源
├── store/                  # Pinia 状态管理
├── style/                  # 全局样式
├── uni_modules/            # uni-app 插件
├── utils/                  # 工具函数
│   ├── auth.js             # 鉴权模块
│   ├── event-emitter.js    # 发布订阅事件总线
│   └── storage.js          # 本地存储封装
├── App.vue                 # 应用入口
├── main.js                 # 主入口
├── pages.json              # 页面路由配置
├── manifest.json           # 应用配置
├── vite.config.js          # Vite 配置
└── package.json
```

## 快速开始

### 环境要求

- **Node.js** >= 18
- **pnpm** >= 10

### 安装依赖

```bash
pnpm install
```

### 开发运行

使用 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 打开项目，选择对应平台运行：

- **微信小程序**：运行 → 运行到小程序模拟器 → 微信开发者工具
- **H5**：运行 → 运行到浏览器

或通过命令行：

```bash
# H5
pnpm dev:h5

# 微信小程序
pnpm dev:mp-weixin
```

### 代码规范

```bash
# 格式化代码
pnpm format

# 提交前检查
pnpm lint
```

## 文档

详细的模块文档位于 [`docs/`](./docs/) 目录，参见 [文档索引](./docs/README.md)。
