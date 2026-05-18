/**
 * 消息模块 — 类型常量 & 配置映射
 */

/** =================== 消息大类 =================== */
export const MESSAGE_TYPE = {
  /** 回收订单消息 */
  RECYCLE_ORDER: 'RECYCLE_ORDER',
  /** 商品订单消息 */
  GOODS_ORDER: 'GOODS_ORDER',
  /** 支付消息 */
  PAYMENT: 'PAYMENT',
  /** 环保金消息 */
  ECO_FUND: 'ECO_FUND',
  /** 系统通知 */
  SYSTEM: 'SYSTEM',
}

/** =================== 子事件枚举 =================== */

/** 回收订单子事件 */
export const RECYCLE_ORDER_EVENT = {
  /** 下单成功 */
  PLACED: 'PLACED',
  /** 上门取件 */
  PICKUP: 'PICKUP',
  /** 揽件成功 */
  COLLECTED: 'COLLECTED',
  /** 订单完成 */
  COMPLETED: 'COMPLETED',
  /** 订单取消 */
  CANCELLED: 'CANCELLED',
}

/** 商品订单子事件 */
export const GOODS_ORDER_EVENT = {
  /** 下单成功 */
  PLACED: 'PLACED',
  /** 已发货 */
  SHIPPED: 'SHIPPED',
  /** 已签收 */
  RECEIVED: 'RECEIVED',
  /** 退款成功 */
  REFUNDED: 'REFUNDED',
}

/** 支付子事件 */
export const PAYMENT_EVENT = {
  /** 提现成功 */
  WITHDRAW_SUCCESS: 'WITHDRAW_SUCCESS',
  /** 提现失败 */
  WITHDRAW_FAILED: 'WITHDRAW_FAILED',
  /** 到账通知 */
  ARRIVAL: 'ARRIVAL',
}

/** 环保金子事件 */
export const ECO_FUND_EVENT = {
  /** 环保金发放 */
  GRANTED: 'GRANTED',
  /** 环保金过期提醒 */
  EXPIRING: 'EXPIRING',
}

/** 系统通知子事件 */
export const SYSTEM_EVENT = {
  /** 系统公告 */
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  /** 活动通知 */
  ACTIVITY: 'ACTIVITY',
  /** 版本更新 */
  VERSION_UPDATE: 'VERSION_UPDATE',
}

/** =================== 类型 → UI 映射 =================== */

/**
 * 消息类型配置映射
 * label: 显示名称
 * icon: 图标名（对应 static/icons/message/ 目录）
 * color: 主题色
 */
export const MESSAGE_TYPE_MAP = {
  [MESSAGE_TYPE.RECYCLE_ORDER]: {
    label: '回收订单',
    icon: 'recycle-order',
    color: '#07C160',
  },
  [MESSAGE_TYPE.GOODS_ORDER]: {
    label: '商品订单',
    icon: 'goods-order',
    color: '#FF6B00',
  },
  [MESSAGE_TYPE.PAYMENT]: {
    label: '支付通知',
    icon: 'payment',
    color: '#0275FE',
  },
  [MESSAGE_TYPE.ECO_FUND]: {
    label: '环保金',
    icon: 'eco-fund',
    color: '#34C759',
  },
  [MESSAGE_TYPE.SYSTEM]: {
    label: '系统通知',
    icon: 'system',
    color: '#8E8E93',
  },
}
