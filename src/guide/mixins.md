# ミックスイン

## 基本

ミックスイン (mixin) は、Vue コンポーネントに再利用可能な機能を提供します。ミックスインオブジェクトは任意のコンポーネントオプションを含むことができます。コンポーネントがミックスインを使用するとき、ミックスインの全てのオプションはコンポーネント自身のオプションに"混ぜられ"ます。

例:

```js
// ミックスインオブジェクトを定義
const myMixin = {
  created() {
    this.hello()
  },
  methods: {
    hello() {
      console.log('hello from mixin!')
    }
  }
}

// このミックスインを使用する app を定義
const app = Vue.createApp({
  mixins: [myMixin]
})

app.mount('#mixins-basic') // => "hello from mixin!"
```

## オプションのマージ

ミックスインとコンポーネントそれ自身が重複したオプションを含むとき、それらは適切なストラテジを使用して"マージ"されます。

例えば、各ミックスインはそれぞれの `data` 関数を持つことができます。それぞれの関数が呼び出され、返されたオブジェクトがマージされます。コンフリクトした場合には、コンポーネント自身のデータのプロパティが優先されます。

```js
const myMixin = {
  data() {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  data() {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created() {
    console.log(this.$data) // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

同じ名前のフック関数はそれら全てが呼び出されるよう配列にマージされます。ミックスインのフックはコンポーネント自身のフック**前**に呼び出されます。

```js
const myMixin = {
  created() {
    console.log('mixin hook called')
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  created() {
    console.log('component hook called')
  }
})

// => "mixin hook called"
// => "component hook called"
```

オブジェクトの値を期待するオプション、例えば、`methods`、`components`、そして`directives` では同じオブジェクトにマージされます。これらのオブジェクトでキーのコンフリクトがあるときは、コンポーネントオプションが優先されます:

```js
const myMixin = {
  methods: {
    foo() {
      console.log('foo')
    },
    conflicting() {
      console.log('from mixin')
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  methods: {
    bar() {
      console.log('bar')
    },
    conflicting() {
      console.log('from self')
    }
  }
})

const vm = app.mount('#mixins-basic')

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

## グローバルミックスイン

Vue アプリケーションのためにグローバルにミックスインを適用することもできます:

```js
const app = Vue.createApp({
  myOption: 'hello!'
})

// `myOption` カスタムオプションにハンドラを注入する
app.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

app.mount('#mixins-global') // => "hello!"
```

使用に注意してください！一度、グローバルにミックスインを適用すると、それはその後にアプリ内で作成される**全ての** Vue コンポーネントインスタンスに影響します。 (例えば、子コンポーネント):

```js
const app = Vue.createApp({
  myOption: 'hello!'
})

// `myOption` カスタムオプションにハンドラを注入する
app.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

// myOption を子コンポーネントにも追加
app.component('test-component', {
  myOption: 'hello from component!'
})

app.mount('#mixins-global')

// => "hello!"
// => "hello from component!"
```

ほとんどの場合、上記の例のようなカスタムオプションを処理するものだけに使用すべきです。重複適用を避けるために、それらを [プラグイン](plugins.html) として作成することも良い方法です。

## カスタムオプションのマージストラテジ

カスタムオプションがマージされるとき、それらは既存の値を上書きするデフォルトのストラテジを使用します。カスタムロジックを使用してカスタムオプションをマージしたい場合は、`app.config.optionMergeStrategies` をアタッチする必要があります。

```js
const app = Vue.createApp({})

app.config.optionMergeStrategies.customOption = (toVal, fromVal) => {
  // マージされた値を返す
}
```

マージストラテジは、親・子インスタンスで定義されたオプションの値をそれぞれ 1 番目、2 番目の引数として受け取ります。ミックスインを使用するときに、これらのパラメータに何が入っているかを確認してみましょう:

```js
const app = Vue.createApp({
  custom: 'hello!'
})

app.config.optionMergeStrategies.custom = (toVal, fromVal) => {
  console.log(fromVal, toVal)
  // => "goodbye!", undefined
  // => "hello", "goodbye!"
  return fromVal || toVal
}

app.mixin({
  custom: 'goodbye!',
  created() {
    console.log(this.$options.custom) // => "hello!"
  }
})
```

上記の通り、コンソールには最初にミックスインから、次に `app` から出力された `toVal` と `fromVal` が表示されます。`fromVal` が存在する場合には常にそれが返されるため、最終的には `this.$options.custom` に `hello!` がセットされます。ストラテジを*常に子インスタンスの値を返す*ように変更してみましょう:

```js
const app = Vue.createApp({
  custom: 'hello!'
})

app.config.optionMergeStrategies.custom = (toVal, fromVal) => toVal || fromVal

app.mixin({
  custom: 'goodbye!',
  created() {
    console.log(this.$options.custom) // => "goodbye!"
  }
})
```

## 欠点について

Vue 2 では、ミックスインはコンポーネントロジックの一部を再利用可能なチャンクに抽象化する主要なツールでした。ただし、いくつかの問題があります:

- ミックスインはコンフリクトしやすい: それぞれのミックスインのプロパティが同じコンポーネントにマージされるので、プロパティ名のコンフリクトを避けるために、すべての他のミックスインについて知っておく必要があります。

- どこからともなく現れたようなプロパティ: コンポーネントが複数のミックスインを使っている場合、どのプロパティがどのミックスインからきたものなのか、必ずしも明らかではありません。

- 再利用性は制限されている: ロジックを変更するためのパラメータをミックスインに渡せないことは、抽象化ロジックに関する柔軟性を低下させます。

これらの問題に対処するため、論理的な関心事によってコードを整理する新しい方法を追加しました: [コンポジション API](composition-api-introduction.html)
