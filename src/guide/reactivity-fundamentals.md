# リアクティブの基礎

> このセクションでは、コード例に [単一ファイルコンポーネント](../guide/single-file-component.html) 構文を使用します

## リアクティブな状態の宣言

JavaScript のオブジェクトからリアクティブな状態を作る目的で、`reactive` メソッドを用いることができます:

```js
import { reactive } from 'vue'

// リアクティブな状態
const state = reactive({
  count: 0
})
```

`reactive` は Vue 2.x における `Vue.observable()` API に相当し、RxJS における observables との混同を避けるために改名されました。ここで、返される状態はリアクティブオブジェクトです。リアクティブの変換は "deep" であり、渡されたオブジェクトのすべての入れ子になっているプロパティに影響を与えます。

Vue におけるリアクティブな状態の重要なユースケースはレンダリングの際に用いることができることです。依存関係の追跡のおかげで、リアクティブな状態が変化するとビューが自動的に更新されます。

これがまさに Vue のリアクティブシステムの本質です。コンポーネント内の `data()` でオブジェクトを返す際に、内部的には `reactive()` によってリアクティブを実現しています。テンプレートはこれらのリアクティブなプロパティを利用する [Render 関数](render-function.html)にコンパイルされます。

`reactive` についての詳細は [基本リアクティビティ API](../api/basic-reactivity.html) セクションを参照してください

## 独立したリアクティブな値を `ref` として作成する

独立したプリミティブ値(例えば文字列)があって、それをリアクティブにしたい場合を想像してみてください。もちろん、同じ値の文字列を単一のプロパティとして持つオブジェクトを作成して `reactive` に渡すこともできます。Vue にはこれと同じことをしてくれる `ref` メソッドがあります:

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref` は、オブジェクト内部の値をリアクティブな参照(**ref**rence)として機能させるミュータブルなオブジェクトを返します(これが名前の由来です)。このオブジェクトには `value` という名前のプロパティが 1 つだけ含まれています:

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

### ref のアンラップ

ref がレンダーコンテキスト(render context - [setup()](composition-api-setup.html) によって返されるオブジェクト)のプロパティとして返されていてテンプレート内でアクセスされる場合、自動的に内部の値に浅くアンラップ(ref でラップされた値を取り出す)されます。入れ子になった ref だけが、テンプレート内で `.value` が必要です:

```vue-html
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
    <button @click="nested.count.value ++">Nested Increment count</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count,

        nested: {
          count
        }
      }
    }
  }
</script>
```

:::tip
実際のオブジェクトインスタンスにアクセスしたくない場合は、`reactive` でラップできます:

```js
nested: reactive({
  count
})
```
:::

### リアクティブオブジェクト内でのアクセス

`ref` がリアクティブオブジェクトのプロパティとしてアクセスまたは更新される際に、自動的に内部の値にアンラップされて通常のプロパティのように振る舞います:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

既に ref とリンクしているプロパティに新しい ref が割り当てられた場合、古い ref に取って代わることになります:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```

ref のアンラップはリアクティブな `Object` の中の入れ子となっている場合にのみ発生します。ref が `Array` や [`Map`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map) のようなネイティブのコレクション型からアクセスされた場合、アンラップは行われません:

```js
const books = reactive([ref('Vue 3 Guide')])
// ここでは .value が必要です
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// ここでは .value が必要です
console.log(map.get('count').value)
```

## リアクティブな状態の分割代入

大きなリアクティブオブジェクトのプロパティをいくつかを使いたいときに、[ES6 の分割代入](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)を使ってプロパティを取得したくなることがあります:

```js
import { reactive } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = book
```

残念ながら、このような分割代入をすることで両方のプロパティのリアクティブが失われてしまいます。このような場合においてはリアクティブオブジェクトを ref のセットに変換する必要があります。これらの ref は元となるオブジェクトへのリアクティブな接続を保持します:

```js
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = toRefs(book)

title.value = 'Vue 3 Detailed Guide' // ここで title は ref であるため .value を用いる必要があります
console.log(book.title) // 'Vue 3 Detailed Guide'
```

`ref` で作成した `参照` についての詳細は [参照 (refs) API](../api/refs-api.html#ref) セクションを参照してください

## `readonly` でリアクティブオブジェクトの変更を防ぐ

リアクティブオブジェクト(`ref` や `reactive`)の変更を追跡しながらも、アプリケーションのある場所からの変更は防ぎたい場合があります。例えば、[Provide](component-provide-inject.html) されたリアクティブオブジェクトがある場合、それが注入された場所からの変更は防ぎたいことがあります。そうするために、元のオブジェクトに対する読み取り専用のプロキシを作成します:

```js
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

const copy = readonly(original)

// original を変更すると copy 側の依存ウォッチャが発動します
original.count++

// copy を変更しようとすると失敗し、警告が表示されます
copy.count++ // warning: "Set operation on key 'count' failed: target is readonly."
```
