---
badges:
  - breaking
---

# スロットの統合 <MigrationBadges :badges="$frontmatter.badges" />

## 概要

この変更により、3.x の通常のスロットとスコープ付きスロットが統合されます。

変更点の概要は次のとおりです:

- `this.$slots` はスロットを関数として公開するようになりました
- **破壊的変更**: `this.$scopedSlots` が削除されました

詳細については、以下をお読みください!

## 2.x 構文

render関数を使用する場合、つまり、`h` は、2.x ではコンテンツノードの `slot` データプロパティを定義するために使用されます。

```js
// 2.x 構文
h(LayoutComponent, [
  h('div', { slot: 'header' }, this.header),
  h('div', { slot: 'content' }, this.content)
])
```

さらに、スコープ付きスロットを参照する場合、次の構文を使用して参照できます:

```js
// 2.x 構文
this.$scopedSlots.header
```

## 3.x 構文

3.x では、スロットはオブジェクトとしての現在のノードの子として定義されています:

```js
// 3.x 構文
h(LayoutComponent, {}, {
  header: () => h('div', this.header),
  content: () => h('div', this.content)
})
```

また、スコープ付きスロットをプログラムで参照する必要がある場合、それらは `$slots` オプションに統合されるようになりました。

```js
// 2.x 構文
this.$scopedSlots.header

// 3.x 構文
this.$slots.header()
```

## 移行戦略

変更の大部分はすでに 2.6 で行われています。その結果、移行は1つのステップで実行できます:

1. 3.x の `this.$scopedSlots` の出現箇所をすべて `this.$slots` に置き換えます。
2. `this.$slots.mySlot` のすべての出現箇所を `this.$slots.mySlot()` に置き換えます。
