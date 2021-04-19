---
badges:
  - new
---

# Fragments <MigrationBadges :badges="$frontmatter.badges" />

## 概要

Vue 3 では、コンポーネントがマルチルートノードコンポーネント、つまりフラグメントを公式にサポートするようになりました！

## 2.x での構文

2.x では、マルチルートコンポーネントはサポートされておらず、ユーザーが誤ってコンポーネントを作成した場合に警告を表示していました。その結果、このエラーを修正するために、多くのコンポーネントが単一の `<div>` で囲むようになりました。

```html
<!-- Layout.vue -->
<template>
  <div>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>
```

## 3.x での構文

3.x では、コンポーネントは複数のルートノードを持つことができるようになりました。しかし、これは開発者が属性をどこに割り当てるかを明示的に定義する必要があります。

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

属性の継承の仕組みについては、[プロパティでない属性](/guide/component-attrs.html)を参照してください。
