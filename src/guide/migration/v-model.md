---
badges:
  - breaking
---

# `v-model` <MigrationBadges :badges="$frontmatter.badges" />

## 概要

こちらが大まかな変更の概要です。

- **破壊的変更:** カスタムコンポーネントで使用する場合に、`v-model` のプロパティとイベントのデフォルト名が変更されます。
  - プロパティ: `value` -> `modelValue`
  - イベント: `input` -> `update:modelValue`
- **破壊的変更:** `v-bind` の `.sync` 修飾子とコンポーネントの `model` オプションは削除され、`v-model` の引数に置き換えられます。
- **新規:** 同じコンポーネントに複数の `v-model` バインディングが可能になりました。
- **新規:** カスタムの `v-model` 修飾子を作成する機能が追加されました。

さらに詳しく知るために読み進めましょう！

## はじめに

Vue 2.0 がリリースされたとき、`v-model` ディレクティブでは、常に `value` プロパティを使う必要がありました。また、異なる目的で複数のプロパティが必要な場合は、`v-bind.sync` を使う必要がありました。さらに、この `v-model` と `value` のハードコードされた関係により、ネイティブ要素とカスタム要素の扱い方に問題が生じていました。

Vue 2.2 では、`model` コンポーネントオプションが導入されました。これにより、コンポーネントが `v-model` で使用するプロパティ名とイベント名を変更できるようになりました。しかし、これでもコンポーネントで使えるのは 1 つの `v-model` だけでした。

Vue 3 では、双方向データバインディングの API が標準化され、混乱を減らし、開発者が `v-model` ディレクティブをより柔軟に使えるようになりました。

## 2.x での構文

2.x では、コンポーネントで `v-model` を使うことは、`value` プロパティを渡して `input` イベントを発火することと同じでした。

```html
<ChildComponent v-model="pageTitle" />

<!-- これは下記の省略形です -->

<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
```

プロパティやイベント名を変更する場合は、`ChildComponent` コンポーネントに `model` オプションを追加します。

```html
<!-- ParentComponent.vue -->

<ChildComponent v-model="pageTitle" />
```

```js
// ChildComponent.vue

export default {
  model: {
    prop: 'title',
    event: 'change'
  },
  props: {
    // これにより、`value` プロパティを別の目的に使えます
    value: String,
    // `value` の代わりに `title` をプロパティに使います
    title: {
      type: String,
      default: 'Default title'
    }
  }
}
```

したがって、この場合の `v-model` は下記の省略形になります。

```html
<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
```

### `v-bind.sync` の使用について

場合によっては、プロパティへの「双方向バインディング」が必要になります（時々、既存の `v-model` に加えて別のプロパティを使うために）。そのためには、`update:myPropName` のパターンでのイベント発火をお勧めしていました。たとえば、`title` プロパティを使用した前の例の `ChildComponent` の場合、新しい値に更新するイベントを次のように発火できました。

```js
this.$emit('update:title', newValue)
```

そうすると、親はそのイベントを購読してローカルのデータプロパティを更新できました。例えば、以下のようになります。

```html
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

便宜上、このパターンには `.sync` 修飾子による省略記法がありました。

```html
<ChildComponent :title.sync="pageTitle" />
```

## 3.x での構文

3.x では、カスタムコンポーネント上の `v-model` は `modelValue` プロパティを渡して `update:modelValue` イベントを発火するのと同じです。

```html
<ChildComponent v-model="pageTitle" />

<!-- これは下記の省略形です -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
```

### `v-model` の引数

モデル名を変更するための `model` コンポーネントオプションの代わりに、今は `v-model` に引数を渡せるようになりました。

```html
<ChildComponent v-model:title="pageTitle" />

<!-- これは下記の省略形です -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

![v-bind anatomy](/images/v-bind-instead-of-sync.png)

これは `.sync` 修飾子の代わりとしても機能し、カスタムコンポーネントに複数の `v-model` を含めることができます。

```html
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />

<!-- これは下記の省略形です -->

<ChildComponent
  :title="pageTitle"
  @update:title="pageTitle = $event"
  :content="pageContent"
  @update:content="pageContent = $event"
/>
```

### `v-model` 修飾子

2.x でのハードコードされた `.trim` のような `v-model` 修飾子に加えて、3.x ではカスタム修飾子をサポートしています。

```html
<ChildComponent v-model.capitalize="pageTitle" />
```

カスタム `v-model` 修飾子の詳細は、[`v-model` 修飾子の処理](../component-custom-events.html#v-model-修飾子の処理) の章を参照してください。

## 移行の戦略

以下をお勧めします。

- コードベースに `.sync` を使用しているかチェックして、`v-model` に置き換えてください。

  ```html
  <ChildComponent :title.sync="pageTitle" />

  <!-- 以下に置き換えましょう -->

  <ChildComponent v-model:title="pageTitle" />
  ```

- 引数のないすべての `v-model` について、プロパティとイベントの名前をそれぞれ `modelValue` と `update:modelValue` に置き換えてください。

  ```html
  <ChildComponent v-model="pageTitle" />
  ```

  ```js
  // ChildComponent.vue

  export default {
    props: {
      modelValue: String // 以前は `value:String` でした
    },
    emits: ['update:modelValue'],
    methods: {
      changePageTitle(title) {
        this.$emit('update:modelValue', title) // 以前は `this.$emit('input', title)` でした
      }
    }
  }
  ```

[移行ビルドのフラグ:](migration-build.html#compat-の設定)

- `COMPONENT_V_MODEL`
- `COMPILER_V_BIND_SYNC`

## 次のステップ

新しい `v-model` 構文の詳細については、以下を参照してください。

- [コンポーネントで `v-model` を使う](../component-basics.html#コンポーネントで-v-model-を使う)
- [`v-model` の引数](../component-custom-events.html#v-model-の引数)
- [`v-model` 修飾子の処理](../component-custom-events.html#v-model-修飾子の処理)
