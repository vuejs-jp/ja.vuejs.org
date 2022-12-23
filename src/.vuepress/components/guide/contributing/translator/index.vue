<template>
  <div>
    <div class="translator">
      <h2>ドキュメントの翻訳協力者</h2>

      <p>
        日々アップデートされる Vue 公式ドキュメントの翻訳は、Vue.js 日本ユーザーグループの協力でできています。
      </p>

      <div class="vuers">
        <VuerProfileLite v-for="profile in members" :key="profile.name" :profile="profile"/>
      </div>
    </div>
  </div>
</template>

<script>
import members from './members'

export default {
  components: {
    VuerProfileLite: () => import('./vuer-profile-lite')
  },

  data: () => ({
    members
  })
}
</script>

<style lang="scss" scoped>
.vuers {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
}
</style>
