---
sidebarDepth: 1
---

# グローバル API

CDN ビルドを使っている場合、グローバル API の関数はグローバルな `Vue` オブジェクトを介してアクセスできます。例えば:

```js
const { createApp, h, nextTick } = Vue
```

ES モジュールを使っている場合、それらは直接インポートできます:

```js
import { createApp, h, nextTick } from 'vue'
```

`reactive` や `ref` など、リアクティビティを扱うグローバル関数は、別途ドキュメントがあります。それらの関数は [リアクティビティ API](/api/reactivity-api.html) を参照してください。

## createApp

アプリケーションのコンテキストを提供するアプリケーションインスタンスを返します。このアプリケーションインスタンスがマウントしているコンポーネントツリー全体は、同じコンテキストを共有します。

```js
const app = createApp({})
```

`createApp` の後に他のメソッドをチェインできます。それらは [アプリケーション API](./application-api.html) に記載されています。

### 引数

この関数は最初のパラメータとしてルートコンポーネントのオプションオブジェクトを受け取ります:

```js
const app = createApp({
  data() {
    return {
      ...
    }
  },
  methods: {...},
  computed: {...}
  ...
})
```

2 番目のパラメータでは、そのアプリケーションのルートプロパティを渡せます:

```js
const app = createApp(
  {
    props: ['username']
  },
  { username: 'Evan' }
)
```

```html
<div id="app">
  <!-- Will display 'Evan' -->
  {{ username }}
</div>
```

ルートプロパティは VNode を作成するとき [`h`](#h) に渡されるのと同じように、未加工のプロパティです。コンポーネントプロパティに加えて、ルートコンポーネントに適用される属性やイベントリスナも含めることができます。

### 型定義

```ts
interface Data {
  [key: string]: unknown
}

export type CreateAppFunction<HostElement> = (
  rootComponent: PublicAPIComponent,
  rootProps?: Data | null
) => App<HostElement>
```

## h

一般的に **VNode** と略される「仮想ノード」を返します: これは Vue がページ上でレンダリングするノードの種類を記述した情報を含むプレーンオブジェクトで、子ノードの記述も含まれています。これは手動で書かれた [Render 関数](../guide/render-function.md) のためのものです:

```js
render() {
  return h('h1', {}, 'Some title')
}
```

### 引数

3 つの引数を受け取ります: `type` と `props` と `children`

#### type

- **型:** `String | Object | Function`

- **詳細:**

  HTML タグ名、コンポーネント、非同期コンポーネント、または関数型コンポーネント。 null を返す関数を使うと、コメントがレンダリングされます。このパラメータは必須です。

#### props

- **型:** `Object`

- **詳細:**

  テンプレートで使う属性、プロパティ、イベントに対応するオブジェクトです。省略可能です。

#### children

- **型:** `String | Array | Object`

- **詳細:**

  `h()` を使って構築された子供の VNode、または文字列をつかった「テキスト VNode」、もしくはスロットを持つオブジェクトです。省略可能です。

  ```js
  h('div', {}, [
    'Some text comes first.',
    h('h1', 'A headline'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ])
  ```

## defineComponent

実装的には `defineComponent` なにもせず、渡されたオブジェクトを返します。しかし型付けの面において、返り値は手動の Render 関数、TSX、IDE ツールがサポートするためのコンストラクタの合成型を持っています。

### 引数

コンポーネントのオプションを持つオブジェクトです。

```js
import { defineComponent } from 'vue'

const MyComponent = defineComponent({
  data() {
    return { count: 1 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
```

または `setup` 関数、関数名はコンポーネント名として使われます。

```js
import { defineComponent, ref } from 'vue'

const HelloWorld = defineComponent(function HelloWorld() {
  const count = ref(0)
  return { count }
})
```

## defineAsyncComponent

必要なときにだけ読み込まれる非同期コンポーネントを作成します。

### 引数

基本的な使い方として、 `defineAsyncComponent` は `Promise` を返すファクトリ関数を受け取れます。 Promise の `resolve` コールバックは、サーバからコンポーネントの定義を取得したときに呼び出される必要があります。また、読み込みに失敗したことを示すために `reject(reason)` を呼び出すこともできます。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

[ローカル登録](../guide/component-registration.html#ローカル登録) を使っている場合は、`Promise` を返す関数を直接指定できます:

```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

上級者向けには、 `defineAsyncComponent` で次のようなフォーマットのオブジェクトを受け取ることもできます:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  // ファクトリ関数
  loader: () => import('./Foo.vue'),
  // 非同期コンポーネントが読み込み中に使うコンポーネント
  loadingComponent: LoadingComponent,
  // 読み込みが失敗したときに使うコンポーネント
  errorComponent: ErrorComponent,
  // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
  delay: 200,
  // タイムアウトが指定されていて、それを超えた場合、
  // エラーコンポーネントが表示されます。デフォルト: Infinity.
  timeout: 3000,
  // コンポーネントがサスペンド可能かの定義。デフォルト: true.
  suspensible: false,
  /**
   *
   * @param {*} error エラーメッセージのオブジェクト
   * @param {*} retry 読み込みを待つ Promise がリジェクトされたときに、非同期コンポーネントが再試行するかを示す関数
   * @param {*} fail  失敗時の後処理
   * @param {*} attempts 再試行する最大数
   */
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // fetch のエラーを 3 回まで再試行
      retry()
    } else {
      // retry と fail は Promise の resolve と reject のようなものです:
      // エラー処理を継続するために、これらのうち 1 つが呼び出される必要があります。
      fail()
    }
  },
})
```

**参照**: [動的 & 非同期コンポーネント](../guide/component-dynamic-async.html)

## defineCustomElement <Badge text="3.2+" />

このメソッドは [`defineComponent`](#definecomponent) と同じ引数を受け取りますが、代わりにどのフレームワークでも使える、またはフレームワークなしでも使えるネイティブ [カスタム要素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) を返します。

使用例です:

```html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 通常の Vue コンポーネントオプションはこちら
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement のみ: Shadow root に注入される CSS 
  styles: [`/* inlined css */`]
})

// カスタム要素を登録。
// 登録後、ページ上すべての `<my-vue-element>` タグがアップグレードされます。
customElements.define('my-vue-element', MyVueElement)

// プログラムコードで要素をインスタンス化することもできます:
// （登録後にのみ可能です）
document.body.appendChild(
  new MyVueElement({
    // 初期 props （省略可能）
  })
)
```

Vue による Web コンポーネントのビルドについて、特に単一ファイルコンポーネントについて、詳しくは [Vue と Web コンポーネント](/guide/web-components.html#vue-によるカスタム要素のビルド) を参照してください。

## resolveComponent

:::warning
`resolveComponent` は `render` または `setup` 関数内でのみ使えます。
:::

現在のアプリケーションインスタンスで `component` が利用可能ならば、その名前で解決できます。

`Component` か、見つからなければ引数の `name` を返します。

```js
const app = createApp({})
app.component('MyComponent', {
  /* ... */
})
```

```js
import { resolveComponent } from 'vue'
render() {
  const MyComponent = resolveComponent('MyComponent')
}
```

### 引数

1 つの引数を受け取ります: `name`

#### name

- **型:** `String`

- **詳細:**

  読み込まれたコンポーネント名です。

## resolveDynamicComponent

:::warning
`resolveDynamicComponent` は `render` または `setup` 関数内でのみ使えます。
:::

`<component :is="">` が採用しているのと同じ方法で `component` を解決できます。

解決した `Component` か、コンポーネント名をノードタグに持つ新しく作成された `VNode` を返します。 `Component` が見つからなければ、警告を出します。

```js
import { resolveDynamicComponent } from 'vue'
render () {
  const MyComponent = resolveDynamicComponent('MyComponent')
}
```

### 引数

1 つの引数を受け取ります: `component`

#### component

- **型:** `String | Object (コンポーネントのオプションオブジェクト)`

- **詳細:**

  詳しくは [動的コンポーネント](../guide/component-dynamic-async.html) のドキュメントを参照してください。

## resolveDirective

:::warning
`resolveDirective` は `render` または `setup` 関数内でのみ使えます。
:::

現在のアプリケーションインスタンスで `directive` が利用可能ならば、その名前で解決できます。

`Directive` か、見つからなければ `undefined` を返します。

```js
const app = createApp({})
app.directive('highlight', {})
```

```js
import { resolveDirective } from 'vue'
render () {
  const highlightDirective = resolveDirective('highlight')
}
```

### 引数

1 つの引数を受け取ります: `name`

#### name

- **型:** `String`

- **詳細:**

  読み込まれたディレクティブ名です。

## withDirectives

:::warning
`withDirectives` は `render` または `setup` 関数内でのみ使えます。
:::

ディレクティブを **VNode** に適用できます。ディレクティブを適用した VNode を返します。

```js
import { withDirectives, resolveDirective } from 'vue'
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h('div'), [
  [foo, this.x],
  [bar, this.y]
])
```

### 引数

2 つの引数を受け取ります: `vnode` と `directives`

#### vnode

- **型:** `vnode`

- **詳細:**

  通常 `h()` で作成される仮想ノードです。

#### directives

- **型:** `Array`

- **詳細:**

  ディレクティブの配列です。

  各ディレクティブ自身が配列で、次の例のように 4 つまでの要素を定義できます。

  - `[directive]` - ディレクティブ自身。必須。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective]])
  ```

  - `[directive, value]` - 上記に加えて、ディレクティブに割り当てる `any` 型の値。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective, 100]])
  ```

  - `[directive, value, arg]` - 上記に加えて、`String` の引数、例えば `v-on:click` の `click`。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click']
  ])
  ```

  - `[directive, value, arg, modifiers]` - 上記に加えて、任意の修飾子を定義する `key: value` のペア `Object`。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click', { prevent: true }]
  ])
  ```

## createRenderer

createRenderer 関数は 2 つの一般的な引数を受け取ります:
ホスト環境のノードと要素の型に一致する
`HostNode` と `HostElement` です。

例えば runtime-dom の場合、 HostNode は DOM の `Node` インターフェイスに、
HostElement は DOM の `Element` インターフェイスになります。

カスタムレンダラは、このようにプラットフォーム固有の型を渡せます:

```ts
import { createRenderer } from 'vue'
const { render, createApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
})
```

### 引数

2 つの引数を受け取ります: `HostNode` と `HostElement`

#### HostNode

- **型:** `Node`

- **詳細:**

  ホスト環境のノードです。

#### HostElement

- **型:** `Element`

- **詳細:**

  ホスト環境の要素です。

## nextTick

次の DOM 更新サイクルの後に実行するようにコールバックを遅延します。いくつかのデータを変更した直後に使って、DOM の更新を待ちます。

```js
import { createApp, nextTick } from 'vue'

const app = createApp({
  setup() {
    const message = ref('Hello!')
    const changeMessage = async newMessage => {
      message.value = newMessage
      await nextTick()
      console.log('Now DOM is updated')
    }
  }
})
```

**参照**: [`$nextTick` インスタンスメソッド](instance-methods.html#nexttick)

## mergeProps

VNode のプロパティを含む複数のオブジェクトを受け取り、それらを単一のオブジェクトにマージします。新しく作られたオブジェクトが返され、引数として渡されたオブジェクトは変更されません。

いくつでもオブジェクトを渡すことができますが、後ろの引数のプロパティが優先されます。イベントリスナは `class` や `style` と同じくらい特別に扱われ、これらのプロパティの値は上書きではなくマージされます。

```js
import { h, mergeProps } from 'vue'

export default {
  inheritAttrs: false,

  render() {
    const props = mergeProps(
      {
        // class は $attrs の class とマージされます
        class: 'active'
      },
      this.$attrs
    )

    return h('div', props)
  }
}
```

## useCssModule

:::warning
`useCssModule` は `render` または `setup` 関数内でのみ使えます。
:::

[単一ファイルコンポーネント](/guide/single-file-component.html) の [`setup`](/api/composition-api.html#setup) 関数内で、CSS モジュールにアクセスできるようになります:

```vue
<script>
import { h, useCssModule } from 'vue'

export default {
  setup() {
    const style = useCssModule()

    return () =>
      h(
        'div',
        {
          class: style.success
        },
        'Task complete!'
      )
  }
}
</script>

<style module>
.success {
  color: #090;
}
</style>
```

CSS モジュールの使い方について詳しくは、[SFC Style Features: `<style module>`](/api/sfc-style.html#style-module) を参照してください。

### 引数

1 つの引数を受け取ります: `name`

#### name

- **型:** `String`

- **詳細:**

  CSS モジュール名。デフォルトは `'$style'`。

## version

インストールされている Vue のバージョンを文字列で提供します。

```js
const version = Number(Vue.version.split('.')[0])

if (version === 3) {
  // Vue 3
} else if (version === 2) {
  // Vue 2
} else {
  // Unsupported versions of Vue
}
```

**参照**: [Application API - version](/api/application-api.html#version)
