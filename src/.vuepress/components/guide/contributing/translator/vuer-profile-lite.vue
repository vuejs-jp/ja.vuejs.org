<template>
  <div class="vuer">
    <a class="avatar" :href="generateGithubUrl(profile.github)" target="_blank">
      <img v-if="profile.imageUrl"
        :src="profile.imageUrl"
        :alt="profile.name" width=80 height=80>
      <img v-else-if="profile.github"
        :src="`https://github.com/${profile.github}.png`"
        :alt="profile.name" width=80 height=80>
      <img v-else-if="profile.twitter"
        :src="`https://avatars.io/twitter/${profile.twitter}`"
        :alt="profile.name" width=80 height=80>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    profile: Object
  },

  methods: {
    generateGithubUrl: (handle) => {
      return `https://github.com/${handle}`
    }
  }
}
</script>

<style lang="scss" scoped>
.vuer {
  padding: 10px;
}

.avatar {
  display: block;
  flex: 0 0 80px;

  img {
    border-radius: 50%;
    object-fit: cover;
    vertical-align: top;
  }
}
</style>
