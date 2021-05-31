# アプリケーション API

Vue 3 では、Vue の動作にグローバルな変更を与える API は、新しい `createApp` メソッドによって作成されたアプリケーションインスタンスへと移行されました。さらに、その効果が適用されるスコープは、指定したアプリケーションのインスタンス内に限定されるようになりました:

```js
import { createApp } from 'vue'

const app = createApp({})
```

`createApp` を呼び出すと、アプリケーションのインスタンスが返されます。このインスタンスはアプリケーションコンテキストを提供します。アプリケーションインスタンスによってマウントされたコンポーネントツリー全体が同じコンテキストを共有し、Vue 2.x で以前は **グローバル** であった設定を提供します。

加えて、 `createApp` メソッドは自身のアプリケーションインスタンスを返すため、今後のセクションにて紹介するように、メソッドに対して他のメソッドをチェーンさせることができます。

## component

- **引数:**

  - `{string} name`
  - `{Function | Object} definition (optional)`

- **返り値:**

  - `definition` 引数が渡されている場合、アプリケーションのインスタンス
  - `definition` 引数が渡されていない場合、コンポーネントの定義

- **使用方法:**

  グローバルコンポーネントを登録または取得します。登録すると、与えられた `name` に対して、コンポーネントの `name` が自動的に設定されます。

- **例:**

```js
import { createApp } from 'vue'

const app = createApp({})

// オブジェクトの登録
app.component('my-component', {
  /* ... */
})

// 登録済みのコンポーネントの取得
const MyComponent = app.component('my-component')
```

- **参照:** [Components](../guide/component-basics.html)

## config

- **使用方法:**

アプリケーションの設定を含む場合に利用

- **例:**

```js
import { createApp } from 'vue'
const app = createApp({})

app.config = {...}
```

- **参照:** [Application Config](./application-config.html)

## directive

- **引数:**

  - `{string} name`
  - `{Function | Object} definition (optional)`

- **返り値:**

  - `definition` 引数が渡された場合はアプリケーションのインスタンス
  - `definition` 引数が渡されていない場合はディレクティブの定義

- **使用方法:**

  グローバルディレクティブを登録または取得します。

- **例:**

```js
import { createApp } from 'vue'
const app = createApp({})

// 登録
app.directive('my-directive', {
  // ディレクティブはライフサイクルのセットをもちます:
  // バインドされた要素の属性やイベントリスナが適用される前に呼び出されます。
  created() {},
  // バインドされた要素の親コンポーネントがマウントされる前に呼び出されます。
  beforeMount() {},
  // バインドされた要素の親コンポーネントがマウントされた後に呼び出されます。
  mounted() {},
  // コンポーネントが含む VNode に更新が行われる前に呼び出されます。
  beforeUpdate() {},
  // コンポーネントが含む VNode 及びその子要素に更新が行われた場合に呼び出されます。
  updated() {},
  // バインドされた要素の親コンポーネントがアンマウントされる前に呼び出されます。
  beforeUnmount() {},
  // バインドされた要素の親コンポーネントがアンマウントされた後に呼び出されます。
  unmounted() {}
})

// 登録 (関数ディレクティブ)
app.directive('my-directive', () => {
  // `mounted` ならびに `updated` にて呼び出されます。
})

// ゲッター。登録されている場合、ディレクティブ定義を返却します。
const myDirective = app.directive('my-directive')
```

ディレクティブフックには、これらの要素が渡されます:

#### el

ディレクティブがバインドされる要素。これを利用することで、 DOM を直接操作できます。

#### binding

このオブジェクトは、以下のプロパティを持ちます。

- `instance`: ディレクティブが使われているコンポーネントのインスタンス。
- `value`: ディレクティブの値。例えば `v-my-directive="1 + 1"` の場合、 value は `2`となります。
- `oldValue`: 以前の値であり、 `beforeUpdate` および `updated` でのみ利用できます。値が変更されているかを判別できます。
- `arg`: 引数がある場合はそれを含むオブジェクト。例えば `v-my-directive:foo` の場合、 arg は `"foo"` となります。
- `modifiers`: 修飾子がある場合はそれを含むオブジェクト。例えば `v-my-directive.foo.bar` の場合、 modifiers オブジェクトは `{ foo: true, bar: true }` となります。
- `dir`: ディレクティブが登録されたとき、パラメータとして渡されるオブジェクト。例えば、このディレクティブ内では

```js
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

`dir` は以下のオブジェクトとなります:

```js
{
  mounted(el) {
    el.focus()
  }
}
```

#### vnode

el にて受け取った実際の DOM 要素の blueprint を表します。

#### prevNode

以前の VNode を表します。`beforeUpdate` および `updated` フックでのみ利用可能です。

:::tip Note
`el` を除き、これらはすべて読み取り専用であり、変更してはいけません。フック間にて情報を共有したい場合、要素の[データセット](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)を通して情報を共有することを推奨します。
:::

- **参照:** [Custom Directives](../guide/custom-directive.html)

## mixin

- **引数:**

  - `{Object} mixin`

- **返り値:**

  - アプリケーションのインスタンス

- **使用方法:**

  アプリケーションスコープ全体に mixin を適用します。一度登録された場合、該当のアプリケーション内の任意のコンポーネントのテンプレートで利用することができます。プラグイン作者がコンポーネントにカスタムの振る舞いを注入するために使用することができます。**アプリケーションコードでは推奨されません。**.

- **参照:** [Global Mixin](../guide/mixins.html#global-mixin)

## mount

- **引数:**

  - `{Element | string} rootContainer`
  - `{boolean} isHydrate (optional)`

- **返り値:**

  - ルートコンポーネントのインスタンス

- **使用方法:**

  渡された DOM 要素に対して、アプリケーションインスタンスのルートコンポーネントをマウントします。

- **例:**

```html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// 必要な事前処理を実行
app.mount('#my-app')
```

- **参照:**
  - [Lifecycle Diagram](../guide/instance.html#lifecycle-diagram)

## provide

- **引数:**

  - `{string | Symbol} key`
  - `value`

- **返り値:**

  - アプリケーションのインスタンス

- **使用方法:**

  アプリケーション内のすべてのコンポーネントがアクセスできる値を設定します。コンポーネントは provide されている値を受け取るためには、 `inject` を使用しなければなりません。

  `provide`/`inject` の観点からはアプリケーションはルートレベルでの祖先であり、ルートコンポーネントはその子コンポーネントであると考えることができます。

  このメソッドは、 Composition API の [provide コンポーネントオプション](options-composition.html#provide-inject)や [provide 関数](composition-api.html#provide-inject)と混同してはいけません。これらも同じ provide/inject メカニズムの一部ですが、アプリケーションではなく、コンポーネントによって提供される値を設定するために利用されます。

  プラグインはコンポーネントを使って値を提供することができないため、アプリケーションを通じて値を提供することは、プラグインを書くときに特に便利です。これは [globalProperties](application-config.html#globalproperties) を使用することの代替となる方法です。

  :::tip Note
  `provide` および `inject` のバインディングはリアクティブではありません。これは意図的な挙動です。 しかし、リアクティブなオブジェクトを設定した場合は、プロパティはリアクティブなままとなります。
  :::

- **例:**

  アプリケーションから提供された値を持つプロパティを、ルートコンポーネントに対して注入します:

```js
import { createApp } from 'vue'

const app = createApp({
  inject: ['user'],
  template: `
    <div>
      {{ user }}
    </div>
  `
})

app.provide('user', 'administrator')
```

- **参照:**
  - [Provide / Inject](../guide/component-provide-inject.md)

## unmount

- **引数:**

  - `{Element | string} rootContainer`

- **使用方法:**

  与えられた引数に合致した DOM 要素のアプリケーションインスタンスのルート要素をアンマウントします。

- **例:**

```html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// 必要な事前処理を実行
app.mount('#my-app')

// アプリケーションは5秒後にアンマウントされます
setTimeout(() => app.unmount('#my-app'), 5000)
```

## use

- **引数:**

  - `{Object | Function} plugin`
  - `...options (optional)`

- **返り値:**

  - アプリケーションのインスタンス

- **使用方法:**

  Vue.js プラグインをインストールします。プラグインが Object の場合は `install` メソッドが必要となります。関数の場合は、それ自体をインストールメソッドとして適用します。

  インストールメソッドはアプリケーションを第一引数に受け取って実行されます。`use` に渡されたあらゆるy `options` は、第二引数以降に渡されます。

  同じプラグインに対してこのメソッドが複数回呼び出された場合、プラグインは一度だけインストールされます。

- **参照:** [Plugins](../guide/plugins.html)
