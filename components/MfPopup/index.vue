<template>
  <view
    v-if="mounted"
    class="mf-popup"
  >
    <!-- 遮罩层 -->
    <view
      class="mf-popup__mask"
      :class="{ 'mf-popup__mask--visible': visible }"
      :style="{ transitionDuration: durationStr, zIndex: zIndex }"
      @click="handleMaskClick"
    />

    <!-- 内容区域 -->
    <view
      class="mf-popup__content"
      :class="[`mf-popup__content--${position}`, { 'mf-popup__content--visible': visible }]"
      :style="contentStyle"
    >
      <!-- 关闭按钮 -->
      <view
        v-if="closeable"
        class="mf-popup__close flex-center"
        @click="close"
      />

      <!-- 插槽内容 -->
      <slot />
    </view>
  </view>
</template>

<script setup>
  /**
   * Popup 弹层组件
   * 支持上/下/左/右/中心五个方向弹出，带遮罩与过渡动画
   *
   * @property {Boolean} modelValue - 控制弹窗显示/隐藏（v-model）
   * @property {String} position - 弹出方向：bottom | top | left | right | center，默认 bottom
   * @property {Number|String} duration - 动画时长，单位 ms，默认 300
   * @property {Boolean} overlay - 是否显示遮罩，默认 true
   * @property {Boolean} closeOnClickOverlay - 点击遮罩是否关闭，默认 true
   * @property {Boolean} closeable - 是否显示关闭按钮，默认 false
   * @property {Number} zIndex - 层级，默认 996
   * @property {Boolean} safeBottom - 是否适配底部安全区域，默认 true（仅 position=bottom 时生效）
   * @property {String} bgColor - 内容区背景色，默认 #ffffff
   * @property {String} borderRadius - 自定义圆角（覆盖默认值）
   *
   * @event {Function} open - 弹窗打开完成时触发
   * @event {Function} close - 弹窗关闭完成时触发
   * @event {Function} clickOverlay - 点击遮罩时触发
   */

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'bottom',
      validator: (val) => ['bottom', 'top', 'left', 'right', 'center'].includes(val),
    },
    duration: {
      type: [Number, String],
      default: 300,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
    closeable: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 996,
    },
    safeBottom: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: '#ffffff',
    },
    borderRadius: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'open', 'close', 'clickOverlay'])

  /** 是否已挂载 DOM（控制 v-if） */
  const mounted = ref(false)
  /** 是否处于可见状态（控制动画 class） */
  const visible = ref(false)
  /** 关闭动画定时器 */
  let closeTimer = null

  /** 动画时长字符串 */
  const durationStr = computed(() => `${Number(props.duration)}ms`)

  /** 内容区样式 */
  const contentStyle = computed(() => {
    const style = {
      transitionDuration: durationStr.value,
      zIndex: props.zIndex + 1,
      backgroundColor: props.bgColor,
    }

    if (props.borderRadius) {
      style.borderRadius = props.borderRadius
    }

    // 底部弹出时适配安全区域
    if (props.position === 'bottom' && props.safeBottom) {
      style.paddingBottom = 'env(safe-area-inset-bottom)'
    }

    return style
  })

  /**
   * 打开弹窗
   */
  function open() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
    mounted.value = true
    // 等待 DOM 渲染后再添加动画 class
    nextTick(() => {
      setTimeout(() => {
        visible.value = true
        emit('open')
      }, 20)
    })
  }

  /**
   * 关闭弹窗
   */
  function close() {
    visible.value = false
    emit('update:modelValue', false)
    // 等待动画完成后卸载 DOM
    closeTimer = setTimeout(() => {
      mounted.value = false
      emit('close')
      closeTimer = null
    }, Number(props.duration))
  }

  /**
   * 点击遮罩处理
   */
  function handleMaskClick() {
    emit('clickOverlay')
    if (props.closeOnClickOverlay) {
      close()
    }
  }

  // 监听 v-model 变化
  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        open()
      } else if (visible.value) {
        close()
      }
    },
    { immediate: true },
  )

  // 组件卸载时清理
  onBeforeUnmount(() => {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  })

  // 暴露方法供 ref 调用
  defineExpose({ open, close })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
