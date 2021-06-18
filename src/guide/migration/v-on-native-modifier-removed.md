---
title: v-on.native 修飾子の削除
badges:
  - breaking
---

# `v-on.native` 修飾子の削除 <MigrationBadges :badges="$frontmatter.badges" />

## 概要

`v-on` の `.native` 修飾子は削除されました。

## 2.x での構文

`v-on` でコンポーネントに渡されたイベントリスナは、デフォルトでは `this.$emit` でイベントを発行することでのみ発火されます。代わりにネイティブ DOM リスナを子コンポーネントのルート要素に追加するには、 `.native` 修飾子を使用できます:

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click.native="handleNativeClickEvent"
/>
```

## 3.x での構文

`v-on` の `.native` 修飾子は削除されました。同時に、 [新しい `emits` オプション](./emits-option.md) によって、子要素が実際に発行するイベントを定義できるようになりました。

その結果、 Vue は子コンポーネントの発行するイベントとして定義されて _いない_　すべてのイベントリスナを、子のルート要素のネイティブイベントリスナとして追加するようになりました（ただし `inheritAttrs: false` が子のオプションで設定されていない場合）。

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>
```

`MyComponent.vue`

```html
<script>
  export default {
    emits: ['close']
  }
</script>
```

## 移行の戦略

- `.native` 修飾子のすべてのインスタンスを削除します。
- すべてのコンポーネントが、 `emits` オプションでイベントを記録するようにします。

[移行ビルドのフラグ: `COMPILER_V_ON_NATIVE`](migration-build.html#compat-の設定)

## 参照

- [関連する RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md#v-on-listener-fallthrough)
- [移行ガイド - 新しい Emits のオプション](./emits-option.md)
- [移行ガイド - `$listeners` の削除](./listeners-removed.md)
- [移行ガイド - Render 関数 API](./render-function-api.md)
