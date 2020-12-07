<template>
  <div class="themes">
    <theme-provider v-for="provider in providers" :key="provider.name" :provider="provider" />

    <p>
      あなたのテーマをここで紹介したいですか？
      <a href="mailto:evan@vuejs.org?subject=Theme+affiliation">ご連絡ください！</a>
    </p>
  </div>
</template>

<script>
import providers from './theme-data'

export default {
  components: {
    ThemeProvider: () => import('./theme-provider')
  },

  data: () => ({
    providers
  })
}
</script>
