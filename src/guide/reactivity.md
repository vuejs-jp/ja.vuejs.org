# リアクティブの探求

さらに深く見ていきましょう！Vue の最大の特徴の 1 つは、控えめなリアクティブシステムです。モデルはプロキシされた JavaScript オブジェクトです。それらを変更するとビューが更新されます。これは状態管理を非常にシンプルかつ直感的にしますが、よくある問題を避けるためにその仕組みを理解することも重要です。このセクションでは、Vue のリアクティブシステムに関する低レベルの詳細のいくつかを掘り下げていきます。

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity" title="Vue Mastery でリアクティビティの仕組みを深く学ぶ">Vue Mastery のリアクティブの探求に関する無料ビデオを視聴する</VideoLesson>

# リアクティブとは何か？

この言葉はここ最近のプログラミングで頻繁に目にしますが、それについて言及される時どういう意味で使われているでしょうか？リアクティブは宣言的な方法で変更に対応できるようにするプログラミングのパラダイムです。優れているが故に、標準的な例としてしばしば上げられるのが Excel のスプレッドシートです。

<video width="550" height="400" controls>
  <source src="/images/reactivity-spreadsheet.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

最初のセルに数字の 2 を入力し、2 番目のセルに数字の 3 を入力して SUM を要求すると、スプレッドシートは SUM の結果を返してくれます。なんの驚きもありません。ただし、最初のセルの数字を更新すると、 SUM の結果もなんと自動的に更新されます。

JavaScript は通常このように機能しません。JavaScript で同等のものを書こうとしたら次のようになります：

```js
let val1 = 2
let val2 = 3
let sum = val1 + val2

console.log(sum) // 5

val1 = 3

console.log(sum) // Still 5
```

最初の値を更新しても、合計値は調整されません。

では、 JavaScript を使って以下の要素をどうやって実現するのでしょうか。

ハイレベルな概要として、いくつかのことをできるようにする必要があります:

1. **値が読み込まれたときに追跡する。** 例: `val1 + val2` は `val1` と `val2` の両方を読み込む。
2. **値の変更を検知する。** 例: `val1 = 3` と入れるとき。
3. **最初に値を読み込んだコードを再実行する。** 例: `sum = val1 + val2` を再度実行して、 `sum` の値を更新する。

前の例のコードを使って直接これを行うことはできませんが、あとでこの例に戻って、 Vue のリアクティブなシステムと互換性をもたせる方法を見てみましょう。

まずは、 Vue が上で説明した中核となるリアクティブな要件をどのように実装しているのか、もう少し掘り下げてみましょう。

## Vue がどのコードを実行しているのか知る方法

値が変化したときにいつでも合計するためには、まず合計の算出を関数でラップする必要があります:

```js
const updateSum = () => {
  sum = val1 + val2
}
```

しかし、どうやって Vue にこの機能を伝えるのでしょうか？

Vue はどの関数が現在実行されているのかを、 **作用** を使って追跡します。 作用は、関数が呼び出される直前に追跡を開始する関数のラッパーです。 Vue はどの時点でどの作用が実行されているかを把握して、必要になったときに再度実行することができます。

そのことをより理解するために、似たようなことを Vue を抜きにして自分で実装してみましょう。

必要なものは、このように合計の算出をラップできるものです:

```js
createEffect(() => {
  sum = val1 + val2
})
```

合計がいつ実行されたのか追跡するために、 `createEffect` が必要です。次のような実装になるでしょう:

```js
// 実行している作用のスタックを維持
const runningEffects = []

const createEffect = fn => {
  // 渡された fn を effect 関数でラップ
  const effect = () => {
    runningEffects.push(effect)
    fn()
    runningEffects.pop()
  }

  // 自動的に作用をすぐに実行
  effect()
}
```

作用が呼び出されると `fn` を呼び出す前に、自分自身を `runningEffects` 配列の末尾に追加します。どの作用が現在実行されているかを知る必要があるものは、この配列を確認できます。

作用は多くの重要な昨日の出発点となります。例えば、コンポーネントのレンダリングや算出プロパティはどちらも、内部的に作用を使っています。データの変更にいつでも魔法のように反応するものがあれば、それは間違いなく作用にラップされていると言えるでしょう。

Vue の公開 API には、作用を直接作成する方法は含まれていませんが、 `watchEffect` という関数が公開されています。この関数は先の例にある `createEffect` 関数によく似た振る舞いをします。これについて詳しくは [ガイドの後半](/guide/reactivity-computed-watchers.html#watcheffect) で説明します。

しかし、どのコードが実行されているかを知ることは、パズルの一部にしかすぎません。Vue は、作用が使う値をどのように知り、いつ変更されたかをどのように知るのでしょうか？

## Vue が変更をどのように追跡するのか

先ほどの例のように、ローカル変数の再代入を追跡することはできません。 JavaScript にはそのような仕組みがないからです。オブジェクトのプロパティの変更は追跡することができます。

コンポーネントの `data` 関数からプレーンな JavaScript オブジェクトを返すと、 Vue はそのオブジェクトを `get` と `set` ハンドラを持つ [Proxy](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy) でラップします。プロキシは ES6 で導入されたもので、 Vue 3 では以前のバージョンの Vue にあったリアクティビティに関する注意点のいくつかを回避することができます。

<div class="reactivecontent">
  <common-codepen-snippet title="Proxies and Vue's Reactivity Explained Visually" slug="VwmxZXJ" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

あまりに素っ気なく、理解するには [Proxy](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy) の知識が必要です！もう少しだけ説明しましょう。プロキシについては多くの文献がありますが、本当に知っておくべきことは、 **プロキシとは他のオブジェクトをラップして、そのオブジェクトとのやりとりを傍受できるようにしたオブジェクトである** ということです。

このように使います: `new Proxy(target, handler)`

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property) {
    console.log('intercepted!')
    return target[property]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

ここでは、対象のオブジェクトのプロパティを読み込む試みを傍受しています。このようなハンドラ関数は、 *トラップ* とも呼ばれています。トラップにはいろいろな種類があり、それぞれ異なるタイプのインタラクションを処理します。

コンソールログ以外にも、ここでは思い通りの操作が可能です。必要な場合は、実際の値を _返さない_ ようにすることさえできます。これにより、プロキシは API の作成において強力なものになっています。

プロキシを使う際の 1 つの課題は `this` の束縛です。どのメソッドでも対象のオブジェクトではなく、プロキシに束縛されるようにして、それらを傍受できるようにしたいです。ありがたいことに、 ES6 では `Reflect` という新しい機能が導入され、最小限の労力でこの問題を解決できます:

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

プロキシでリアクティビティの実装をするための最初のステップは、プロパティが読み込まれたときに追跡することです。これはハンドラの中の `track` という関数で行い、 `target` と `property` を返します:

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

`track` の実装は、ここでは示されていません。これは、どの *作用* が現在実行されているのかをチェックして、 `target` と `property` を一緒に記録します。これにより、 Vue はプロパティが作用の依存関係にあることを知ることができます。

最後に、プロパティの値が変わったら、作用を再度実行する必要があります。このためには、プロキシに `set` ハンドラが必要です:

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  },
  set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

以前のこのリストを覚えているでしょうか？ここまでで Vue がこれらの重要なステップをどのように実装しているのか、いくつかの答えが得られました:

1. **値が読み込まれたときに追跡する**: プロキシの `get` ハンドラ内にある `track` 関数が、プロパティと現在の作用を記録します。
2. **値の変更を検知する**: プロキシの `set` ハンドラが呼び出されます。
3. **最初に値を読み込んだコードを再実行する**: `trigger` 関数によって、どの作用がプロパティに依存しているか調べ、それらを実行します。

プロキシされたオブジェクトは、ユーザには見えませんが、内部では Vue が依存関係の追跡やプロパティがアクセスされたり変更されたりしたときの変更通知を行うことができます。注意点としては、コンソールログではプロキシされたオブジェクトのフォーマットが異なるため、 [vue-devtools](https://github.com/vuejs/vue-devtools) をインストールして、より検査しやすいインターフェイスにするとよいです。

最初の例をコンポーネントを使って書き直すと、次のようになります:

```js
const vm = createApp({
  data() {
    return {
      val1: 2,
      val2: 3
    }
  },
  computed: {
    sum() {
      return this.val1 + this.val2
    }
  }
}).mount('#app')

console.log(vm.sum) // 5

vm.val1 = 3

console.log(vm.sum) // 6
```

`data` が返したオブジェクトは、リアクティブプロキシでラップされ、 `this.$data` として保存されます。プロパティの `this.val1` と `this.val2` は、それぞれ `this.$data.val1` と `this.$data.val2` のエイリアスなので、同じプロキシを経由します。

Vue は `sum` 関数を作用でラップします。 `this.sum` にアクセスしようとすると、値を計算するためにその作用が実行されます。 `$data` の周りにあるリアクティブプロキシは、その作用が実行されている間、 `val1` と `val2` プロパティが読み込まれたことを追跡します。

Vue 3 からは、リアクティビティが [別パッケージ](https://github.com/vuejs/vue-next/tree/master/packages/reactivity) になりました。プロキシで `$data` をラップする関数は [`reactive`](/api/basic-reactivity.html#reactive) と呼ばれています。これを自分で直接呼び出すと、コンポーネントを使わずにリアクティブプロキシでオブジェクトをラップすることができます:

```js
const proxy = reactive({
  val1: 2,
  val2: 3
})
```

このガイドの続きでは、 reactivity パッケージが提供する機能について説明します。このパッケージにはすでに紹介した `reactive` や `watchEffect` といった関数が含まれるほか、コンポーネントを作ることなく `computed` や `watch` などの他のリアクティビティの機能を使う方法も含まれています。

## プロキシされたオブジェクト

Vue はリアクティブに作られたすべてのオブジェクトを内部的に追跡するため、常に同じオブジェクトに対して同じプロキシを返します。

ネストされたオブジェクトがリアクティブプロキシからアクセスされると、次のように _そのオブジェクトも_ 返却される前にプロキシに変換されます:

```js{6-7}
const handler = {
  get(target, property, receiver) {
    track(target, property)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
      // ネストしたオブジェクトを独自のリアクティブプロキシでラップする
      return reactive(value)
    } else {
      return value
    }
  }
  // ...
}
```

## プロキシとオリジナルの同一性

プロキシを使用使うことにより、警戒すべき新しい注意点が発生します。プロキシ化されたオブジェクトは、同一性比較 (===) の点で元のオブジェクトと等しくないということです。例えば：

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)

console.log(obj === wrapped) // false
```

`.includes()` や `.indexOf()` などの厳密な等値比較に依存する他の演算も、影響を受ける可能性があります。

ここでのベストプラクティスは、オリジナルの raw オブジェクトへの参照を決して保持せずに、リアクティブ化したオブジェクトでのみ作業を行うことです。:

```js
const obj = reactive({
  count: 0
}) // オリジナルへの参照はなし
```

これにより、均等比較とリアクティビティの両方が期待通りの振る舞いになることが保証されます。

注意点は Vue が数値や文字列などのプリミティブな値をプロキシでラップしないため、これらの値でも `===` を直接使うことができます:

```js
const obj = reactive({
  count: 0
})

console.log(obj.count === 0) // true
```

## 変更に対応するレンダリングの仕組み

コンポーネントのテンプレートは、 [`render`](/guide/render-function.html) 関数にコンパイルされます。 `render` 関数は、コンポーネントのレンダリング方法を記述する [VNode](/guide/render-function.html#仮想-dom-ツリー) を作成します。この関数は、作用にラップされていて、 Vue が実行中に 'touched' したプロパティを追跡できます。

`render` 関数は、概念的に `computed` プロパティと非常によく似ています。 Vue はどのように依存関係が使われているかを正確に追跡しておらず、関数が実行中のある時点で使われていたことだけを知っています。これらのプロパティのいずれかが変更されると、作用の再実行が発火され、 `render` が再実行されて、新しい VNodes が生成されます。これらのプロパティは、 DOM に必要な変更を加えるために使われます。

<div class="reactivecontent">
  <common-codepen-snippet title="Second Reactivity with Proxies in Vue 3 Explainer" slug="wvgqyJK" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

> Vue 2.x 以前を使用している場合は、それらのバージョンに存在する変更検出の注意点に興味があるかもしれません [詳細はこちらをご覧ください](change-detection.md)。
