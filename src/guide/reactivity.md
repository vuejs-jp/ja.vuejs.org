# リアクティブの探求

さらに深く見ていきましょう！Vue の最大の特徴の 1 つは、控えめなリアクティブシステムです。モデルはプロキシされた JavaScript オブジェクトです。それらを変更するとビューが更新されます。これは状態管理を非常にシンプルかつ直感的にしますが、よくある問題を避けるためにその仕組みを理解することも重要です。このセクションでは、Vue のリアクティブシステムに関する低レベルの詳細のいくつかを掘り下げていきます。

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity" title="Learn how how reactivity works in depth with Vue Mastery">Vue Mastery のリアクティブの探求に関する無料ビデオを視聴する</VideoLesson>

# リアクティブとは何か？

この言葉はここ最近のプログラミングで頻繁に目にしますが、それについて言及される時どういう意味で使われているでしょうか？リアクティブは宣言的な方法で変更に対応できるようにするプログラミングのパラダイムです。優れているが故に、標準的な例としてしばしば上げられるのが Excel のスプレッドシートです。

<video width="550" height="400" controls>
  <source src="/images/reactivity-spreadsheet.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

最初のセルに数字の 2 を入力し、2 番目のセルに数字の 3 を入力して SUM を要求すると、スプレッドシートは SUM の結果を返してくれます。なんの驚きもありません。ただし、最初のセルの数字を更新すると、 SUM の結果もなんと自動的に更新されます。

JavaScript は通常このように機能しません。JavaScript で同等のものを書こうとしたら次のようになります：

```js
var val1 = 2
var val2 = 3
var sum = val1 + val2

// sum
// 5

val1 = 3

// sum
// 5
```

最初の値を更新しても、合計値は調整されません。

では、 JavaScript を使って以下の要素をどうやって実現するのでしょうか。

- いずれかの値に変化があった時に検出する
- それを変更する関数を追跡する
- 最終的な値を更新できるように関数を発火させる

## Vue がこれらの変更を追跡する方法

プレーンな JavaScript オブジェクトを `data` オプションとしてアプリケーションまたはコンポーネントインスタンスに渡すと、Vue はそのすべてのプロパティを走査して、ゲッターとセッターのハンドラを使用しそれらを[プロキシ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy)に変換します。 これは ES6 のみの機能ですが、旧式の `Object.defineProperty` を使用した Vue 3 のバージョンを IE ブラウザをサポートするために提供しています。どちらも表面的には同じ API を提供しますが、プロキシバージョンの方がよりスリムで、パフォーマンスが改良されています。

<div class="reactivecontent">
  <iframe height="500" style="width: 100%;" scrolling="no" title="Proxies and Vue's Reactivity Explained Visually" src="https://codepen.io/sdras/embed/zYYzjBg?height=500&theme-id=light&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/sdras/pen/zYYzjBg'>Proxies and Vue's Reactivity Explained Visually</a> by Sarah Drasner
    (<a href='https://codepen.io/sdras'>@sdras</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
</div>

この例はかなり素早いので、理解するには[プロキシ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy)についての知識がある程度必要です！では、少し詳しく見ていきましょう。プロキシに関する文献はたくさんありますが、本当に知っておく必要があることは **プロキシは別のオブジェクトまたは関数を包み、操作を差し込むこと(intercept)ができるオブジェクトだということです。**

proxy は次のように使用します: `new Proxy(target, handler)`

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop) {
    return target[prop]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

今のところは、オブジェクトをラップしてそれをそのまま返すだけです。かっこいいですが、まだ役に立つ物ではありません。しかしこれを見てください。プロキシでラップしている中で、このオブジェクトに操作を差し込むこともできます。この操作の差し込みはトラップと呼ばれています。

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop) {
    console.log(‘intercepted!’)
    return target[prop]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

コンソールログ以外にも、ここでは思い通りの操作が可能です。必要な場合は、実際の値を返さ _ない_ ようにすることさえできます。これにより、プロキシは API の作成において強力なものになっています。

さらに、プロキシは別の機能も提供してくれます。`target[prop]` のような値をただ返すだけではなく、これをさらに一歩進めて `this` のバインディングを適切に行うことができる `Reflect` と呼ばれる機能を使用することができます。これは次のようになります。

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop, receiver) {
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

前述の通り、何らかの変更があった時に最終的な値を更新する API を実装するには、何らかの変更があった時に新しい値を設定する必要があるでしょう。この処理をハンドラー内の `track` という関数で、 `target` と `key` を引数として渡して行います。

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

最後に、何らかの変更があった時に新しい値を設定します。このために、これらの変更を発火させることで、新しいプロキシに変更をセットします。

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    return Reflect.get(...arguments)
  },
  set(target, key, value, receiver) {
    trigger(target, key)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

数段落前のこのリストを覚えていますか？これで Vue がこれらの変更を処理する方法に対するいくつかの回答が出揃いました。

- <strike>いずれかの値に変化があった時に検出する</strike>: プロキシがそれに対する操作の差し込みを可能にしているため、その必要がなくなりました
- **それを変更する関数を追跡する**: これは、 `effect` と呼ばれるプロキシ内のゲッターで行います
- **最終的な値を更新できるように関数を発火させる**: `trigger` と呼ばれるプロキシ内のセッターで行います

プロキシされたオブジェクトはユーザーには見えませんが、内部的にはプロパティがアクセスまたは変更されたときに、Vue が依存関係の追跡と変更通知を実行できるようになっています。 Vue 3 以降、リアクティブは[個別のパッケージ](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)で利用できるようになりました。注意点の 1 つは、変換されたデータオブジェクトがログに記録された時は、ブラウザコンソールが違った整形をすることです。そのため、 [vue-devtools](https://github.com/vuejs/vue-devtools) をインストールして、より見やすいインターフェイスにすることをお勧めします。

## プロキシされたオブジェクト

Vue はリアクティブに作られたすべてのオブジェクトを内部的に追跡するため、常に同じオブジェクトに対して同じプロキシを返します。

ネストされたオブジェクトがリアクティブプロキシからアクセスされると、次のようにそのオブジェクト _も_ 返却される前にプロキシに変換されます:

```js
const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
      return reactive(value)
    } else {
      return value
    }
  }
  // ...
}
```

## プロキシとオリジナルの同一性

プロキシを使用使うことにより、警戒すべき新しい注意点が発生します。プロキシ化されたオブジェクトは、同一性比較 (===) の点で元のオブジェクトと等しくないということです。 例えば：

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)

console.log(obj === wrapped) // false
```

オリジナルとラップされたバージョンはほとんどの場合同じように動作しますが、 `.filter（）` や `.map（）` などの強力な同一性比較に依存する操作は失敗することに注意してください。オプション API を使用する場合、この注意点に出くわすことはほとんどありません。すべてのリアクティブな状態が `this` からアクセスされ、すでにプロキシだということが保証されているためです。

しかし、コンポジション API を使用して明示的にリアクティブオブジェクトを作成する場合、元の生のオブジェクトへの参照を保持せず、次のようにリアクティブバージョンでのみ処理をすることがベストプラクティスです:

```js
const obj = reactive({
  count: 0
}) // no reference to original
```

## ウォッチャ

すべてのコンポーネントインスタンスには対応するウォッチャインスタンスがあり、コンポーネントのレンダリング中に「触れられた」プロパティを依存関係として記録します。後に依存関係にあるもののセッターが発火されると、ウォッチャーに通知され、コンポーネントが再レンダリングされます。

<div class="reactivecontent">
  <iframe height="500" style="width: 100%;" scrolling="no" title="Second Reactivity with Proxies in Vue 3 Explainer" src="https://codepen.io/sdras/embed/GRJZddR?height=500&theme-id=light&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/sdras/pen/GRJZddR'>Second Reactivity with Proxies in Vue 3 Explainer</a> by Sarah Drasner
    (<a href='https://codepen.io/sdras'>@sdras</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
</div>

オブジェクトをデータとしてコンポーネントインスタンスに渡すと、Vue はそれをプロキシに変換します。このプロキシにより、Vue はプロパティがアクセスまたは変更されたときに、依存関係の追跡と変更通知の実行ができるようになります。各プロパティは依存関係と見なされます。

最初のレンダリングの後、コンポーネントはレンダリング中にアクセスしたプロパティを依存関係一覧として追跡します。逆に言えば、コンポーネントはこれらの各プロパティの値を監視する購読者になります。プロキシがセット処理を傍受すると、プロパティは購読されているすべてのコンポーネントに再レンダリングを通知します。

[//]: # 'TODO: Insert diagram'

> Vue 2.x 以前を使用している場合は、それらのバージョンに存在する変更検出の注意点に興味があるかもしれません[詳細はこちらをご覧ください](change-detection.md)。
