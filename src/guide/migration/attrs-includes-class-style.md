---
title: class と style を含む $attrs
badges:
  - breaking
---

# `class` と `style` を含む `$attrs` <MigrationBadges :badges="$frontmatter.badges" />

## 概要

`$attrs` は、 `class` と `style` を含む、コンポーネントに渡されるすべての属性が含まれるようになりました。

## 2.x の挙動

`class` と `style` 属性は、Vue 2 の仮想 DOM 実装でいくつかの特別な処理が行われます。そのため、他のすべての属性は含まれていますが、これらは `$attrs` に含まれていません。

この副作用は、 `inheritAttrs: false` を使用した場合に明らかになります:

- `$attrs` に含まれる属性は、自動的にルート要素に追加されなくなり、どこに追加するかは開発者の判断に委ねられます。
- しかし、 `class` と `style` は、 `$attrs` の一部ではないので、コンポーネントのルート要素に適用されます:

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

このような使い方をする場合:

```html
<my-component id="my-id" class="my-class"></my-component>
```

...以下の HTML が生成されます:

```html
<label class="my-class">
  <input type="text" id="my-id" />
</label>
```

## 3.x の挙動

`$attrs` には、すべての属性が含まれているので、すべての属性を別の要素に適用することが簡単にできます。先ほどの例は、次の HTML が生成されます:

```html
<label>
  <input type="text" id="my-id" class="my-class" />
</label>
```

## 移行の戦略

`inheritAttrs: false` を使用しているコンポーネントでは、スタイルの適用が意図したとおりに動作することを確認してください。もし以前に `class` や `style` の特別な動作に依存していた場合、これらの属性が別の要素に適用されている可能性があるため、一部の見た目が崩れている可能性があります。

## 参照

- [関連する RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [移行ガイド - `$listeners` の削除](./listeners-removed.md)
- [移行ガイド - 新しい Emits のオプション](./emits-option.md)
- [移行ガイド - `.native` 修飾子の削除](./v-on-native-modifier-removed.md)
- [移行ガイド - Render 関数 API の変更](./render-function-api.md)
