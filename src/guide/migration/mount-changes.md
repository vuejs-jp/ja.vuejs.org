---
title: 'マウント API の変更'
badges:
  - breaking
---

# 要素を置換しないアプリケーションのマウント <MigrationBadges :badges="$frontmatter.badges" />

## 概要

Vue 2.x では、 `template` を持つアプリケーションをマウントすると、レンダリングされたコンテンツがマウント先の要素を置き換えます。 Vue 3.x では、レンダリングされたアプリケーションは、子要素として追加され、要素の `innerHTML` を置き換えます。

## 2.x での構文

Vue 2.x では、 HTML 要素セレクタを `new Vue()` または `$mount` に渡します:

```js
new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

// または
const app = new Vue({
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

app.$mount('#app')
```

このアプリケーションを渡されたセレクタ (ここでは `id="app"`) を持つ `div` のあるページにマウントした場合:

```html
<body>
  <div id="app">
    Some app content
  </div>
</body>
```

レンダリングされた結果は、上記の `div` がレンダリングされたアプリケーションのコンテンツと置き換えられます:

```html
<body>
  <div id="rendered">Hello Vue!</div>
</body>
```

## 3.x での構文

Vue 3.x では、アプリケーションをマウントすると、レンダリングされたコンテンツが `mount` に渡した要素の `innerHTML` を置き換えます:

```js
const app = Vue.createApp({
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

app.mount('#app')
```

このアプリケーションを `id="app"` を持つ `div` のあるページにマウントすると、このようになります:

```html
<body>
  <div id="app" data-v-app="">
    <div id="rendered">Hello Vue!</div>
  </div>
</body>
```

## 参照

- [`mount` API](/api/application-api.html#mount)
