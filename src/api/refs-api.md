# ref 関連

> このセクションでは、コード例に [単一ファイルコンポーネント](../guide/single-file-component.html) 構文を使用します

## `ref`

内部の値を受け取り、リアクティブでミュータブルな ref オブジェクトを返します。ref オブジェクトには、内部の値を指す単一のプロパティ `.value` があります。

**例:**

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

ref の値としてオブジェクトが割り当てられている場合、そのオブジェクトは [reactive](./basic-reactivity.html#reactive) 関数によってディープなリアクティブになります。

**型:**

```ts
interface Ref<T> {
  value: T
}

function ref<T>(value: T): Ref<T>
```

場合によっては、ref の内部値に複合の型を指定する必要があります。そのような場合には、`ref` を呼び出す際にジェネリクス引数を渡して、デフォルトの推論をオーバーライドすることで、簡潔に指定できます。

```ts
const foo = ref<string | number>('foo') // foo の型: Ref<string | number>

foo.value = 123 // ok!
```

ジェネリックの型が不明な場合は、`ref` を `Ref<T>` にキャストすることをお勧めします:

```ts
function useState<State extends string>(initial: State) {
  const state = ref(initial) as Ref<State> // state.value -> State extends string
  return state
}
```

## `unref`

引数が [`ref`](#ref) の場合はその内部の値を、そうでない場合は引数そのものを返します。これは、`val = isRef(val) ? val.value : val` のシュガー関数です。

```ts
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x) // unwrapped は number であることが保証されます
}
```

## `toRef`

ソースとなるリアクティブオブジェクトのプロパティに対する [`ref`](#ref) を作成するために使用できます。この ref は、ソースのプロパティへのリアクティブな接続を維持したまま、引き渡すことができます。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

`toRef` は、prop の ref をコンポジション関数に渡したいときに便利です:

```js
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  }
}
```

`toRef` は、ソースとなるプロパティが現在存在しない場合でも、使用可能な ref を返します。これは、[toRefs`](#torefs) で取得されない省略可能な props を扱うときに特に便利です。

## `toRefs`

リアクティブなオブジェクトをプレーンオブジェクトに変換します。変換後のオブジェクトの各プロパティは、元のオブジェクトの対応するプロパティを指す [`ref`](#ref) となります。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs の型:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref と元のプロパティは「リンク」している
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

`toRefs` は、コンポジション関数からリアクティブなオブジェクトを返すときに便利で、利用する側のコンポーネントはリアクティビティを失うことなく、返されたオブジェクトを分割代入できます:

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // 状態で動作するロジック

  // 返すときに ref に変換する
  return toRefs(state)
}

export default {
  setup() {
    // リアクティビティを失うことなく分割代入できる
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar
    }
  }
}
```

`toRefs` はソースオブジェクトに含まれるプロパティの ref を生成するだけです。特定のプロパティのリファレンスを作成するには、代わりに [`toRef`](#toref) を使用してください。

## `isRef`

値が ref オブジェクトであるかどうかをチェックします。

## `customRef`

依存関係の追跡と更新のトリガを明示的に制御する、カスタマイズされた ref を作成します。`track` と `trigger` 関数を引数として受け取り、`get` と `set` を持つオブジェクトを返すファクトリ関数が必要です。

- `v-model` でデバウンスを実装するためにカスタム ref を使用した例:

  ```html
  <input v-model="text" />
  ```

  ```js
  function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }

  export default {
    setup() {
      return {
        text: useDebouncedRef('hello')
      }
    }
  }
  ```

**型:**

```ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

## `shallowRef`

自分自身の `.value` の変更を追跡するが、その値をリアクティブにはしない ref を作成します。

```js
const foo = shallowRef({})
// ref の値を変更するのはリアクティブ
foo.value = {}
// ただし、値は変換されない
isReactive(foo.value) // false
```

**参照**: [独立したリアクティブな値を `ref` として作成する](../guide/reactivity-fundamentals.html#独立したリアクティブな値を-ref-として作成する)

## `triggerRef`

[`shallowRef`](#shallowref) に関連付けられている副作用を手動で実行します。

```js
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 初回実行時に "Hello, world" と出力される
watchEffect(() => {
  console.log(shallow.value.greet)
})

// shallowRef なので、これでは副作用をトリガしません
shallow.value.greet = 'Hello, universe'

// "Hello, universe" と出力
triggerRef(shallow)
```

**参照:** [computed と watch - watchEffect](./computed-watch-api.html#watcheffect)
