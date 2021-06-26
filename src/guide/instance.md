# アプリケーションとコンポーネントのインスタンス

## アプリケーションインスタンスの作成

全ての Vue アプリケーションは `createApp` 関数で新しい **アプリケーションインスタンス (application instance)** を作成するところから始まります:

```js
const app = Vue.createApp({
  /* options */
})
```

アプリケーションインスタンスは、そのアプリケーション内のコンポーネントが使えるグローバル（コンポーネント、ディレクティブ、プラグインなど）を登録するために使われます。詳しいことはガイドの後半で説明しますが、簡単な例をあげると:

```js
const app = Vue.createApp({})
app.component('SearchInput', SearchInputComponent)
app.directive('focus', FocusDirective)
app.use(LocalePlugin)
```

アプリケーションインスタンスが公開するほとんどのメソッドは、同じインスタンスを返すので、チェーンすることができます:

```js
Vue.createApp({})
  .component('SearchInput', SearchInputComponent)
  .directive('focus', FocusDirective)
  .use(LocalePlugin)
```

すべてのアプリケーション API は [API リファレンス](../api/application-api.html) で閲覧できます。

## ルートコンポーネント

`createApp` に渡されたオプションは、**ルートコンポーネント** の設定に使われます。このコンポーネントは、アプリケーションを **マウント** する際に、レンダリングの起点として使われます。

アプリケーションは DOM 要素にマウントする必要があります。例えば、 Vue アプリケーションを `<div id="app"></div>` にマウントしたい場合、 `#app` を渡す必要があります:

```js
const RootComponent = {
  /* オプション */
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')
```

ほとんどのアプリケーションメソッドとは異なり、 `mount` はアプリケーションを返しません。代わりにルートコンポーネントのインスタンスを返します。

厳密には [MVVM パターン](https://en.wikipedia.org/wiki/Model_View_ViewModel) とは関係ないですが、 Vue の設計はその影響を受けています。慣習として、コンポーネントのインスタンスを参照するのに `vm` (ViewModel の略) という変数を使うことがよくあります。

このページのすべての例では 1 つのコンポーネントしか必要としていませんが、実際の多くのアプリケーションでは再利用可能なコンポーネントを入れ子にしたツリー状に構成されています。例えば、 Todo アプリケーションのコンポーネントツリーは次のようになります:

```
Root Component
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

各コンポーネントは、独自のコンポーネントインスタンス `vm` を持ちます。 `TodoItem` のような一部のコンポーネントでは、一度に複数のインスタンスがレンダリングされる可能性があります。このアプリケーションのすべてのコンポーネントインスタンスは、同じアプリケーションインスタンスを共有します。

[コンポーネントシステム](component-basics.html) について詳しくは、後で説明します。とりあえず、 ルートコンポーネントは他のコンポーネントとはなにも違いはないことを認識しておいてください。設定オプションは同じで、対応するコンポーネントインスタンスの振る舞いも同じです。

## コンポーネントインスタンスのプロパティ

このガイドの前半で `data` プロパティについて説明しました。 `data` で定義されたプロパティは、コンポーネントインスタンスを介して公開されます:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4
```

他にもコンポーネントインスタンスにユーザ定義のプロパティを追加する様々なコンポーネントオプション、`methods`、 `props`、 `computed`、 `inject`、 `setup` などがあります。このガイドでは、それぞれについて後で詳しく説明します。コンポーネントインスタンスのすべてのプロパティは、それらがどのように定義されているかに関わらず、コンポーネントのテンプレートからアクセスできます。

Vue はコンポーネントインスタンスを介した `$attrs` や `$emit` などいくつかの組み込みプロパティも公開しています。これらのプロパティは、すべて `$` プレフィックスとなっており、ユーザ定義のプロパティ名と衝突を避けるようになっています。

## ライフサイクルフック

各コンポーネントインスタンスは、作られるときに一連の初期化ステップを通ります。例えば、データ監視の設定、テンプレートのコンパイル、DOM へのインスタンスのマウント、データ変更時の DOM 更新などが必要になります。また、ユーザが特定の段階で独自のコードを追加できるように **ライフサイクルフック** と呼ばれる関数の実行をします。

例えば [created](../api/options-lifecycle-hooks.html#created) フックは、インスタンスの作成後にコードを実行するために使用できます:

```js
Vue.createApp({
  data() {
    return { count: 1 }
  },
  created() {
    // `this` は vm インスタンスを指す
    console.log('count is: ' + this.count) // => "count is: 1"
  }
})
```

[mounted](../api/options-lifecycle-hooks.html#mounted)、[updated](../api/options-lifecycle-hooks.html#updated)、[unmounted](../api/options-lifecycle-hooks.html#unmounted) のように、インスタンスのライフサイクルの他の段階で呼ばれる他のフックもあります。全てのライフサイクルフックは、呼び出し元である現在アクティブなインスタンスを指す `this` コンテキストとともに呼ばれます。

::: tip
[アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)をオプションのプロパティやコールバックに使用しないでください。これは例えば、`created: () => console.log(this.a)` や `vm.$watch('a', newValue => this.myMethod())` のようなことです。アロー関数は `this` を持たないため、`this` は他の変数のように親のスコープ内を辞書探索され、しばしば `Uncaught TypeError: Cannot read property of undefined` や `Uncaught TypeError: this.myMethod is not a function` のようなエラーを起こします。
:::

## ライフサイクルダイアグラム

以下はインスタンスライフサイクルのダイアグラムです。これは今完全に理解する必要はありませんが、さらに学習し実践すれば、便利なリファレンスとなることでしょう。

<img src="/images/lifecycle.svg" width="840" height="auto" style="margin: 0px auto; display: block; max-width: 100%;" loading="lazy" alt="Instance lifecycle hooks">
