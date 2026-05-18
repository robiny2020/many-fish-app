<template>
  <view class="address-list">
    <!-- 地址卡片列表 -->
    <view
      v-if="addressList.length"
      class="address-list__body flex-col"
    >
      <view
        v-for="item in addressList"
        :key="item.id"
        class="address-card"
        @click="handleUse(item)"
      >
        <view class="flex items-center justify-between">
          <view class="flex flex-col">
            <!-- 姓名 + 手机号 -->
            <view class="address-card__header flex-start">
              <text class="address-card__name">{{ item.name }}</text>
              <text class="address-card__phone">{{ maskPhone(item.phone) }}</text>
            </view>

            <!-- 详细地址 -->
            <view class="address-card__detail">
              <text class="address-card__address">{{ item.fullAddress }}</text>
            </view>
          </view>
          <view
            class="address-card__use"
            @click.stop="handleUse(item)"
          >
            使用
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="address-card__actions flex-end">
          <view
            class="address-card__action flex-center"
            @click.stop="handleShare(item)"
          >
            <text class="address-card__action-icon">↗</text>
            <text class="address-card__action-text">分享</text>
          </view>
          <view
            class="address-card__action flex-center"
            @click.stop="handleEdit(item)"
          >
            <text class="address-card__action-icon">✎</text>
            <text class="address-card__action-text">编辑</text>
          </view>
          <view
            class="address-card__action address-card__action--danger flex-center"
            @click.stop="handleDelete(item)"
          >
            <text class="address-card__action-icon">🗑</text>
            <text class="address-card__action-text">删除</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view
      v-else
      class="address-list__empty flex-center-col"
    >
      <view class="address-list__empty-icon flex-center">
        <view class="address-list__empty-pin" />
      </view>
      <text class="address-list__empty-text">暂无地址</text>
      <text class="address-list__empty-sub">点击下方按钮添加一个新地址吧</text>
    </view>

    <!-- 底部新增按钮 -->
    <view class="address-list__footer safe-bottom">
      <button
        class="address-list__add-btn"
        @click="handleEdit(null)"
      >
        新增地址
      </button>
    </view>
  </view>
</template>

<script setup>
  import { useModal } from '@/composables'
  import { uniToast, uniSetClipboardData } from '@/utils/uni-api'
  import { useAddressStore } from '@/store'

  const addressStore = useAddressStore()
  const { setAddressInfo, setAddressList, delAddressInfo } = addressStore
  const { addressList } = storeToRefs(addressStore)

  const { showModal } = useModal()

  /**
   * 手机号脱敏处理
   * @param {String} phone 手机号
   * @returns {String} 脱敏后的手机号，如 135****7872
   */
  const maskPhone = (phone) => {
    if (!phone) return phone
    return phone.replace(/^(\d{3})\d{4}(\d+)$/, '$1****$2')
  }

  /** 加载地址列表 */
  const loadAddressList = async () => {
    try {
      if (addressList.value.length > 0) {
        return
      }
      const _tempList = []
      if (_tempList.length == 0) {
        uni.redirectTo({ url: '/pages/address/edit/index' })
        return
      }
      // TODO: 接入真实接口，替换此处模拟数据
      let list = _tempList.map((item) => {
        return {
          ...item,
          fullAddress: `${item.province} ${item.city} ${item.district} ${item.address}`,
        }
      })
      setAddressList(list)
    } catch (err) {
      console.warn('loadAddressList error:', err)
      uniToast('加载地址失败')
    }
  }

  /** 分享地址 */
  const handleShare = (item) => {
    const text = `${item.name} ${item.phone}\n${item.fullAddress}`
    uniSetClipboardData(text)
  }

  /** 删除地址 */
  const handleDelete = async (item) => {
    const confirmed = await showModal({
      title: '提示',
      content: '确定删除该地址吗？',
    })
    if (!confirmed) return
    console.log(item)
    try {
      // TODO: 接入真实删除接口
      delAddressInfo(item)
      uniToast('删除成功')
    } catch (err) {
      console.warn('deleteAddress error:', err)
      uniToast('删除失败')
    }
  }

  /** 跳转编辑地址页面 */
  const handleEdit = (item) => {
    let id = item ? item.id : ''
    uni.navigateTo({
      url: `/pages/address/edit/index?id=${id}`,
    })
  }

  const handleUse = (item) => {
    setAddressInfo(item)
    uni.navigateBack({ delta: 1 })
  }

  /** 页面显示时刷新列表 */
  onShow(() => {
    loadAddressList()
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
