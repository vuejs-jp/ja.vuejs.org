---
badges:
  - removed
---

# `propsData` <MigrationBadges :badges="$frontmatter.badges" />

## 概要

Vue インスタンスの生成時に props を渡すために使われていた `propsData` オプションは削除されました。Vue 3 アプリケーションのルートコンポーネントに props を渡すには、 [createApp](/api/global-api.html#createapp) の第2引数を使います。

## 2.x での構文

2.x では、 Vue インスタンスの生成時に props を渡すことができました:

```js
const Comp = Vue.extend({
  props: ['username'],
  template: '<div>{{ username }}</div>'
})

new Comp({
  propsData: {
    username: 'Evan'
  }
})
```

## 3.x での更新

`propsData` オプションは削除されました。生成時にルートコンポーネントのインスタンスに props を渡す必要がある場合は、 `createApp` の第2引数を使ってください:

```js
const app = createApp(
  {
    props: ['username'],
    template: '<div>{{ username }}</div>'
  },
  { username: 'Evan' }
)
```
