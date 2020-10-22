---
badges:
  - breaking
---

# `key` 属性 <MigrationBadges :badges="$frontmatter.badges" />

## 概要

- **新着:** Vue が一意の `key` を自動的に生成するようになったため、`v-if`/`v-else`/`v-else-if` 分岐で `key` が不要になりました。
  - **速報:** 手動で `key` を指定する場合、各分岐は一意の `key` を使用する必要があります。 同じ `key` を意図的に使用して分岐を強制的に再利用することはできなくなりました。
- **速報:** `<template v-for>` における `key` は、`<template>` タグに配置する必要があります（子の要素ではない）

## 背景

`key` 属性はノードの ID を追跡するために Vue の仮想 DOM のアルゴリズムのヒントとして使用されます。 こうすることで Vue は既存のノードを再利用してパッチを適用できる時期と、ノードを並べ替えまたは再作成する必要がある時期を識別します。 詳細については、次のセクションを参照してください。

- [リストレンダリング: 状態の維持](/guide/list.html#maintaining-state)
- [API リファレンス: 特別な属性 `key` ](/api/special-attributes.html#key)

## 条件分岐について

Vue 2.x では、`v-if` / `v-else` / `v-else-if` 分岐で `key` を使用することが推奨されていました。

```html
<!-- Vue 2.x -->
<div v-if="condition" key="yes">Yes</div>
<div v-else key="no">No</div>
```

上記の例は、Vue3.x でも機能します。 ただし、`v-if` / `v-else` / `v-else-if` 分岐で `key` 属性を使用することはお勧めしません。条件分岐で `key` を指定しない場合、一意となる `key` が自動的に生成されるようになったためです。

```html
<!-- Vue 3.x -->
<div v-if="condition">Yes</div>
<div v-else>No</div>
```

重大な変更は手動で `key` を指定する場合、各分岐は一意となる `key` を使用する必要があることです。ほとんどの場合、これらの `key` は削除できます。

```html
<!-- Vue 2.x -->
<div v-if="condition" key="a">Yes</div>
<div v-else key="a">No</div>

<!-- Vue 3.x (推奨される解決策：key を削除する) -->
<div v-if="condition">Yes</div>
<div v-else>No</div>

<!-- Vue 3.x (別の解決策：key が常に一意であることを確認してください) -->
<div v-if="condition" key="a">Yes</div>
<div v-else key="b">No</div>
```

## `<template v-for>` の使用

Vue 2.x では、`<template>` タグに `key` を含めることができませんでした。 代わりに、それぞれの子要素に `key` を配置できます。

```html
<!-- Vue 2.x -->
<template v-for="item in list">
  <div :key="item.id">...</div>
  <span :key="item.id">...</span>
</template>
```

Vue 3.x では、`key` を `<template>` タグに配置する必要があります。

```html
<!-- Vue 3.x -->
<template v-for="item in list" :key="item.id">
  <div>...</div>
  <span>...</span>
</template>
```

同様に、子要素が `v-if` を使用する `<template v-for>` を使用する場合、`key` は `<template>` タグに移動する必要があります。

```html
<!-- Vue 2.x -->
<template v-for="item in list">
  <div v-if="item.isVisible" :key="item.id">...</div>
  <span v-else :key="item.id">...</span>
</template>

<!-- Vue 3.x -->
<template v-for="item in list" :key="item.id">
  <div v-if="item.isVisible">...</div>
  <span v-else>...</span>
</template>
```