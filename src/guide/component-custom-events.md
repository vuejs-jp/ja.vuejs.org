# カスタムイベント

> このページは [コンポーネントの基本](component-basics.md) が読まれていることが前提となっています。 コンポーネントを扱った事のない場合はこちらのページを先に読んでください。

## イベント名

コンポーネントやプロパティと同じように、イベント名は大文字と小文字を自動的に変換します。子コンポーネントからキャメルケースでイベントを発行すると、親コンポーネントではケバブケースのリスナを追加できるようになります:

```js
this.$emit('myEvent')
```

```html
<my-component @my-event="doSomething"></my-component>
```

[プロパティの形式](/guide/component-props.html#プロパティの形式-キャメルケース-vs-ケバブケース) と同じように、DOM 内テンプレートを使っている場合は、ケバブケースのイベントリスナを使うことをお勧めします。文字列テンプーとを使っている場合は、この制約は適用されません。

## カスタムイベントの定義

<VideoLesson href="https://vueschool.io/lessons/defining-custom-events-emits?friend=vuejs" title="Vue School でコンポーネントが発行できるイベントを定義する方法を学ぶ">Vue School でカスタムイベントの定義についての無料ビデオを視聴する</VideoLesson>

発行されたイベントは、 `emits` オプションを介して、コンポーネントで定義することが出来ます。

```js
app.component('custom-form', {
  emits: ['inFocus', 'submit']
})
```

ネイティブイベント（例、 `click` など）が `emits` オプションで定義されている場合、ネイティブイベントリスナの **代わりに** コンポーネントのイベントが使われます。

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
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
})
```

## `v-model` の引数

デフォルトでは、コンポーネントの `v-model` はプロパティとして `modelValue` を使用し、イベントとして `update:modelValue` を使用します。`v-model` 引数を渡してこれらの名前の変更が出来ます。

```html
<my-component v-model:title="bookTitle"></my-component>
```

この場合、子コンポーネントは `title` プロパティを期待し、同期するために `update:title` イベントを発行します。

```js
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: `
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})
```

```html
<my-component v-model:title="bookTitle"></my-component>
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
app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName'],
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

<common-codepen-snippet title="Multiple v-models" slug="GRoPPrM" tab="html,result" />

## `v-model` 修飾子の処理

フォーム入力バインディングについて学習していたときに、 `v-model` に [組み込み修飾子](/guide/forms.html#modifiers) - `.trim`、`.number`、および `.lazy` があることがわかりました。ただし、場合によっては、独自のカスタム修飾子を追加することもできます。

`v-model` バインディングによって提供される文字列の最初の文字を大文字にするカスタム修飾子の例、`capitalize` を作成してみましょう。

コンポーネント `v-model` に追加された修飾子は、`modelModifiers` プロパティを介してコンポーネントに提供されます。以下の例では、デフォルトで空のオブジェクトになる `modelModifiers` プロパティを含むコンポーネントを作成しました。

コンポーネントの `created` ライフサイクルフックがトリガーされると、`modelModifiers` プロパティには `capitalize` が含まれ、その値は `true` になります。これは、 `v-model` バインディングに `v-model.capitalize="myText"` が設定されているためです。

```html
<my-component v-model.capitalize="myText"></my-component>
```

```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
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
  emits: ['update:modelValue'],
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
<my-component v-model:description.capitalize="myText"></my-component>
```

```js
app.component('my-component', {
  props: ['description', 'descriptionModifiers'],
  emits: ['update:description'],
  template: `
    <input type="text"
      :value="description"
      @input="$emit('update:description', $event.target.value)">
  `,
  created() {
    console.log(this.descriptionModifiers) // { capitalize: true }
  }
})
```
