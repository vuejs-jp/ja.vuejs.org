---
badges:
  - breaking
---

# Render 関数 API <MigrationBadges :badges="$frontmatter.badges" />

## 概要

この変更は `<template>` の利用には影響しません。

以下が変更の簡単な概要になります:

- `h` は render 関数の引数ではなく、グローバルにインポートされます。
- render 関数の引数はステートフルコンポーネントと関数型コンポーネントの間でより一貫性があるものに変更されました。
- VNode のプロパティの構造がフラットになりました。

詳しい情報は以下を読んでください。

## Render 関数の引数

### 2.x での構文

2.x では、 `render` 関数は自動的に `h` 関数（`createElement` の従来のエイリアス）を引数として受け取るようになっていました:

```js
// Vue 2 の Render 関数の例
export default {
  render(h) {
    return h('div')
  }
}
```

### 3.x での構文

3.x では、 `h` は自動的に引数に渡されるのではなくグローバルにインポートされます。

```js
// Vue 3 の Render 関数の例
import { h } from 'vue'

export default {
  render() {
    return h('div')
  }
}
```

## Render 関数のシグネチャの変更

### 2.x での構文

2.x では、 `render` 関数は自動的に `h` として引数を受け取っていました。

```js
// Vue 2 の Render 関数の例
export default {
  render(h) {
    return h('div')
  }
}
```

### 3.x での構文

3.x では、 `render` 関数がなんの引数も受け取らなくなるので、主に `setup()` 関数の中で利用されます。この変更は`setup()` 関数に渡された引数だけでなく、スコープの中で宣言されたリアクティブな状態や関数にアクセスできるという追加の利点があります。

```js
import { h, reactive } from 'vue'

export default {
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0
    })

    function increment() {
      state.count++
    }

    // render 関数を返す
    return () =>
      h(
        'div',
        {
          onClick: increment
        },
        state.count
      )
  }
}
```

`setup()` がどう動作するかについての詳しい情報は、[コンポジション API ガイド](/guide/composition-api-introduction.html)を参照してください。

## VNode のプロパティの形式

### 2.x での構文

2.x では、VNode のプロパティの中に `domProps` がネストされたリストとして含まれていました:

```js
// 2.x
{
  class: ['button', 'is-outlined'],
  style: { color: '#34495E' },
  attrs: { id: 'submit' },
  domProps: { innerHTML: '' },
  on: { click: submitForm },
  key: 'submit-button'
}
```

### 3.x での構文

In 3.x, the entire VNode props structure is flattened. Using the example from above, here is what it would look like now.
3.x では、全ての VNode のプロパティ構造はフラットになりました。上記の例が下記のようになります。

```js
// 3.x での構文
{
  class: ['button', 'is-outlined'],
  style: { color: '#34495E' },
  id: 'submit',
  innerHTML: '',
  onClick: submitForm,
  key: 'submit-button'
}
```

## 移行の戦略

### ライブラリの著者

`h` がグローバルにインポートされるということは、Vue コンポーネントを含むライブラリはどれも `import { h } from 'vue'` という記述がどこかに含まれていることを意味します。結果として、ライブラリの著者はビルドにおいて適切に Vue の外部化を設定することが求められるので、少し手間が増えます:

- Vue はライブラリの中にバンドルされるべきではない
- モジュール向けのビルドでは、インポートはそのまま残されてエンドユーザのバンドラーで処理されるべきです。
- UMD / ブラウザー環境向けのビルドでは、まずグローバルの Vue.h を試して、フォールバックとして require を呼ぶべきです。

## 次のステップ

[Render 関数ガイド](/guide/render-function) でもっと詳しいドキュメントを参照してください！
