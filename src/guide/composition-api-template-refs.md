## Template Refs

> この節ではサンプルコードで [単一ファイルコンポーネント](single-file-component.html)の文法を使用しています。

> このガイドはすでに [Composition API 導入](composition-api-introduction.html) を読んでいることを前提に書かれています。もしまだ読んでいないのなら、先に読みましょう。

Composition API を使うとき、 [リアクティブ refs](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) と [テンプレート refs](component-template-refs.html) のコンセプトは同じになります。
テンプレート内の要素やコンポーネントインスタンスの参照を取得するために、 ref 変数を定義して [setup()](composition-api-setup.html) で返します.

```html
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // DOM 要素は初期描画の後に ref に代入されます
        console.log(root.value) // <div>This is a root element</div>
      })

      return {
        root
      }
    }
  }
</script>
```

描画コンテキストに `root` 変数を渡していて、`ref="root"` 経由で div 要素とバインドします. 仮想 DOM のパッチアルゴリズムの中で、 もし VNode の `ref` キーは描画コンテキストの ref に対応すると、VNode の対応する要素またはコンポーネントインスタンスに ref の値が割り当てられます。これは仮想 DOM のマウント/パッチ処理中に実行されるので、テンプレート refs では初期描画に値だけを取得できます。

テンプレート refs　は他の refs と似た挙動をします。つまり、リアクティブかつコンポジション関数に渡せる(または返せる)ことができます。

### Usage with JSX

```js
export default {
  setup() {
    const root = ref(null)

    return () =>
      h('div', {
        ref: root
      })

    // JSX 記法
    return () => <div ref={root} />
  }
}
```

### Usage inside `v-for`

コンポジション API のテンプレート refs を `v-for` 内部で使う時に特別な処理はされないです。代わりに、関数 refs を使って独自処理を実行してください。

```html
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // 忘れずにアップデート前に ref をリセットしてください 
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs
      }
    }
  }
</script>
```
