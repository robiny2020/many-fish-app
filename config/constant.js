export const PK_PREFIX = '__MF_'

/**-----------------local-storage-----------------**/
/* 本地token 键 */
export const MF_USER_TOKEN = `${PK_PREFIX}userToken`

/**-----------------event-emitter-----------------**/
/* 网络状态事件 */
export const NETWORK_STATUS_EVENT = 'NETWORK:STATUS'
/* 请求层发出：需要刷新 token，由鉴权层订阅处理 */
export const TOKEN_NEED_REFRESH_EVENT = 'TOKEN:NEED_REFRESH'
/* 鉴权层发出：token 刷新成功，payload = { token: string } */
export const TOKEN_REFRESHED_EVENT = 'TOKEN:REFRESHED'
/* 鉴权层发出：token 刷新失败（需强制登录），payload = { error: any } */
export const TOKEN_REFRESH_FAILED_EVENT = 'TOKEN:REFRESH_FAILED'
