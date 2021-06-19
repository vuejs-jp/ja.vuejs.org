---
badges:
  - breaking
---

# 関数型コンポーネント <MigrationBadges :badges="$frontmatter.badges" />

## 概要

何が変わったのかを大まかに:

- 関数型コンポーネントの 2.x からのパフォーマンスの向上は 3.x ではごくわずかなので、ステートフルコンポーネントのみの使用を推奨します
- 関数型コンポーネントは、`props` と `context`（つまり `slots`, `attrs`, `emit`）を受け取るプレーンな関数を用いてのみ作成できます
- **破壊的変更:** 単一ファイルコンポーネント（SFC）の `<template>` から `functional` 属性は削除されました
- **破壊的変更:** 関数で作られるコンポーネントの `{ function: true }` オプションは削除されました

詳細については、続きを読んでください！

## はじめに

Vue 2 では、関数型コンポーネントには 2 つの主要なユースケースがありました:

- ステートフルコンポーネントよりもはるかに高速に初期化されるので、パフォーマンスの最適化として
- 複数のルートノードを返すため

しかし Vue 3 では、ステートフルコンポーネントのパフォーマンスは、その差が無視できるほどに向上しています。さらに、ステートフルコンポーネントに複数のルートノードを返す機能も追加されました。

その結果、関数型コンポーネントに残った唯一のユースケースは、動的な見出しを作成するためのコンポーネントのようなシンプルなものだけです。それ以外の場合は、通常どおりステートフルコンポーネントを使用することをお勧めします。

## 2.x での構文

`<dynamic-heading>` コンポーネントを使うと、適切な見出し（つまり `h1`, `h2`, `h3` など）のレンダリングを担当するコンポーネントは 2.x では単一ファイルコンポーネントとして次のように記述できました:

```js
// Vue 2 での関数型コンポーネントの例
export default {
  functional: true,
  props: ['level'],
  render(h, { props, data, children }) {
    return h(`h${props.level}`, data, children)
  }
}
```

または、単一ファイルコンポーネントの `<template>` を好む人向けに:

```vue
<!-- Vue 2 での <template> を使用した関数型コンポーネントの例 -->
<template functional>
  <component
    :is="`h${props.level}`"
    v-bind="attrs"
    v-on="listeners"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```

## 3.x での構文

### 関数で作られるコンポーネント

Vue 3 では、すべての関数型コンポーネントはプレーンな関数で作成されます。つまり、`{ function: true }` のコンポーネントオプションを定義する必要はありません。

これらの関数は `props` と ` context` の 2 つの引数を受け取ります。`context` 引数は、コンポーネントの `attrs`, `slot`, `emit` プロパティを含むオブジェクトです。

さらに、`render` 関数内で暗黙的に `h` を提供するのではなく、`h` をグローバルにインポートするようになりました。

前述の `<dynamic-heading>` コンポーネントの例を使って、どのようになったかを説明します。

```js
import { h } from 'vue'

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots)
}

DynamicHeading.props = ['level']

export default DynamicHeading
```

### 単一ファイルコンポーネント (SFC)

3.x では、ステートフルコンポーネントと関数型コンポーネントのパフォーマンスの差は大幅に減少し、ほとんどのユースケースでは重要ではないでしょう。その結果、単一ファイルコンポーネントで `functional` を使用している開発者の移行方法は、この属性を削除して、 `props` を `$props` に、 `attrs` を `$attrs` にすべての参照を変更することになります。

先ほどの `<dynamic-heading>` の例を使うと、次のようになります。

```vue{1,3,4}
<template>
  <component
    v-bind:is="`h${$props.level}`"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```

主な違いは以下の通りです:

1. `<template>` から `functional` 属性が削除されました
1. `listeners` は `$attrs` の一部として渡されるようになるので、削除できるようになりました

## 次のステップ

新しい関数型コンポーネントの使用方法や render 関数全般の変更点の詳細は、以下を参照してください:

- [移行: Render 関数](/guide/migration/render-function-api.html)
- [ガイド: Render 関数](/guide/render-function.html)
- [移行ビルドのフラグ: `COMPONENT_FUNCTIONAL`](migration-build.html#compat-の設定)
