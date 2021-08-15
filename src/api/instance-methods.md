# インスタンスメソッド

## $watch

- **引数:**

  - `{string | Function} source`
  - `{Function | Object} callback`
  - `{Object} options (optional)`
    - `{boolean} deep`
    - `{boolean} immediate`
    - `{string} flush`

- **返り値:** `{Function} unwatch`

- **使用方法:**

  コンポーネントインスタンスのリアクティブプロパティまたは算出関数（computed function）の変更を監視します。コールバックは指定されたプロパティの新しい値と古い値とともに呼び出されます。トップレベルの `data`、`props`、`computed` プロパティ名は文字列でしか渡すことができません。より複雑な式や、入れ子になったプロパティの場合は、代わりに関数を使います。

- **例:**

  ```js
  const app = createApp({
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 4
        }
      }
    },
    created() {
      // トップレベルのプロパティ名
      this.$watch('a', (newVal, oldVal) => {
        // 何らかの処理
      })

      // 1 つ入れ子になったプロパティを監視する関数
      this.$watch(
        () => this.c.d,
        (newVal, oldVal) => {
          // 何らかの処理
        }
      )

      // 複雑な式を監視する関数
      this.$watch(
        // `this.a + this.b` という式が異なる結果を返すたびに、
        // ハンドラが呼び出されます。これはあたかも算出プロパティを定義することなしに
        // 算出プロパティを監視しているかのようです
        () => this.a + this.b,
        (newVal, oldVal) => {
          // 何らかの処理
        }
      )
    }
  })
  ```

  監視されている値がオブジェクトや配列の場合、それは同じオブジェクトや配列を参照しているため、どんな変更がそのプロパティや要素にあってもウォッチャは実行しません:

  ```js
  const app = createApp({
    data() {
      return {
        article: {
          text: 'Vue is awesome!'
        },
        comments: ['Indeed!', 'I agree']
      }
    },
    created() {
      this.$watch('article', () => {
        console.log('Article changed!')
      })

      this.$watch('comments', () => {
        console.log('Comments changed!')
      })
    },
    methods: {
      // これらのメソッドはオブジェクトや配列のプロパティを変更しただけで、
      // オブジェクトやプロパティ自体は変更していないため、ウォッチャを実行しません
      changeArticleText() {
        this.article.text = 'Vue 3 is awesome'
      },
      addComment() {
        this.comments.push('New comment')
      },

      // これらのメソッドはオブジェクトや配列を完全に置き換えたため、ウォッチャを実行します
      changeWholeArticle() {
        this.article = { text: 'Vue 3 is awesome' }
      },
      clearComments() {
        this.comments = []
      }
    }
  })
  ```

  `$watch` はコールバックの実行を停止するアンウォッチ関数を返します:

  ```js
  const app = createApp({
    data() {
      return {
        a: 1
      }
    }
  })

  const vm = app.mount('#app')

  const unwatch = vm.$watch('a', cb)
  // あとでウォッチャを解体
  unwatch()
  ```

- **オプション: deep**

  オブジェクト内の入れ子になった値の変更も検出するには、オプション引数に `deep: true` を渡す必要があります。このオプションは配列のミューテートを監視するのにも使えます。

  > Note: オブジェクトや配列を（置き換えるのではなく）ミューテートさせて、deep オプションで監視した場合、古い値と新しい値は同じオブジェクトや配列を参照しているため、同じになります。Vue はミューテート前の値のコピーを保持しません。

  ```js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // コールバックを実行
  ```

- **オプション: immediate**

  オプションに `immediate: true` を渡すと、式の現在の値ですぐにコールバックを実行します:

  ```js
  vm.$watch('a', callback, {
    immediate: true
  })
  // `a` の現在の値ですぐに `callback` を実行
  ```

  `immediate` オプションをつけると、最初のコールバックの呼び出しでは与えられたプロパティをアンウォッチできないことに注意してください。

  ```js
  // これはエラーが発生
  const unwatch = vm.$watch(
    'value',
    function() {
      doSomething()
      unwatch()
    },
    { immediate: true }
  )
  ```

  それでもコールバック内でアンウォッチ関数を呼び出したい場合、まずはその有効性を確認する必要があります:

  ```js
  let unwatch = null

  unwatch = vm.$watch(
    'value',
    function() {
      doSomething()
      if (unwatch) {
        unwatch()
      }
    },
    { immediate: true }
  )
  ```

- **オプション: flush**

  `flush` オプションではコールバックのタイミングをより細かく制御することができます。これには `'pre'`、`'post'`、`'sync'` のいずれかを設定できます。

  デフォルト値は `'pre'` で、これはコールバックがレンダリングの前に呼び出されることを指定しています。これによりテンプレートの実行前にコールバックが他の値を更新することができます。

  `'post'` の値はレンダリング後までコールバックを遅延させることができます。これはコールバックが更新された DOM や、`$refs` 経由で子コンポーネントにアクセスする必要がある場合に使います。

  `flush` が `'sync'` に設定された場合、コールバックは値が変更されるとすぐ非同期に呼び出されます。

  `'pre'` と `'post'` のどちらもコールバックは、キューを使ってバッファリングされます。監視されている値が複数回変更されても、コールバックはキューに一度だけ追加されます。中間の値はスキップされて、コールバックには渡されません。

  コールバックのバッファリングはパフォーマンスの向上だけではなく、データの一貫性を確保するのにも役立ちます。ウォッチはデータの更新をするコードが完了するまで起動されません。

  `'sync'` ウォッチャは、これらの利点を持たないため、控えめに使う必要があります。

  `flush` についての詳細な情報は [作用フラッシュのタイミング](../guide/reactivity-computed-watchers.html#作用フラッシュのタイミング) を参照してください。

- **参照:** [ウォッチャ](../guide/computed.html#ウォッチャ)

## $emit

- **引数:**

  - `{string} eventName`
  - `...args (optional)`

  現在のインスタンスでイベントを発動します。追加の引数はリスナーのコールバック関数に渡されます。

- **例:**

  イベント名のみで `$emit` を使う:

  ```html
  <div id="emit-example-simple">
    <welcome-button v-on:welcome="sayHi"></welcome-button>
  </div>
  ```

  ```js
  const app = createApp({
    methods: {
      sayHi() {
        console.log('Hi!')
      }
    }
  })

  app.component('welcome-button', {
    emits: ['welcome'],
    template: `
      <button v-on:click="$emit('welcome')">
        Click me to be welcomed
      </button>
    `
  })

  app.mount('#emit-example-simple')
  ```

  追加の引数と `$emit` を使う:

  ```html
  <div id="emit-example-argument">
    <advice-component v-on:advise="showAdvice"></advice-component>
  </div>
  ```

  ```js
  const app = createApp({
    methods: {
      showAdvice(advice) {
        alert(advice)
      }
    }
  })

  app.component('advice-component', {
    emits: ['advise'],
    data() {
      return {
        adviceText: 'Some advice'
      }
    },
    template: `
      <div>
        <input type="text" v-model="adviceText">
        <button v-on:click="$emit('advise', adviceText)">
          Click me for sending advice
        </button>
      </div>
    `
  })

  app.mount('#emit-example-argument')
  ```

- **参照:**
  - [`emits` オプション](./options-data.html#emits)
  - [イベントと値を発行する](../guide/component-basics.html#イベントと値を発行する)

## $forceUpdate

- **使用方法:**

  コンポーネントインスタンスの再レンダリングを強制します。これはすべての子コンポーネントには影響を与えず、インスタンスそれ自体とスロットのコンテンツが挿入された子コンポーネントにだけ影響します。

## $nextTick

- **引数:**

  - `{Function} callback (optional)`

- **使用方法:**

  次の DOM 更新サイクルの後に実行されるようコールバックを遅延します。なにかデータを変更したすぐ後に使って、DOM の更新を待ちます。これはコールバックの `this` コンテキストがこのメソッドを呼び出したインスタンスに自動的に束縛されることを除いて、グローバルの `nextTick` と同じです。

- **例:**

  ```js
  createApp({
    // ...
    methods: {
      // ...
      example() {
        // データの変更
        this.message = 'changed'
        // DOM はまだ更新されていない
        this.$nextTick(function() {
          // DOM が更新される
          // `this` は現在のインスタンスに束縛される
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **参照:** [nextTick](global-api.html#nexttick)
