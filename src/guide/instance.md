# アプリケーションインスタンス

## インスタンスの作成

全ての Vue アプリケーションは `createApp` 関数で新しい **アプリケーションインスタンス (application instance)** を作成するところから始まります:

```js
Vue.createApp(/* options */)
```

インスタンスが作成されたあと、コンテナを `mount` メソッドに渡すことで、これを _マウント_ できます。例えば、Vueアプリケーションを `<div id="app"></div>` にマウントしたいときは、`#app` を渡します:

```js
Vue.createApp(/* options */).mount('#app')
```

[MVVM パターン](https://ja.wikipedia.org/wiki/Model_View_ViewModel)に厳密に関連づけられているわけではないにもかかわらず、Vueの設計は部分的にその影響を受けています。慣例的に、私たちはインスタンスを参照するのに変数 `vm`（ViewModelの短縮形）を使用します。

インスタンスを作成する際には、 **オプションオブジェクト (options object)** を渡すことができます。このガイドの多くは、意図した挙動を作るためにこれらのオプションをどのように使うことができるかを解説します。全てのオプションのリストは [API リファレンス](../api/options-data.html)で読むこともできます。

Vueアプリケーションは、`createApp` で作られたひとつの **ルートインスタンス (root instance)** と、入れ子になった再利用可能なコンポーネントのツリーから成ります。例えば、`todo` アプリケーションのコンポーネントツリーはこのようになるでしょう:

```
Root Instance
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

[コンポーネントシステム](component-basics.html)の詳細は後ほど扱います。いまは、全てのVueコンポーネントもまたインスタンスであり、同じようなオプションオブジェクトを受け入れることだけを知っておいてください。

## データとメソッド

インスタンスは作成時に、`data` で見つけられる全てのプロパティを [Vue の **リアクティブシステム (reactive system)**](reactivity.html)に追加します。これらのプロパティの値が変わると、ビューは"反応 (react)"し、新しい値に追従します。

```js
// データオブジェクト
const data = { a: 1 }

// オブジェクトがルートインスタンスに追加されます
const vm = Vue.createApp({
  data() {
    return data
  }
}).mount('#app')

// インスタンス上のプロパティを取得すると、元のデータのプロパティが返されます
vm.a === data.a // => true

// インスタンス上のプロパティへの代入は、元のデータにも影響されます
vm.a = 2
data.a // => 2
```

このデータが変更されると、ビューが再レンダリングされます。`data` のプロパティは、インスタンスが作成時に存在した場合にのみ **リアクティブ (reactive)** です。次のように新しいプロパティを代入すると:

```js
vm.b = 'hi'
```

`b` への変更はビューへの更新を引き起こしません。あるプロパティがのちに必要であることがわかっているが、最初は空または存在しない場合は、なんらかの初期値を設定する必要があります。例:

```js
data() {
  return {
    newTodoText: '',
    visitCount: 0,
    hideCompletedTodos: false,
    todos: [],
    error: null
  }
}
```

これに対する唯一の例外は `Object.freeze()` を使用し既存のプロパティが変更されるのを防ぐことです。これはリアクティブシステムが変更を _追跡 (track)_ することができないことも意味します。

```js
const obj = {
  foo: 'bar'
}

Object.freeze(obj)

const vm = Vue.createApp({
  data() {
    return obj
  }
}).mount('#app')
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- これでは `foo` は更新されません！ -->
  <button v-on:click="foo = 'baz'">Change it</button>
</div>
```

dataプロパティに加えて、インスタンスはいくつかの便利なプロパティとメソッドを提供します。これらはユーザ定義のプロパティと区別するため、頭に `$` が付けられています。例:

```js
const vm = Vue.createApp({
  data() {
    return {
      a: 1
    }
  }
}).mount('#example')

vm.$data.a // => 1
```

今後、全てのインスタンスプロパティとメソッドのリストを調べるには [API リファレンス](../api/instance-properties.html) を利用できます。

## インスタンスライフサイクルフック

それぞれのインスタンスは、作成時に一連の初期化の手順を踏みます。例えば、データの監視、テンプレートのコンパイル、インスタンスの DOM へのマウント、データ変更時の DOM の変更を準備する必要があります。この中でインスタンスは、特定の段階にコードを追加する機会をユーザに与えるために、**ライフサイクルフック (lifecycle hooks)** と呼ばれる関数を実行します。

例えば [created](../api/options-lifecycle-hooks.html#created) フックは、インスタンスの作成後にコードを実行するために使用できます:

```js
Vue.createApp({
  data() {
    return {
      a: 1
    }
  },
  created() {
    // `this` は vm インスタンスを指します
    console.log('a is: ' + this.a) // => "a is: 1"
  }
})
```

[mounted](../api/options-lifecycle-hooks.html#mounted)、[updated](../api/options-lifecycle-hooks.html#updated)、[unmounted](../api/options-lifecycle-hooks.html#unmounted) のように、インスタンスのライフサイクルの他の段階で呼ばれる他のフックもあります。全てのライフサイクルフックは、呼び出し元である現在アクティブなインスタンスを指す `this` コンテキストとともに呼ばれます。

::: tip
[アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)をオプションのプロパティやコールバックに使用しないでください。これは例えば、`created: () => console.log(this.a)` や `vm.$watch('a', newValue => this.myMethod())` のようなことです。アロー関数は `this` を持たないため、`this` は他の変数のように親のスコープ内を辞書探索され、しばしば `Uncaught TypeError: Cannot read property of undefined` や `Uncaught TypeError: this.myMethod is not a function` のようなエラーを起こします。
:::

## ライフサイクルダイアグラム

以下はインスタンスライフサイクルのダイアグラムです。これは今完全に理解する必要はありませんが、さらに学習し実践すれば、便利なリファレンスとなることでしょう。

<img src="/images/lifecycle.png" width="840" height="auto" style="margin: 0px auto; display: block; max-width: 100%;" loading="lazy" alt="Instance lifecycle hooks">
