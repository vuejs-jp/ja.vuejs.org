# テンプレート参照

> この節ではコード例で [単一ファイルコンポーネント](single-file-component.html)の文法を使用しています。

> このガイドはすでに [Composition API 導入](composition-api-introduction.html) を読んでいることを前提に書かれています。もしまだ読んでいないのなら、先に読みましょう。

Composition API を使うとき、 [リアクティブ参照](reactivity-fundamentals.html#独立したリアクティブな値を-参照-として作成する) と [テンプレート参照](component-template-refs.html) のコンセプトは同じになります。テンプレート内の要素やコンポーネントインスタンスの参照を取得するために、 ref 宣言して [setup()](composition-api-setup.html) で返します。

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

テンプレート参照は他の参照と似た挙動をします。つまり、リアクティブかつ Composition 関数に渡す(または返す)ことができます。

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

## `v-for` 内部での使用

Composition API のテンプレート参照を `v-for` 内部で使う場合、特別な処理はされません。代わりに、関数を使って ref に独自処理を行うようにします。

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

## テンプレート参照の監視

変更のためテンプレート参照の監視をすることは、前の例で説明したライフサイクルフックの使い方に代わる方法です。

しかしライフサイクルフックとの重要な違いは、`watch()` や `watchEffect()` の作用は、DOM がマウントされたり更新されたりする *前に* 実行されるので、ウォッチャが作用を実行したときには、テンプレート参照は更新されていないということです:

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
        // この作用は DOM が更新される前に実行され、
        // 結果的にテンプレート参照は、まだ要素への参照を保持していません。
        console.log(root.value) // => null
      })

      return {
        root
      }
    }
  }
</script>
```

そのため、テンプレート参照を使うウォッチャは、 `flush: 'post'` オプションをつけて定義する必要があります。これにより、DOM が更新された *あとに*　作用が実行され、テンプレート参照が DOM と同期して、正しい要素を参照するようになります。

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

* 参照: [算出プロパティとウォッチ](./reactivity-computed-watchers.html#作用フラッシュのタイミング)
