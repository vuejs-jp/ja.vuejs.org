---
title: $listeners の削除
badges:
  - breaking
---

# `$listeners` の削除 <MigrationBadges :badges="$frontmatter.badges" />

## 概要

`$listeners` オブジェクトは Vue 3 で削除されました。イベントリスナは `$attrs` の一部になりました。

```js
{
  text: 'this is an attribute',
  onClose: () => console.log('close Event triggered')
}
```

## 2.x での構文

Vue 2 では、コンポーネントに渡された属性は `this.$attrs` で、イベントリスナは `this.$listeners` でアクセスできます。
`inheritAttrs: false` と組み合わせることで、開発者はこれらの属性やリスナを、ルート要素ではなく他の要素に適用することができます:

```html
<template>
  <label>
    <input type="text" v-bind="$attrs" v-on="$listeners" />
  </label>
</template>
<script>
  export default {
    inheritAttrs: false
  }
</script>
```

## 3.x での構文

Vue 3 の仮想 DOM では、イベントリスナはプレフィックスに `on` がついた単なる属性になり、 `$attrs` オブジェクトの一部であるため、 `$listeners` は削除されました。

```vue
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```

もしこのコンポーネントが `id` 属性と `v-on:close` リスナを受け取った場合、 `$attrs` オブジェクトは次のようになります:

```js
{
  id: 'my-input',
  onClose: () => console.log('close Event triggered')
}
```

## 移行の戦略

`$listeners` の使用をすべて削除します。

[移行ビルドのフラグ: `INSTANCE_LISTENERS`](migration-build.html#compat-の設定)

## 参照

- [関連する RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [移行ガイド - `class` と `style` を含む `$attrs`](./attrs-includes-class-style.md)
- [移行ガイド - Render 関数 API](./render-function-api.md)
- [移行ガイド - 新しい Emits のオプション](./emits-option.md)
- [移行ガイド - `.native` 修飾子の削除](./v-on-native-modifier-removed.md)
