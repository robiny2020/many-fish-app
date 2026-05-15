# 目录结构约定

```text
api/                    → 接口层（request/ 核心封装 + 业务 API 按模块拆分）
components/             → 全局公共组件
composables/            → 组合式函数
config/                 → 常量定义、配置项
docs/                   → 项目文档（按模块划分，详见 docs/README.md）
pages/                  → 页面（按业务模块组织子目录）
  tabbar/               → Tab 页面（首页、福利、订单、我的）
  recycle/              → 回收业务页（旧衣、书籍、玩具、家电、数码、家具）
  order/                → 订单详情页
  common/               → 通用页（登录、webview）
  user/                 → 用户相关页
  system/               → 系统设置页
  activity/             → 活动页（绿洲计划等）
  notify/               → 通知页
static/                 → 静态资源
store/                  → Pinia store（按功能拆分：system、user、auth、base）
style/                  → 全局样式
uni_modules/            → uni-app 插件
utils/                  → 工具函数（auth、event-emitter、storage、uni-api）
```
