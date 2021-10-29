# computed と watch

> このセクションでは、コード例に [単一ファイルコンポーネント](../guide/single-file-component.html) 構文を使用します

## `computed`

ゲッタ関数を受け取り、ゲッタからの戻り値に対してイミュータブルでリアクティブな [ref](./refs-api.html#ref) オブジェクトを返します。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // エラー
```

または、`get` と `set` 関数のオブジェクトを受け取り、書き込み可能な ref オブジェクトを作成することもできます。

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

**型:**

```ts
// 読み取り専用
function computed<T>(
  getter: () => T,
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>

// 書き込み可能
function computed<T>(
  options: {
    get: () => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>

interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}
```

## `watchEffect`

依存関係をリアクティブに追跡しながら関数を即時実行し、依存関係が変更されるたびに関数を再実行します。

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> 0 がログに出力される

setTimeout(() => {
  count.value++
  // -> 1 がログに出力される
}, 100)
```

**型:**

```ts
function watchEffect(
  effect: (onInvalidate: InvalidateCbRegistrator) => void,
  options?: WatchEffectOptions
): StopHandle

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync' // デフォルト: 'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}

type InvalidateCbRegistrator = (invalidate: () => void) => void

type StopHandle = () => void
```

**参照**: [`watchEffect` ガイド](../guide/reactivity-computed-watchers.html#watcheffect)

## `watchPostEffect` <Badge text="3.2+" />

`flush: 'post'` オプションがついた `watchEffect` のエイリアスです。

## `watchSyncEffect` <Badge text="3.2+" />

`flush: 'sync'` オプションがついた `watchEffect` のエイリアスです。

## `watch`

`watch` API は Options API の [this.\$watch](./instance-methods.html#watch)（および対応する [watch](./options-data.html#watch) オプション）とまったく同等です。`watch` は特定のデータソースを監視する必要があり、別のコールバック関数で副作用を適用します。また、デフォルトでは遅延処理となります。つまり、監視対象のソースが変更されたときにのみコールバックが呼び出されます。

- [watchEffect](#watcheffect) と比較すると、`watch` では以下のことが可能です:

  - 副作用を遅延実行できる。
  - どの状態がウォッチャの再実行をトリガすべきか、より具体的に指定できる。
  - 監視している状態の、以前の値と現在の値の両方にアクセスできる。

### 単一のソースを監視する

ウォッチャのデータソースは、値を返すゲッタ関数か、直接 [ref](./refs-api.html#ref) を指定できます:

```js
// ゲッタを監視
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// ref を直接監視
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### 複数のソースを監視する

ウォッチャは配列を使って複数のソースを同時に監視することもできます:

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

### `watchEffect` との共有動作

`watch` は[手動停止](../guide/reactivity-computed-watchers.html#監視の停止)、[副作用の無効化](../guide/reactivity-computed-watchers.html#副作用の無効化)（`onInvalidate` を第 3 引数としてコールバックに渡す）、[フラッシュのタイミング](../guide/reactivity-computed-watchers.html#作用フラッシュのタイミング)、[デバッグ](../guide/reactivity-computed-watchers.html#watcher-のデバッグ)に関して、[`watchEffect`](#watcheffect) と動作を共有しています。

**型:**

```ts
// 単一のソースを監視する
function watch<T>(
  source: WatcherSource<T>,
  callback: (
    value: T,
    oldValue: T,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions
): StopHandle

// 複数のソースを監視する
function watch<T extends WatcherSource<unknown>[]>(
  sources: T
  callback: (
    values: MapSources<T>,
    oldValues: MapSources<T>,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options? : WatchOptions
): StopHandle

type WatcherSource<T> = Ref<T> | (() => T)

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
}

// 共有オプションについては `watchEffect` の型を参照
interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // デフォルト: false
  deep?: boolean
}
```

**参照**: [`watch` ガイド](../guide/reactivity-computed-watchers.html#watch)
