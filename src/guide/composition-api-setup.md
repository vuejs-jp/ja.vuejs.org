# セットアップ

> このセクションではコード例に[単一ファイルコンポーネント](single-file-component.html)のシンタックスを使います。

> このガイドは[コンポジション API の導入](composition-api-introduction.html)と[リアクティブの基礎](reactivity-fundamentals.html)を既に読んでいることを想定しています。 コンポジション API に初めて触れる方は、まずそちらを読んでみてください。

## 引数

`setup` 関数を使う時、2 つの引数を取ります:

1. `props`
2. `context`

それぞれの引数がどのように使われるのか、深く掘り下げてみましょう。

### プロパティ

`setup` 関数の 第一引数は `props` 引数です。 標準コンポーネントで期待するように、`setup` 関数内の `props` はリアクティブで、新しい props が渡されたら更新されます。

```js
// MyBook.vue

export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

:::warning
しかし、`props` はリアクティブなので、**ES6 の分割代入を使うことができません。** props のリアクティブを削除してしまうからです。
:::

もし、props を分割代入する必要がある場合は、`setup` 関数内で [toRefs](reactivity-fundamentals.html#destructuring-reactive-state) を使うことによって安全に分割代入を行うことができます。

```js
// MyBook.vue

import { toRefs } from 'vue'

setup(props) {
  const { title } = toRefs(props)

  console.log(title.value)
}
```

### コンテキスト

`setup` 関数に渡される第二引数は `context` です。`context` は 3 つのコンポーネントプロパティを公開する一般的な JavaScript オブジェクトです。:

```js
// MyBook.vue

export default {
  setup(props, context) {
    // Attributes (Non-reactive object)
    console.log(context.attrs)

    // Slots (Non-reactive object)
    console.log(context.slots)

    // Emit Events (Method)
    console.log(context.emit)
  }
}
```

`context` オブジェクトは一般的な JavaScript オブジェクトです。 すなわち、リアクティブではありません。これは `context` で ES6 分割代入を安全に使用できることを意味します。

```js
// MyBook.vue
export default {
  setup(props, { attrs, slots, emit }) {
    ...
  }
}
```

`attrs` と `slots` はステートフルなオブジェクトです。コンポーネント自身が更新されたとき、常に更新されます。 つまり、分割代入の使用を避け、`attrs.x` や `slots.x` のようにプロパティを常に参照する必要があります。 また、`props`とは異なり、 `attrs` と `slots` はリアクティブ**ではない**ということに注意してください。 もし、`attrs` か `slots` の変更による副作用を適用したいのなら、`onUpdated` ライフサイクルフックの中で行うべきです。

## コンポーネントプロパティへのアクセス

`setup` が実行されるとき、 コンポーネントインスタンスはまだ作成されていません。そのため、以下のプロパティにのみアクセスすることができます。:

- `props`
- `attrs`
- `slots`
- `emit`

言い換えると、以下のコンポーネントオプションには**アクセスできません**。:

- `data`
- `computed`
- `methods`

## テンプレートでの使用

`setup` がオブジェクトを返す場合、コンポーネントのテンプレート内でオブジェクトのプロパティにアクセスすることができ、 `setup` に渡された `props` のプロパティも同じようにアクセスできます:

```vue-html
<!-- MyBook.vue -->
<template>
  <div>{{ collectionName }}: {{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    props: {
      collectionName: String
    },
    setup(props) {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // expose to template
      return {
        readersNumber,
        book
      }
    }
  }
</script>
```

`setup` から返された [refs](../api/refs-api.html#ref) は、テンプレート内でアクセスされたときに[自動的にアンラップ](/guide/reactivity-fundamentals.html#ref-のアンラップ)されるので、テンプレート内で `.value` を使用すべきではないことに注意してください。

## 描画関数での使用

`setup` は同じスコープで宣言されたリアクティブなステートを直接利用することができる描画関数を返すこともできます。:

```js
// MyBook.vue

import { h, ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    // ここでは明示的に ref の値を公開する必要があることに注意してください。
    return () => h('div', [readersNumber.value, book.title])
  }
}
```

## `this` の使用

**`setup()` 内では、`this` は現在のアクティブなインスタンスへの参照にはなりません。** `setup()` は他のコンポーネントオプションが解決される前に呼び出されるので、`setup()` 内の`this` は他のオプション内の `this`とは全く異なる振る舞いをします。 これは、`setup()` を他のオプション API と一緒に使った場合に混乱を引き起こす可能性があります。
