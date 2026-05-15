<template>
  <view class="address-list">
    <!-- 地址卡片列表 -->
    <view
      v-if="addressList.length"
      class="address-list__body"
    >
      <view
        v-for="item in addressList"
        :key="item.id"
        class="address-card"
      >
        <!-- 姓名 + 手机号 -->
        <view class="address-card__header flex-start">
          <text class="address-card__name">{{ item.name }}</text>
          <text class="address-card__phone">{{ maskPhone(item.phone) }}</text>
        </view>

        <!-- 详细地址 -->
        <view class="address-card__detail">
          <text class="address-card__address">{{ item.fullAddress }}</text>
        </view>

        <!-- 操作按钮 -->
        <view class="address-card__actions flex-end">
          <view
            class="address-card__action flex-center"
            @click="handleShare(item)"
          >
            <text class="address-card__action-icon">↗</text>
            <text class="address-card__action-text">分享</text>
          </view>
          <view
            class="address-card__action flex-center"
            @click="handleEdit(item)"
          >
            <text class="address-card__action-icon">✎</text>
            <text class="address-card__action-text">编辑</text>
          </view>
          <view
            class="address-card__action address-card__action--danger flex-center"
            @click="handleDelete(item)"
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
      <text class="address-list__empty-text">暂无地址</text>
    </view>

    <!-- 底部新增按钮 -->
    <view class="address-list__footer safe-bottom">
      <button
        class="address-list__add-btn"
        @click="handleAdd"
      >
        新增地址
      </button>
    </view>
  </view>
</template>

<script setup>
  import { useModal } from '@/composables'
  import { uniToast, uniSetClipboardData } from '@/utils/uni-api'

  const { showModal } = useModal()

  /** 地址列表数据 */
  const addressList = ref([])

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
      // TODO: 接入真实接口，替换此处模拟数据
      let list = [
        {
          name: '测试',
          phone: '13123123123',
          province: '上海',
          city: '上海市',
          district: '浦东新区',
          address: '按时打算打算大',
        },
        {
          name: '测试',
          phone: '13123123123',
          province: '浙江省',
          city: '杭州市',
          district: '西湖区',
          address: '按 11时打算打算大',
        },
      ].map((item) => {
        return {
          ...item,
          fullAddress: `${item.province} ${item.city} ${item.district} ${item.address}`,
        }
      })
      addressList.value = list
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

  /** 跳转编辑地址页面 */
  const handleEdit = (item) => {
    uni.navigateTo({
      url: `/pages/address/edit/index?id=${item.id}`,
    })
  }

  /** 删除地址 */
  const handleDelete = async (item) => {
    const confirmed = await showModal({
      title: '提示',
      content: '确定删除该地址吗？',
    })
    if (!confirmed) return

    try {
      // TODO: 接入真实删除接口
      addressList.value = addressList.value.filter((i) => i.id !== item.id)
      uniToast('删除成功')
    } catch (err) {
      console.warn('deleteAddress error:', err)
      uniToast('删除失败')
    }
  }

  /** 跳转新增地址页面 */
  const handleAdd = () => {
    uni.navigateTo({
      url: '/pages/address/edit/index',
    })
  }

  /** 页面显示时刷新列表 */
  onShow(() => {
    loadAddressList()
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
