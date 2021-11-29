# 基本のリアクティビティ API

> このセクションでは、コード例に [単一ファイルコンポーネント](../guide/single-file-component.html) 構文を使用します

## `reactive`

オブジェクトのリアクティブなコピーを返します。

```js
const obj = reactive({ count: 0 })
```

リアクティブの変換は「ディープ」で、ネストされたすべてのプロパティに影響します。[ES2015 Proxy](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy) ベースの実装では、返されたプロキシは元のオブジェクトとは等しく**ありません**。元のオブジェクトに依存せず、リアクティブプロキシのみで作業することをおすすめします。

**型:**

```ts
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```

::: tip Note
`reactive` は、ref のリアクティビティを維持しながら、全ての深さの [ref](./refs-api.html#ref) をアンラップします

```ts
const count = ref(1)
const obj = reactive({ count })

// ref はアンラップされる
console.log(obj.count === count.value) // true

// `obj.count` が更新される
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// `count` の ref も更新される
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```

:::

::: warning Important
`reactive` のプロパティに [ref](./refs-api.html#ref) を代入すると、その ref は自動的にアンラップされます。

```ts
const count = ref(1)
const obj = reactive({})

obj.count = count

console.log(obj.count) // 1
console.log(obj.count === count.value) // true
```

:::

## `readonly`

（リアクティブもしくはプレーンな）オブジェクトや [ref](./refs-api.html#ref) を受け取り、オリジナルへの読み取り専用プロキシを返します。読み取り専用プロキシはディープで、つまりネストされたプロパティへのアクセスも同様に読み取り専用となります。

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // リアクティビティの追跡に機能する
  console.log(copy.count)
})

// original を変更すると、copy に依存しているウォッチャがトリガされます
original.count++

// copy の変更は失敗し、警告が表示されます
copy.count++ // warning!
```

[`reactive`](#reactive) と同様に、プロパティが `ref` を使用している場合、プロキシ経由でアクセスされると自動的にアンラップされます:

```js
const raw = {
  count: ref(123)
}

const copy = readonly(raw)

console.log(raw.count.value) // 123
console.log(copy.count) // 123
```

## `isProxy`

オブジェクトが [`reactive`](#reactive) または [`readonly`](#readonly) で作成されたプロキシかどうかをチェックします。

## `isReactive`

オブジェクトが [`reactive`](#reactive) で作成されたリアクティブプロキシかどうかをチェックします。

```js
import { reactive, isReactive } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    console.log(isReactive(state)) // -> true
  }
}
```

また、[`readonly`](#readonly) で作成されたプロキシが、[`reactive`](#reactive) で作成された別のプロキシをラップしている場合も `true` を返します。

```js{7-15}
import { reactive, isReactive, readonly } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    // プレーンオブジェクトから作成された読み取り専用プロキシ
    const plain = readonly({
      name: 'Mary'
    })
    console.log(isReactive(plain)) // -> false

    // リアクティブプロキシから作成された読み取り専用プロキシ
    const stateCopy = readonly(state)
    console.log(isReactive(stateCopy)) // -> true
  }
}
```

## `isReadonly`

オブジェクトが [`readonly`](#readonly) で作成された読み取り専用プロキシかどうかをチェックします。

## `toRaw`

[`reactive`](#reactive) や [`readonly`](#readonly) プロキシの元のオブジェクトを返します。これは、プロキシのアクセス/トラッキングのオーバヘッドを発生させずに一時的に読み込んだり、変更をトリガせずに書き込んだりするために使える避難用ハッチです。元のオブジェクトへの永続的な参照を保持することは推奨**されません**。注意して使用してください。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

## `markRaw`

プロキシに変換されないようにオブジェクトに印をつけます。オブジェクト自体を返します。

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 他のリアクティブオブジェクト内にネストされている場合にも機能します
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

::: warning
`markRaw` や下記の shallowXXX API を使用すると、デフォルトのディープな reactive/readonly 変換を選択的にオプトアウトして、プロキシされていない生のオブジェクトを状態グラフに埋め込むことができます。これらは様々な理由で使用できます:

- 例えば、複雑なサードパーティのクラス・インスタンスや Vue のコンポーネント・オブジェクトなど、単純にリアクティブにすべきではない値もあります。

- プロキシの変換をスキップすることで、イミュータブルなデータソースで大きなリストをレンダリングする際のパフォーマンスを向上させることができます。

生のオプトアウトがルートレベルでのみ行われ、ネストされた、マークされていない生のオブジェクトをリアクティブオブジェクトにセットし、再びそれにアクセスすると、プロキシされたバージョンが戻ってくるので、これらは高度と考えられます。これにより、オブジェクトの同一性に依存する操作を実行するのに、同じオブジェクトの生のバージョンとプロキシされたバージョンの両方を使用するという、**同一性の危険**が生じる可能性があります:

```js
const foo = markRaw({
  nested: {}
})

const bar = reactive({
  // `foo` は raw として印をつけらているが、foo.nested はそうではない。
  nested: foo.nested
})

console.log(foo.nested === bar.nested) // false
```

同一性の危険は一般的にまれです。しかし、同一性の危険を安全に回避しながらこれらの API を適切に利用するには、リアクティブの仕組みをしっかりと理解する必要があります。
:::

## `shallowReactive`

自身のプロパティのリアクティビティを追跡するリアクティブプロキシを作成しますが、ネストされたオブジェクトのディープなリアクティブ変換は行いません（生の値を公開します）。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// state 自身のプロパティを変更するのはリアクティブ
state.foo++
// ...しかしネストされたオブジェクトは変換されない
isReactive(state.nested) // false
state.nested.bar++ // リアクティブではない
```

[`reactive`](#reactive) と違って、[`ref`](/api/refs-api.html#ref) を使用しているプロパティはプロキシによって自動的にアンラップ**されません**。

## `shallowReadonly`

自身のプロパティを読み取り専用にするプロキシを作成しますが、ネストされたオブジェクトのディープな読み取り専用の変換は行いません（生の値を公開します）。

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// state 自身のプロパティを変更するのは失敗する
state.foo++
// ...しかしネストされたオブジェクトでは動作する
isReadonly(state.nested) // false
state.nested.bar++ // 動作する
```

[`readonly`](#readonly) と違って、[`ref`](/api/refs-api.html#ref) を使用しているプロパティはプロキシによって自動的にアンラップ**されません**。
