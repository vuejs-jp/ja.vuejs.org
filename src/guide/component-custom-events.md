# カスタムイベント

> このページは [コンポーネントの基本](component-basics.md) が読まれていることが前提となっています。 コンポーネントを扱った事のない場合はこちらのページを先に読んでください。

## イベント名

コンポーネントやプロパティとは違い、イベント名の大文字と小文字は自動的に変換されません。その代わり発火されるイベント名とイベントリスナ名は全く同じにする必要があります。例えばキャメルケース(camelCase)のイベント名でイベントを発火した場合:

```js
this.$emit('myEvent')
```

ケバブケース(kebab-case)でリスナ名を作っても何も起こりません:

```html
<!-- Won't work -->
<my-component @my-event="doSomething"></my-component>
```

イベント名は JavaScript 内で変数やプロパティ名として扱われることはないので、キャメルケース(camelCase)またはパスカルケース(PascalCase)を使用する理由はありません。 さらに DOM テンプレート内の `v-on` イベントリスナは自動的に小文字に変換されます ( HTML が大文字と小文字を判別しないため)。このため `@myEvent` は `@myevent` になり `myEvent` にリスナが反応することができなくなります。

こういった理由から **いつもケバブケース(kebab-case)を使うこと** をお薦めします。

## カスタムイベントの定義

発行されたイベントは、 `emits` オプションを介して、コンポーネントで定義することが出来ます。

```js
app.component('custom-form', {
  emits: ['in-focus', 'submit']
})
```


ネイティブイベント（例、 `click` など）が `emits` オプションで定義されている場合、ネイティブリスナーとして扱われるのではなく、コンポーネントのイベントによって上書きされます。

::: tip
コンポーネントの動作を実証するために、全ての発行されたイベントを定義することをお勧めします。
:::

### 発行されたイベントを検証する

プロパティの型検証と同様に、発行されたイベントは、配列構文ではなくオブジェクト構文で定義されている場合に検証できます。

検証を追加するために、イベントには、 `$emit` 呼び出しに渡された引数を受け取る関数が割り当てられ、イベントが有効かどうかを示す真偽値を返します。

```js
app.component('custom-form', {
  emits: {
    // No validation
    click: null,

    // Validate submit event
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { email, password })
    }
  }
})
```

## `v-model` の引数

デフォルトでは、コンポーネントの `v-model` はプロパティとして `modelValue` を使用し、イベントとして `update:modelValue` を使用します。`v-model` 引数を渡してこれらの名前の変更が出来ます。

```html
<my-component v-model:foo="bar"></my-component>
```
この場合、子コンポーネントは `foo` プロパティを期待し、同期するために `update:foo` イベントを発行します。

```js
const app = Vue.createApp({})

app.component('my-component', {
  props: {
    foo: String
  },
  template: `
    <input
      type="text"
      :value="foo"
      @input="$emit('update:foo', $event.target.value)">
  `
})
```

```html
<my-component v-model:foo="bar"></my-component>
```

## 複数の `v-model` のバインディング

以前 [`v-model` 引数](#v-model-arguments) で学習した特定のプロパティとイベントをターゲットにする機能を活用することで、単一のコンポーネントインスタンスに対して、複数の v-model バインディングを作成できるようになりました。

それぞれの v-model は、コンポーネントに追加オプションを必要とせず、異なるプロパティに同期します。

```html
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```js
const app = Vue.createApp({})

app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  template: `
    <input
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
})
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="GRoPPrM" data-preview="true" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Multiple v-models">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/GRoPPrM">
  Multiple v-models</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## `v-model` 修飾子の処理

When we were learning about form input bindings, we saw that `v-model` has [built-in modifiers](/guide/forms.html#modifiers) - `.trim`, `.number` and `.lazy`. In some cases, however, you might also want to add your own custom modifiers.

フォーム入力バインディングについて学習していたときに、 `v-model`に [組み込み修飾子](/guide/forms.html#modifiers) -`.trim` 、 `.number` 、および `.lazy` があることがわかりました。ただし、場合によっては、独自のカスタム修飾子を追加することもできます。

`v-model` バインディングによって提供される文字列の最初の文字を大文字にするカスタム修飾子の例、`capitalize`を作成してみましょう。

コンポーネント `v-model` に追加された修飾子は、`modelModifiers` プロパティを介してコンポーネントに提供されます。以下の例では、デフォルトで空のオブジェクトになる `modelModifiers` プロパティを含むコンポーネントを作成しました。

コンポーネントの `created` ライフサイクルフックがトリガーされると、`modelModifiers` プロパティには `capitalize` が含まれ、その値は`true` になります。これは、 `v-model` バインディングに `v-model.capitalize = "var"` が設定されているためです。

```html
<my-component v-model.capitalize="bar"></my-component>
```

```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  template: `
    <input type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  `,
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
})
```

プロパティを設定したので、 `modelModifiers` オブジェクトのキーを確認し、発行された値を変更するハンドラーを記述できます。以下のコードでは、 `<input />` 要素が `input` イベントを発生させるたびに文字列を大文字にします。

```html
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
  {{ myText }}
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      myText: ''
    }
  }
})

app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})

app.mount('#app')
```

引数を持つ `v-model` バインディングの場合、生成されるプロパティ名は `arg + "Modifiers"` になります。

```html
<my-component v-model:foo.capitalize="bar"></my-component>
```

```js
app.component('my-component', {
  props: ['foo', 'fooModifiers'],
  template: `
    <input type="text"
      :value="foo"
      @input="$emit('update:foo', $event.target.value)">
  `,
  created() {
    console.log(this.fooModifiers) // { capitalize: true }
  }
})
```
