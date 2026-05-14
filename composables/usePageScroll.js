/**
 * usePageScroll — 页面滚动监听 hook
 * 默认自动将 scrollTop 同步给 navBarRef，也支持额外回调
 *
 * @param {Function} [callback] - 可选的额外滚动回调，参数为 scrollTop (number)
 * @returns {{ navBarRef: Ref, scrollTop: Ref<number> }}
 *
 * @example
 * // 基础用法：自动同步 NavBar
 * const { navBarRef } = usePageScroll()
 *
 * // 需要额外处理滚动
 * const { navBarRef, scrollTop } = usePageScroll((top) => {
 *   console.log('当前滚动:', top)
 * })
 */
export function usePageScroll(callback) {
  const navBarRef = ref(null)
  const scrollTop = ref(0)

  onPageScroll((e) => {
    scrollTop.value = e.scrollTop
    navBarRef.value?.updateScrollTop(e.scrollTop)
    if (typeof callback === 'function') {
      callback(e.scrollTop)
    }
  })

  return { navBarRef, scrollTop, onPageScroll }
}
