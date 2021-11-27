# Composition API

> このセクションでは、コード例に [単一ファイルコンポーネント](../guide/single-file-component.html) 構文を使用します

## `setup`

コンポーネントが作成される **前に**、一度 `props` が解決されると、このコンポーネントオプションが実行されます。Composition API のエントリポイントとして提供します。

- **引数:**

  - `{Data} props`
  - `{SetupContext} context`

  Options API を使うときの `this.$props` と同様に、`props` オブジェクトには明示的に宣言されたプロパティのみが含まれます。また、すべての宣言されたプロパティのキーは、親コンポーネントから渡されたかどうかに関わらず `props` オブジェクトに存在します。宣言されていない省略可能なプロパティは `undefined` という値になります。

  省略可能なプロパティがないことを確認する必要があるなら、デフォルト値として Symbol を指定できます:

  ```js
  const isAbsent = Symbol()

  export default {
    props: {
      foo: { default: isAbsent }
    },
    setup(props) {
      if (props.foo === isAbsent) {
        // foo は提供されませんでした
      }
    }
  }
  ```

- **型**:

  ```ts
  interface Data {
    [key: string]: unknown
  }

  interface SetupContext {
    attrs: Data
    slots: Slots
    emit: (event: string, ...args: unknown[]) => void
    expose: (exposed?: Record<string, any>) => void
  }

  function setup(props: Data, context: SetupContext): Data
  ```

  ::: tip
  `setup()` に渡された引数の型推論を得るためには、[defineComponent](global-api.html#definecomponent) を使用する必要があります。
  :::

- **例**

  テンプレートを使用する場合:

  ```vue-html
  <!-- MyBook.vue -->
  <template>
    <div>{{ readersNumber }} {{ book.title }}</div>
  </template>

  <script>
    import { ref, reactive } from 'vue'

    export default {
      setup() {
        const readersNumber = ref(0)
        const book = reactive({ title: 'Vue 3 Guide' })

        // テンプレートに公開する
        return {
          readersNumber,
          book
        }
      }
    }
  </script>
  ```

  Render 関数を使用する場合:

  ```js
  // MyBook.vue

  import { h, ref, reactive } from 'vue'

  export default {
    setup() {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })
      // ここでは明示的に ref 値を使う必要があることに注意してください
      return () => h('div', [readersNumber.value, book.title])
    }
  }
  ```

  Render 関数を返す場合は、他のプロパティを返すことはできません。プロパティを公開して、外部からアクセスする必要がある場合、例えば親の `ref` を介してなど、`expose` を使用できます:

  ```js
  // MyBook.vue

  import { h } from 'vue'

  export default {
    setup(props, { expose }) {
      const reset = () => {
        // いくつかのリセットロジック
      }

      // expose は一度しか呼べません。
      // 複数のプロパティを公開する必要があるなら、
      // expose に渡されたオブジェクトにすべてのプロパティを含める必要があります。
      expose({
        reset
      })

      return () => h('div')
    }
  }
  ```

- **参照**: [Composition API `setup`](../guide/composition-api-setup.html)

## ライフサイクルフック

ライフサイクルフックは、直接インポートされた `onX` 関数に登録できます:

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  }
}
```

これらのライフサイクルフック登録関数は、[`setup()`](#setup) の間にのみ、同期的に使用できます。これらの関数は、現在アクティブなインスタンス（今まさに `setup()` が呼び出されているコンポーネントインスタンス）を見つけるために内部のグローバル状態に依存しています。現在アクティブなインスタンスがない状態でそれらを呼び出すと、エラーになります。

コンポーネントのインスタンスコンテキストは、ライフサイクルフックの同期的な実行中にも設定されます。その結果、ライフサイクルフック内で同期的に作成されたウォッチャと算出プロパティも、コンポーネントがアンマウントされるとき自動的に破棄されます。

- **Options API のライフサイクルオプションと Composition API のマッピング**

  - ~~`beforeCreate`~~ -> `setup()` を使用
  - ~~`created`~~ -> `setup()` を使用
  - `beforeMount` -> `onBeforeMount`
  - `mounted` -> `onMounted`
  - `beforeUpdate` -> `onBeforeUpdate`
  - `updated` -> `onUpdated`
  - `beforeUnmount` -> `onBeforeUnmount`
  - `unmounted` -> `onUnmounted`
  - `errorCaptured` -> `onErrorCaptured`
  - `renderTracked` -> `onRenderTracked`
  - `renderTriggered` -> `onRenderTriggered`
  - `activated` -> `onActivated`
  - `deactivated` -> `onDeactivated`


- **参照**: [Composition API ライフサイクルフック](../guide/composition-api-lifecycle-hooks.html)

## Provide / Inject

`provide` と `inject` は依存性の注入を可能にします。 どちらも現在アクティブなインスタンスの [`setup()`](#setup) でのみ呼び出すことができます。

- **型**:

  ```ts
  interface InjectionKey<T> extends Symbol {}

  function provide<T>(key: InjectionKey<T> | string, value: T): void

  // デフォルト値なし
  function inject<T>(key: InjectionKey<T> | string): T | undefined
  // デフォルト値あり
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
  // ファクトリあり
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

  Vue は `Symbol` を拡張したジェネリック型の `InjectionKey` インターフェイスを提供しています。これは Provider（プロバイダ）と Consumer（コンシューマ）の間で注入された値の型を同期するために使用できます:

  ```ts
  import { InjectionKey, provide, inject } from 'vue'

  const key: InjectionKey<string> = Symbol()

  provide(key, 'foo') // string 以外の値を指定するとエラーになります

  const foo = inject(key) // foo の型: string | undefined
  ```

  文字列キーや型指定のない Symbol を使用する場合、注入される値の型を明示的に宣言する必要があります:

  ```ts
  const foo = inject<string>('foo') // string | undefined
  ```

- **参照**:
  - [Provide / Inject](../guide/component-provide-inject.html)
  - [Composition API Provide / Inject](../guide/composition-api-provide-inject.html)

## `getCurrentInstance`

`getCurrentInstance` は内部コンポーネントのインスタンスへのアクセスを可能にします。

:::warning
`getCurrentInstance` は高度なユースケースのみ、通常はライブラリに公開されます。アプリケーションコードで `getCurrentInstance` の使用は強くおすすめしません。Composition API の `this` に相当するものを取得するための避難用ハッチとして **使用しない** でください。
:::

```ts
import { getCurrentInstance } from 'vue'

const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance()

    internalInstance.appContext.config.globalProperties // globalProperties へのアクセス
  }
}
```

`getCurrentInstance` は [setup](#setup) または [ライフサイクルフック](#ライフサイクルフック) 中で **のみ** 動作します。

> [setup](#setup) や [ライフサイクルフック](#ライフサイクルフック) の外で使用する場合は、`setup` で `getCurrentInstance()` を呼び出し、代わりにインスタンスを使用してください。

```ts
const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance() // 動作します

    const id = useComponentId() // 動作します

    const handleClick = () => {
      getCurrentInstance() // 動作しません
      useComponentId() // 動作しません

      internalInstance // 動作します
    }

    onMounted(() => {
      getCurrentInstance() // 動作します
    })

    return () =>
      h(
        'button',
        {
          onClick: handleClick
        },
        `uid: ${id}`
      )
  }
}

// composable で呼び出された場合も動作します
function useComponentId() {
  return getCurrentInstance().uid
}
```
