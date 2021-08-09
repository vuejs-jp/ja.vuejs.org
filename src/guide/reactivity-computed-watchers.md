# 算出プロパティとウォッチ

> この章では、[単一ファイルコンポーネント](../guide/single-file-component.html)記法を例として使用します。

## 算出プロパティ

開発中に、他の状態に依存した状態が必要となることがあります。Vue では、これをコンポーネントの [算出プロパティ](computed.html#算出プロパティ) として処理します。算出プロパティの作成には、getter 関数を受け取り、関数の返り値に対して、イミュータブルでリアクティブな [ref](./reactivity-fundamentals.html#独立したリアクティブな値を-ref-として作成する) オブジェクトを返却する `computed` メソッドを利用します。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

または、`get` ならびに `set` 関数を用意することで、書き込み可能なオブジェクトを作成できます。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

### Computed Debugging <Badge text="3.2+" />

`computed` accepts a second argument with `onTrack` and `onTrigger` options:

- `onTrack` will be called when a reactive property or ref is tracked as a dependency.
- `onTrigger` will be called when the watcher callback is triggered by the mutation of a dependency.

Both callbacks will receive a debugger event which contains information on the dependency in question. It is recommended to place a `debugger` statement in these callbacks to interactively inspect the dependency:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // triggered when count.value is tracked as a dependency
    debugger
  },
  onTrigger(e) {
    // triggered when count.value is mutated
    debugger
  }
})

// access plusOne, should trigger onTrack
console.log(plusOne.value)

// mutate count.value, should trigger onTrigger
count.value++
```

`onTrack` and `onTrigger` only work in development mode.

## `watchEffect`

リアクティブの状態に応じて、作用を *自動的に適用しなおす* ために、`watchEffect` を利用できます。これは依存関係をリアクティブにトラッキングし、変更されるたびに即座に関数を再実行します。

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

### 監視の停止

`watchEffect` をコンポーネントの [setup()](composition-api-setup.html) 関数または [ライフサイクルフック](composition-api-lifecycle-hooks.html) の中で呼び出すと、ウォッチャはコンポーネントのライフサイクルにリンクされ、コンポーネントのアンマウント時に自動的に監視が停止します。

その他のケースのため、明示的にウォッチャによる監視を停止するための stop ハンドルが返されます:

```js
const stop = watchEffect(() => {
  /* ... */
})

// 処理後
stop()
```

### 副作用の無効化

ウォッチされている関数は、それが無効化された時（つまりは、該当の作用が完了する前に状態が変化した時）にクリーンアップする必要のある非同期の関数を実行することがあります。 watchEffect による関数は、コールバックを無効化するための `onInvalidate` 関数を受け取ることができます。この関数は以下の場合に呼び出されます:

- 該当の作用が再度実行された場合
- ウォッチャが停止した場合（例: `setup()` またはライフサイクルフックの中で `watchEffect` が使用されているコンポーネントがアンマウントされた時）

```js
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // ID が変更されたまたはウォッチャが停止した
    // 以前に pending となった非同期の処理を無効にする
    token.cancel()
  })
})
```

無効化するコールバックを直接返すのではなく、 `onInvalidate` 関数のコールバックを経由して登録しているのは、非同期のエラー処理では、返り値が非常に重要だからです。データ取得を行う時、作用となる関数が非同期であることは非常に一般的なことです:

```js
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {
    /* ... */
  }) // Promise の解決前にクリーンアップする関数を登録
  data.value = await fetchData(props.id)
})
```

非同期関数は暗黙的に Promise を返却しますが、 Promise が resolve される前にクリーンアップ関数を登録する必要があります。Vue は、 Promise チェーンにおける潜在的なエラーを自動的に処理するため、返却される Promise に依存しています。

### 作用フラッシュのタイミング

Vue のリアクティブシステムは、無効になった変更をバッファリングし、非同期に処理することによって、おなじ "tick" の中での複数の状態の変化に対して、不要な重複の呼び出しを避けることができています。内部的には、コンポーネントの `update` 関数も、監視されている作用の 1 つです。ユーザーによる作用がキューに入っている場合、デフォルトではすべてのコンポーネントの更新の **前に** 呼び出されます:

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  setup() {
    const count = ref(0)

    watchEffect(() => {
      console.log(count.value)
    })

    return {
      count
    }
  }
}
</script>
```

この例では:

- count は最初の実行時に同期的に記録されます。
- `count` が変化した時、コンポーネントの **変更前** にコールバック関数が実行されます。

コンポーネントの **更新後に** ウォッチャの作用を再実行する必要がある場合（例: [テンプレート参照](./composition-api-template-refs.md#テンプレート参照の監視) を使っている場合など）、追加の `options` オブジェクトを `flush` オプション（デフォルトは `'pre'`）と一緒に渡すことができます:

```js
// コンポーネントが更新された後に発火、更新された DOM にアクセスできる
// Note: これにより、コンポーネントの最初のレンダリングが終了するまで、
// 作用の初期実行も延期される。
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'post'
  }
)
```

`flush` オプションは `'sync'` も指定できます。これは作用をいつも同期的に発火することを強制します。しかし、これは非効率的であって、ほとんど必要ないでしょう。

In Vue >= 3.2.0, `watchPostEffect` and `watchSyncEffect` aliases can also be used to make the code intention more obvious.

### Watcher のデバッグ

`onTrack` および `onTrigger` オプションは、ウォッチャの振る舞いのデバッグに利用できます。

- `onTrack` はリアクティブプロパティもしくは ref が依存関係として追跡されているときに実行されます。
- `onTrigger` は、依存関係の変更によって、ウォッチャコールバック関数がトリガされているときに実行されます。

どちらのコールバックについても、問題の依存関係に関する情報を含むデバッガイベントを受け取ります。対話的に依存性を検査するために、これらのコールバックに `debugger` 文を記述することを推奨します:

```js
watchEffect(
  () => {
    /* 副作用を持つ処理 */
  },
  {
    onTrigger(e) {
      debugger
    }
  }
)
```

`onTrack` および `onTrigger` は、開発モードでのみ動作します。

## `watch`

`watch` API は、コンポーネントの [watch](computed.html#ウォッチャ) プロパティと完全に同じものです。`watch` は特定のデータソースを監視し、別のコールバック関数内で副作用を適用する必要があります。また、デフォルトでは lazy となっています（つまり、監視しているデータソースが変更された場合に限り、コールバック関数が実行されます）。

- [watchEffect](#watcheffect) と比較して、 `watch` は以下を可能とします:

  - 作用の効率的な実行
  - ウォッチャの再実行条件の明文化
  - ウォッチされている状態に対しての、変更前後の値両方へのアクセス

### 単一のデータソースの監視

ウォッチャのデータソースは、 値を返す gettter 関数か、そのまま `ref` を渡すかになります:

```js
// watching a getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// directly watching a ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### 複数のデータソースの監視

ウォッチャは、配列を利用することで、複数のデータソースを同時に監視できます:

```js
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
```

However, if you are changing both watched sources simultaneously in the same method, the watcher will be executed only once:

```js{9-13}
setup() {
  const firstName = ref('')
  const lastName = ref('')

  watch([firstName, lastName], (newValues, prevValues) => {
    console.log(newValues, prevValues)
  })

  const changeValues = () => {
    firstName.value = 'John'
    lastName.value = 'Smith'
    // logs: ["John", "Smith"] ["", ""]
  }

  return { changeValues }
}
```

Note that multiple synchronous changes will only trigger the watcher once.

It is possible to force the watcher to trigger after every change by using the setting `flush: 'sync'`, though that isn't usually recommended. Alternatively, [nextTick](/api/global-api.html#nexttick) can be used to wait for the watcher to run before making further changes. e.g.:

```js
const changeValues = async () => {
  firstName.value = 'John' // logs: ["John", ""] ["", ""]
  await nextTick()
  lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
}
```

### リアクティブなオブジェクトの監視

ウォッチャを使って、リアクティブな配列やオブジェクトの値を比較するには、値だけのコピーを作っておく必要があります。

```js
const numbers = reactive([1, 2, 3, 4])

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers)
  }
)

numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]
```

深くネストしたオブジェクトや配列のプロパティの変更をチェックするには、やはり `deep` オプションを true にする必要があります:

```js
const state = reactive({
  id: 1,
  attributes: {
    name: ''
  }
})

watch(
  () => state,
  (state, prevState) => {
    console.log('not deep', state.attributes.name, prevState.attributes.name)
  }
)

watch(
  () => state,
  (state, prevState) => {
    console.log('deep', state.attributes.name, prevState.attributes.name)
  },
  { deep: true }
)

state.attributes.name = 'Alex' // Logs: "deep" "Alex" "Alex"
```

しかし、リアクティブなオブジェクトや配列を監視すると、そのオブジェクトの状態の現在値と前回値の両方について参照が常に返されます。深くネストされたオブジェクトや配列を完全に監視するためには、値のディープコピーが必要な場合があります。これは [lodash.cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep) のようなユーティリティで実現できます。

```js
import _ from 'lodash'

const state = reactive({
  id: 1,
  attributes: {
    name: ''
  }
})

watch(
  () => _.cloneDeep(state),
  (state, prevState) => {
    console.log(state.attributes.name, prevState.attributes.name)
  }
)

state.attributes.name = 'Alex'; // Logs: "Alex" ""
```

### `watchEffect` との振る舞いの共有

`watch` は [明示的な停止](#監視の停止)、[副作用の無効化](#副作用の無効化)（代わりに第三引数に `onInvalidate` を渡すことになります）、[作用フラッシュのタイミング](#作用フラッシュのタイミング) ならびに [デバッグ手法](#watcher-のデバッグ) についての挙動を [`watchEffect`](#watcheffect) と共有しています。
