# アプリケーション構成

すべての Vue アプリケーションは、そのアプリケーションの構成設定を含む `config` オブジェクトを公開します:

```js
const app = createApp({})

console.log(app.config)
```

アプリケーションをマウントする前に、以下に列挙したプロパティを変更することができます。

## errorHandler

- **型:** `Function`

- **デフォルト:** `undefined`

- **使用方法:**

```js
app.config.errorHandler = (err, vm, info) => {
  // エラーハンドリング
  // `info` は、Vue 固有のエラー情報です。例: ライフサイクルフック
  // エラーが見つかった際の処理
}
```

コンポーネントの Render 関数とウォッチャに捕捉されなかったエラーのハンドラを割り当てます。ハンドラは、エラーと対応するアプリケーションのインスタンスが渡されて呼び出されます。

> エラートラッキングサービスの [Sentry](https://sentry.io/for/vue/) ならびに [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/) は公式に連携のためのオプションを用意しています。

## warnHandler

- **型:** `Function`

- **デフォルト:** `undefined`

- **使用方法:**

```js
app.config.warnHandler = function(msg, vm, trace) {
  // `trace` は、コンポーネント階層のトレースです。
}
```

Vue の warning のためのカスタムハンドラを割り当てます。開発環境でのみ動き、プロダクションでは動作しないことに注意してください。

## globalProperties

- **型:** `[key: string]: any`

- **デフォルト:** `undefined`

- **使用方法:**

```js
app.config.globalProperties.foo = 'bar'

app.component('child-component', {
  mounted() {
    console.log(this.foo) // 'bar'
  }
})
```

アプリケーション内のあらゆるコンポーネントのインスタンスからアクセスできるグローバルなプロパティを追加します。名称が競合した場合、コンポーネントのプロパティが優先されます。

これは、 Vue 2.x における `Vue.prototype` 拡張を置き換えることができます:

```js
// Before
Vue.prototype.$http = () => {}

// After
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

## optionMergeStrategies

- **型:** `{ [key: string]: Function }`

- **デフォルト:** `{}`

- **使用方法:**

```js
const app = createApp({
  mounted() {
    console.log(this.$options.hello)
  }
})

app.config.optionMergeStrategies.hello = (parent, child) => {
  return `Hello, ${child}`
}

app.mixin({
  hello: 'Vue'
})

// 'Hello, Vue'
```

カスタムオプションのマージ戦略を定義します。

マージ戦略は、親インスタンスと子インスタンスで定義されたオプションの値をそれぞれ第 1 引数と第 2 引数として受け取ります。

- **参照:** [Custom Option Merging Strategies](../guide/mixins.html#custom-option-merge-strategies)

## performance

- **型:** `boolean`

- **デフォルト:** `false`

- **使用方法**:

コンポーネントの初期化で `true` に設定することで、ブラウザの devtool 内の performance/timeline パネルにて、レンダリングおよびパッチにおけるパフォーマンスの追跡が可能となります。development モード並びに[performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API が有効なブラウザでのみ機能します。

## compilerOptions <Badge text="3.1+" />

- **型:** `Object`

ランタイムコンパイラのオプションを設定します。このオブジェクトに設定された値は、ブラウザ内テンプレートコンパイラに渡され、設定されたアプリケーションのすべてのコンポーネントに影響を与えます。また、[`compilerOptions` オプション](/api/options-misc.html#compileroptions) を使って、コンポーネントごとにオプションを上書きすることもできます。

::: tip Important
この設定オプションはフルビルド（例えば、ブラウザでテンプレートをコンパイルできるスタンドアロンの `vue.js`）を使ったときにのみ尊重されます。ビルドの設定でランタイムのみのビルドを使っている場合、コンパイラのオプションは変わりにビルドツールの設定を介して `@vue/compiler-dom` に渡す必要があります。

- `vue-loader` 向け: [`compilerOptions` ローダーオプションを介して渡します](https://vue-loader.vuejs.org/options.html#compileroptions)。[`vue-cli` での設定方法](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader) も参照してください。

- `vite` 向け: [`@vitejs/plugin-vue` オプションを介して渡します](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom)。
:::

### compilerOptions.isCustomElement

- **型:** `(tag: string) => boolean`

- **デフォルト:** `undefined`

- **使用方法:**

```js
// 'ion-' で始まる要素は、カスタム要素として認識されます
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

Vue の外部で（例えば、Web Components API を使って）定義されたカスタム要素を認識する方法を指定します。コンポーネントがこの条件に一致した場合、ローカルまたはグローバルでの登録が必要なくなり、 Vue は `Unknown custom element` の警告を出しません。

> この関数では、すべてのネイティブ HTML と SVG のタグについて一致させる必要はありません。 Vue パーサはこの確認を自動的に行います。

### compilerOptions.whitespace

- **型:** `'condense' | 'preserve'`

- **デフォルト:** `'condense'`

- **使用方法:**

```js
app.config.compilerOptions.whitespace = 'preserve'
```

デフォルトで、Vue はより効率的なコンパイル出力を行うために、テンプレート要素間のホワイトスペースを削除・圧縮します:

1. 要素内の先頭・末尾のホワイトスペースが 1 つのスペースに圧縮されます
2. 改行を含む要素間のホワイトスペースが削除されます
3. テキストノード内の連続したホワイトスペースが 1 つのスペースに圧縮されます

値を `'preserve'` に設定すると、 (2) と (3) が無効になります。

### compilerOptions.delimiters

- **型:** `Array<string>`

- **デフォルト:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **使用方法:**

```js
// デリミタを ES6 のテンプレートリテラルのスタイルに変更
app.config.compilerOptions.delimiters = ['${', '}']    
```

テンプレート内のテキスト補間に利用されるデリミタを設定します。

一般的には、 mustache 構文を利用しているサーバサイドフレームワークとの衝突を避けるために使われます。

### compilerOptions.comments

- **型:** `boolean`

- **デフォルト:** `false`

- **使用方法:**

```js
app.config.compilerOptions.comments = true
```

デフォルトで、Vue は本番向けにテンプレート内の HTML コメントを削除します。このオプションを `true` に設定すると、本番向けでも Vue はコメントを残すようになります。開発中には常にコメントが残されます。

このオプションは一般的に、Vue が HTML コメントに依存する他のライブラリと一緒に利用される場合に使われます。

## isCustomElement <Badge text="deprecated" type="warning"/>

3.1.0 では非推奨です。代わりに [`compilerOptions.isCustomElement`](#compileroptions-iscustomelement) を使ってください。
