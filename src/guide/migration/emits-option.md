---
title: emits オプション
badges:
  - new
---

# `emits` オプション <MigrationBadges :badges="$frontmatter.badges" />

## 概要

Vue 3 では `emits` オプションが、既存の `props` オプションと同様に提供されるようになりました。このオプションを使用して、コンポーネントが親に発行できるイベントを定義することができます。

## 2.x の挙動

Vue 2 では、コンポーネントが受け取るプロパティを定義することはできますが、コンポーネントが発行できるイベントを宣言することはできません。

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
```

## 3.x の挙動

プロパティと同様に、コンポーネントが発行するイベントは `emits` オプションで定義できるようになりました。

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text'],
    emits: ['accepted']
  }
</script>
```

このオプションはオブジェクトも受け取ります。これにより開発者は、発行されたイベントと一緒に渡される引数のバリデータを `props` 定義のバリデータと同様に定義できます。

詳細については、[この機能の API ドキュメント](../../api/options-data.md#emits)をお読みください。

## 移行の戦略

各コンポーネントから発行されたすべてのイベントを、 `emits` を使って発行することを強くおすすめします。

これは [`.native` 修飾子の削除](./v-on-native-modifier-removed.md) のために特に重要です。 `emits` で宣言されていないイベントのリスナーは、コンポーネントの `$attrs` に含まれるようになり、デフォルトではコンポーネントのルートノードに束縛されます。

### 例

ネイティブイベントを親に再発行するコンポーネントでは、これにより 2 つのイベントが発火することになります。

```vue
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // 宣言されていないイベント
}
</script>
```

親がコンポーネントの `click` イベントを購読する場合:

```html
<my-button v-on:click="handleClick"></my-button>
```

これは _2回_ 引き起こされます。

- `$emit()` から一度。
- ルート要素に適用されたネイティブイベントリスナから一度。

ここでは 2 つの選択肢があります。

1. `click` イベントを適切に宣言する。これは `<my-button>` のイベントハンドラに何らかのロジックを実際に追加する場合で役立ちます。
2. `.native` を追加しなくても、親は簡単にネイティブイベントを購読できるので、イベントの再発行を削除します。とにかく明らかにイベントを再発行するだけの場合に適しています。

## 参照

- [関連する RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)
- [移行ガイド - `.native` 修飾子の削除](./v-on-native-modifier-removed.md)
- [移行ガイド - `$listeners` の削除](./listeners-removed.md)
- [移行ガイド - `class` と `style` を含む `$attrs`](./attrs-includes-class-style.md)
- [移行ガイド - Render 関数 API の変更](./render-function-api.md)
