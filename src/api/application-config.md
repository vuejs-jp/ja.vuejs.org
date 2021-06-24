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

コンポーネントの Render 関数とウォッチャに捕捉されなかったエラーのハンドラを割り当てます。ハンドラには、アプリケーションのインスタンスとエラーが渡されて呼び出されます。

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

- **Type:** `Object`

Configure runtime compiler options. Values set on this object will be passed to the in-browser template compiler and affect every component in the configured app. Note you can also override these options on a per-component basis using the [`compilerOptions` option](/api/options-misc.html#compileroptions).

::: tip Important
This config option is only respected when using the full build (i.e. the standalone `vue.js` that can compile templates in the browser). If you are using the runtime-only build with a build setup, compiler options must be passed to `@vue/compiler-dom` via build tool configurations instead.

- For `vue-loader`: [pass via the `compilerOptions` loader option](https://vue-loader.vuejs.org/options.html#compileroptions). Also see [how to configure it in `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- For `vite`: [pass via `@vitejs/plugin-vue` options](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom).
:::

### compilerOptions.isCustomElement

- **Type:** `(tag: string) => boolean`

- **Default:** `undefined`

- **Usage:**

```js
// any element starting with 'ion-' will be recognized as a custom one
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

Specifies a method to recognize custom elements defined outside of Vue (e.g., using the Web Components APIs). If component matches this condition, it won't need local or global registration and Vue won't throw a warning about an `Unknown custom element`.

> Note that all native HTML and SVG tags don't need to be matched in this function - Vue parser performs this check automatically.

### compilerOptions.whitespace

- **Type:** `'condense' | 'preserve'`

- **Default:** `'condense'`

- **Usage:**

```js
app.config.compilerOptions.whitespace = 'preserve'
```

By default, Vue removes/condenses whitespaces between template elements to produce more efficient compiled output:

1. Leading / ending whitespaces inside an element are condensed into a single space
2. Whitespaces between elements that contain newlines are removed
3. Consecutive whitespaces in text nodes are condensed into a single space

Setting the value to `'preserve'` will disable (2) and (3).

### compilerOptions.delimiters

- **Type:** `Array<string>`

- **Default:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Usage:**

```js
// Delimiters changed to ES6 template string style
app.config.compilerOptions.delimiters = ['${', '}']    
```

Sets the delimiters used for text interpolation within the template.

Typically this is used to avoid conflicting with server-side frameworks that also use mustache syntax.

### compilerOptions.comments

- **Type:** `boolean`

- **Default:** `false`

- **Usage:**

```js
app.config.compilerOptions.comments = true
```

By default, Vue will remove HTML comments inside templates in production. Setting this option to `true` will force Vue to preserve comments even in production. Comments are always preserved during development.

This option is typically used when Vue is used with other libraries that rely on HTML comments.

## isCustomElement <Badge text="deprecated" type="warning"/>

Deprecated in 3.1.0. Use [`compilerOptions.isCustomElement`](#compileroptions-iscustomelement) instead.
