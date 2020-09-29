# コンポーネントの登録

> このページは [コンポーネントの基本](component-basics.md) を読み終えている事を想定しています。もし読み終えていなければ先にそちらをお読みください。

## コンポーネント名

コンポーネントを登録する際は、必ず名前をつけてください。例えば、グローバル登録の場合は以下のようになります:

```js
const app = Vue.createApp({...})

app.component('my-component-name', {
  /* ... */
})
```

`app.component` の第一引数がコンポーネント名になります。 上記の例では、"my-component-name" がコンポーネント名です。

コンポーネントに付ける名前は使用箇所によって異なります。DOM を直接操作する場合 (文字列テンプレートや [単一ファイルコンポーネント](../guide/single-file-component.html)を除く) は、[W3C rules](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) に従ったカスタムタグ名を強く推奨します:

1. 全て小文字
2. ハイフンを含める (複数の単語をハイフンを用いて繋げる)

こうする事で、既に存在するそして将来的に定義される HTML 要素とのコンフリクトを回避する助けになります。

その他のコンポーネント名の推奨項目は [スタイルガイド](../style-guide/#base-component-names-strongly-recommended) で確認することができます。

### 命名のケース (Name Casing)

コンポーネントを文字列テンプレートか単一ファイルコンポーネントで定義する際は、コンポーネント名に二つの命名規則があります:

#### ケバブケース

```js
app.component('my-component-name', {
  /* ... */
})
```

コンポーネントをケバブケースで定義する場合は、そのカスタム要素を参照する際も `<my-component-name>` のようにケバブケースを用いなければなりません。

#### パスカルケース

```js
app.component('MyComponentName', {
  /* ... */
})
```

コンポーネントをパスカルケースで定義する場合は、そのカスタム要素を参照する際どちらのケースも用いることができます。`<my-component-name>` と `<MyComponentName>` のどちらも利用可能です。 ですが、DOM 内で直接使用する場合 (つまり、文字列テンプレート以外の場合) はケバブケースの方が適している点に注意してください。

## グローバル登録

ここまでは `app.component` だけを使ってコンポーネントを作成しました:

```js
Vue.createApp({...}).component('my-component-name', {
  // ... options ...
})
```

これらのコンポーネントはアプリケーションへの **グローバル登録** とされています。つまり、あらゆるコンポーネントインスタンスのテンプレート内で使用できます:

```js
const app = Vue.createApp({})

app.component('component-a', {
  /* ... */
})
app.component('component-b', {
  /* ... */
})
app.component('component-c', {
  /* ... */
})

app.mount('#app')
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

これはすべてのサブコンポーネントにも当てはまります、つまりこれらの3つのコンポーネントすべてが _相互に使用_ することができます。

## ローカル登録

グローバル登録はしばしば理想的ではありません。例えば、Webpack のようなビルドシステムを利用した場合、全てのコンポーネントをグローバル登録すると、使用していないコンポーネントも最終ビルドに含まれてしまいます。これはユーザーがダウンロードしなければならない JavaScript の量を不必要に増やしてしまう事になります。

以下のケースでは、プレーン JavaScript としてコンポーネントを定義することができます:

```js
const ComponentA = {
  /* ... */
}
const ComponentB = {
  /* ... */
}
const ComponentC = {
  /* ... */
}
```

次に `components` オプション内に使用したいコンポーネントを定義します:

```js
const app = Vue.createApp({
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

`components` オブジェクト内のそれぞれのプロパティは、キーがカスタム要素の名前になり、値はコンポーネントのオプションオブジェクトが含まれます。

**ローカル登録されたコンポーネントはサブコンポーネントでは利用 _できない_** という点に注意してください。例えば、`ComponentA` を `ComponentB` 内で使用可能にしたいときは、以下のように使用する必要があります:

```js
const ComponentA = {
  /* ... */
}

const ComponentB = {
  components: {
    'component-a': ComponentA
  }
  // ...
}
```

または、Babel と Webpack のようなものを用いて ES2015 モジュールを利用している場合は、このようになります:

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
  // ...
}
```

ES2015 移行の場合、`ComponentA` のような変数名をオブジェクト内に配置することは `ComponentA: ComponentA` の省略記法にあたり、変数の名前は次のどちらも意味することに注意して下さい:

- テンプレート内で使用されるカスタム要素名
- コンポーネントオプションを含む変数の名前

## モジュールシステム

もし `import`/`require` を使用したモジュールシステムを使わないのであれば, このセクションはスキップすることができます。そうでなければ、いくつかのインストラクションとコツを教えます。

### モジュールシステム内のローカル登録

もしまだこの記事を読んでいるということは、Webpack や Babel のようなモジュールシステムを利用している可能性が高いでしょう。このような場合は、それぞれのコンポーネントを独自のファイルに持つ `components` ディレクトリを作成することをお勧めします。

次にローカル登録をする前に、使用するコンポーネントごとにインポートする必要があります。例えば、`ComponentB.js` もしくは `ComponentB.vue` ファイルの場合:

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  }
  // ...
}
```

これで `ComponentA` と `ComponentC` が `ComponentB` のテンプレート内で利用できるようになりました。
