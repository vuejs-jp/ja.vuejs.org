# クラスとスタイルのバインディング

データバインディングに一般に求められることの 1 つは、要素のクラスリストとインラインスタイルを操作することです。それらはどちらも属性であるため、`v-bind` を使って扱うことができます。最終的な文字列を式で計算するだけです。しかしながら、文字列の連結に手を出すのは煩わしく、エラーのもとです。そのため、Vue は `v-bind` が `class` と `style` と一緒に使われるとき、特別な拡張機能を提供します。文字列だけではなく、式はオブジェクトまたは配列を返すことができます。

## HTML クラスのバインディング

### オブジェクト構文

`:class` (`v-bind:class` の略) にオブジェクトを渡すことでクラスを動的に切り替えることができます:

```html
<div :class="{ active: isActive }"></div>
```

上記の構文は、`active` クラスの有無がデータプロパティ `isActive` の[真偽性](https://developer.mozilla.org/ja-JP/docs/Glossary/Truthy)によって決まることを意味しています。

オブジェクトにさらにフィールドを持たせることで複数のクラスを切り替えることができます。加えて、`:class` ディレクティブはプレーンな `class` 属性と共存できます。つまり、次のようなテンプレートと:

```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

次のようなデータがあったとすると:

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

このように描画されます:

```html
<div class="static active"></div>
```

`isActive` もしくは `hasError` が変化するとき、クラスリストはそれに応じて更新されます。例えば、`hasError` が `true` になった場合、クラスリストは `"static active text-danger"` になります。

束縛されるオブジェクトはインラインでなくてもかまいません:

```html
<div :class="classObject"></div>
```

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

これは同じ結果を描画します。オブジェクトを返す[算出プロパティ](computed.md)に束縛することもできます。これは一般的で強力なパターンです:

```html
<div :class="classObject"></div>
```

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### 配列構文

`:class` に配列を渡してクラスのリストを適用することができます:

```html
<div :class="[activeClass, errorClass]"></div>
```

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

これは次のように描画されます:

```html
<div class="active text-danger"></div>
```

リスト内のクラスを条件に応じて切り替えたい場合は、三項演算子式を使って実現することができます:

```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

この場合 `errorClass` は常に適用されますが、`activeClass` クラスは `isActive` が真と評価されるときだけ適用されます。

しかしながら、これでは複数の条件つきクラスがあると少し冗長になってしまいます。そのため、配列構文の内部ではオブジェクト構文を使うこともできます:

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### コンポーネントにおいて

> このセクションでは、[Vue のコンポーネント](component-basics.md)の知識を前提としています。いったんスキップして後で戻ってきても構いません。

単一のルート要素を持つカスタムコンポーネントで `class` 属性を使用すると、それらのクラスがこの要素に追加されます。この要素の既存のクラスは上書きされません。

例えば、このコンポーネントを宣言して:

```js
const app = Vue.createApp({})

app.component('my-component', {
  template: `<p class="foo bar">Hi!</p>`
})
```

使用するときにいくつかのクラスを追加したとします:

```html
<div id="app">
  <my-component class="baz boo"></my-component>
</div>
```

以下の HTML が描画されます:

```html
<p class="foo bar baz boo">Hi</p>
```

クラスバインディングに対しても同様です:

```html
<my-component :class="{ active: isActive }"></my-component>
```

`isActive` が真と評価されるときは、以下の HTML が描画されます:

```html
<p class="foo bar active">Hi</p>
```

コンポーネントに複数のルート要素がある場合、どのコンポーネントがこのクラスを受け取るかを定義する必要があります。これは `$attrs` コンポーネントプロパティを使って行うことができます:

```html
<div id="app">
  <my-component class="baz"></my-component>
</div>
```

```js
const app = Vue.createApp({})

app.component('my-component', {
  template: `
    <p :class="$attrs.class">Hi!</p>
    <span>This is a child component</span>
  `
})
```

コンポーネント属性の継承については、[プロパティでない属性](component-attrs.html)のセクションを参照してください。

## インラインスタイルのバインディング

### オブジェクト構文

`:style` 向けのオブジェクト構文は非常に簡単です。JavaScript オブジェクトということを除けば、ほとんど CSS のように見えます。CSS のプロパティ名には、キャメルケース (camelCase) またはケバブケース (kebab-case: クォートとともに使うことになります) のどちらでも使用することができます:

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

テンプレートをクリーンにするために、直接 style オブジェクトに束縛するのは、よいアイディアです:

```html
<div :style="styleObject"></div>
```

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

ここでもまた、オブジェクト構文はしばしばオブジェクトを返す算出プロパティと併せて使用されます。

### 配列構文

`:style` 向けの配列構文は、同じ要素に複数のスタイルオブジェクトを適用することができます:

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 自動プレフィックス

`:style` で [ベンダープレフィックス](https://developer.mozilla.org/ja/docs/Glossary/Vendor_Prefix) が必要な CSS プロパティを使用するとき、Vue は自動的に適切なプレフィックスを追加します。Vue は現在のブラウザでどのスタイルプロパティがサポートされているかを実行時に確認することでこれを行います。ブラウザが特定のプロパティをサポートしていない場合は、様々なプレフィックスのバリエーションがテストされて、サポートされているものを見つけようとします。

### 複数の値

style プロパティに複数の (接頭辞付き) 値の配列を設定できます。例えば次のようになります:

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

これは、配列内でブラウザがサポートしている最後の値だけを描画します。この例では、flexbox の接頭されていないバージョンをサポートしているブラウザでは `display: flex` を描画します。
