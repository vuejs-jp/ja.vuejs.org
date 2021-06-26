# 条件付きレンダリング

<VideoLesson href="https://vueschool.io/lessons/conditional-rendering-in-vue-3?friend=vuejs" title="Learn how conditional rendering works with Vue School">Learn how conditional rendering works with a free lesson on Vue School</VideoLesson>

## `v-if`

`v-if` ディレクティブは、ブロックを条件に応じて描画したい場合に使用されます。ブロックは、ディレクティブの式が真を返す場合のみ描画されます。

```html
<h1 v-if="awesome">Vue is awesome!</h1>
```

これは、`v-else` で "else ブロック" を追加することも可能です:

```html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

### `<template>` での `v-if` による条件グループ

`v-if` はディレクティブなので、単一の要素に付加する必要があります。しかし、1 要素よりも多くの要素と切り替えたい場合はどうでしょうか？このケースでは、非表示ラッパー (wrapper) として提供される、`<template>` 要素で `v-if` を使用できます。最終的に描画される結果は、`<template>` 要素は含まれません。

```html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `v-else`

`v-if` に対して "else block" を示すために、`v-else` ディレクティブを使用できます:

```html
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
```

`v-else` 要素は、`v-if` または `v-else-if` 要素の直後になければなりません。それ以外の場合は認識されません。

### `v-else-if`

`v-else-if` は、名前が示唆するように、`v-if` の "else if block" として機能します。また、複数回連結することもできます:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

`v-else` と同様に、`v-else-if` 要素は `v-if` 要素または `v-else-if` 要素の直後になければなりません。

## `v-show`

条件的に要素を表示するための別のオプションは `v-show` です。使用方法はほとんど同じです:

```html
<h1 v-show="ok">Hello!</h1>
```

違いは `v-show` による要素は常に描画されて DOM に維持するということです。`v-show` はシンプルに要素の `display` CSS プロパティを切り替えます。

`v-show` は `<template>` 要素をサポートせず、`v-else` とも連動しないということに注意してください。

## `v-if` vs `v-show`

`v-if` は、イベントリスナと子コンポーネント内部の条件ブロックが適切に破棄され、そして切り替えられるまでの間再作成されるため、”リアル”な条件レンダリングです。

`v-if` は **遅延描画 (lazy)** です。 初期表示において false の場合、何もしません。条件付きブロックは、条件が最初に true になるまで描画されません。

一方で、`v-show` はとてもシンプルです。要素は初期条件に関わらず常に描画され、シンプルな CSS ベースの切り替えとして保存されます。

一般的に、`v-if` はより高い切り替えコストを持っているのに対して、 `v-show` はより高い初期描画コストを持っています。 そのため、とても頻繁に何かを切り替える必要があれば `v-show` を選び、条件が実行時に変更することがほとんどない場合は、`v-if` を選びます。

## `v-if` と `v-for`

::: tip Note
`v-if` と `v-for` を同時に利用することは **推奨されません**。 詳細については [スタイルガイド](../style-guide/#avoid-v-if-with-v-for-essential) を参照ください。
:::

`v-if` と `v-for` が同じ要素に両方つかわれる場合、 `v-if` が先に評価されます。詳細については [リストレンダリングのガイド](list#v-for-with-v-if) を参照してください。
