export const PK_PREFIX = '__MF_'

/**-----------------local-storage-----------------**/
/* 本地token 键 */
export const MF_USER_TOKEN = `${PK_PREFIX}userToken`

/**-----------------event-emitter-----------------**/
/* 网络状态事件 */
export const NETWORK_STATUS_EVENT = 'NETWORK:STATUS'
/* token 刷新成功，携带新 token：payload = { token: string } */
export const TOKEN_REFRESHED_EVENT = 'TOKEN:REFRESHED'
/* token 刷新失败（需强制登录）：payload = { error: any } */
export const TOKEN_REFRESH_FAILED_EVENT = 'TOKEN:REFRESH_FAILED'
