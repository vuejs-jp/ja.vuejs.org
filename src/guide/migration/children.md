---
badges:
  - removed
---

# $children <MigrationBadges :badges="$frontmatter.badges" />

## 概要

インスタンスプロパティの `$children` は、Vue 3.0 から削除され、サポートされなくなりました。

## 2.x での構文

2.x では、開発者は `this.$children` を使って、現在のインスタンスの直接の子コンポーネントにアクセスすることができました。

```vue
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <my-button>Change logo</my-button>
  </div>
</template>

<script>
import MyButton from './MyButton'

export default {
  components: {
    MyButton
  },
  mounted() {
    console.log(this.$children) // [VueComponent]
  }
}
</script>
```

## 3.x の更新

3.x では、 `$children` プロパティが削除され、サポートされなくなりました。代わりに、もし子コンポーネントのインスタンスにアクセスする必要がある場合は、 [$refs](/guide/component-template-refs.html#template-refs) を使用することをお勧めします。
