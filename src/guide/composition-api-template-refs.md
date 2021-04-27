# テンプレート参照

> この節ではコード例で [単一ファイルコンポーネント](single-file-component.html)の文法を使用しています。

> このガイドはすでに [コンポジション API 導入](composition-api-introduction.html) を読んでいることを前提に書かれています。もしまだ読んでいないのなら、先に読みましょう。

コンポジション API を使うとき、 [リアクティブ参照](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) と [テンプレート参照](component-template-refs.html) のコンセプトは同じになります。テンプレート内の要素やコンポーネントインスタンスの参照を取得するために、 ref 宣言して [setup()](composition-api-setup.html) で返します。

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

ここでは、レンダーコンテキスト上に `root` 変数を公開し、`ref="root"` を経由し ref で宣言された変数 と div 要素と束縛します。 仮想 DOM のパッチアルゴリズムの中で、 VNode の `ref` キーがレンダーコンテキストの ref に対応する場合、VNode の対応する要素またはコンポーネントインスタンスに ref の値が代入されます。これは仮想 DOM のマウント/パッチ処理中に実行されるので、テンプレート参照に値が代入されるのは初回レンダリング後になります。

テンプレート参照は他の参照と似た挙動をします。つまり、リアクティブかつコンポジション関数に渡す(または返す)ことができます。

## JSX での使用例

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

## Usage inside `v-for`

コンポジション API のテンプレート参照を `v-for` 内部で使う場合、特別な処理はされません。代わりに、関数を使って ref に独自処理を行うようにします。

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

      // ref が各更新の前に必ずリセットされるようにしてください
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

## Watching Template Refs

Watching a template ref for changes can be an alternative to the use of lifecycle hooks that was demonstrated in the previous examples.

But a key difference to lifecycle hooks is that `watch()` and `watchEffect()` effects are run *before* the DOM is mounted or updated so the template ref hasn't been updated when the watcher runs the effect:

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        // This effect runs before the DOM is updated, and consequently, 
        // the template ref does not hold a reference to the element yet.
        console.log(root.value) // => null
      })

      return {
        root
      }
    }
  }
</script>
```

Therefore, watchers that use template refs should be defined with the `flush: 'post'` option. This will run the effect *after* the DOM has been updated and ensure that the template ref stays in sync with the DOM and references the correct element.

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        console.log(root.value) // => <div></div>
      }, 
      {
        flush: 'post'
      })

      return {
        root
      }
    }
  }
</script>
```

* See also: [Computed and Watchers](./reactivity-computed-watchers.html#effect-flush-timing)
