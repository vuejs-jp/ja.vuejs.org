# テンプレート参照について

> このページは、すでに[コンポーネントの基本](component-basics.md)を読んでいることを前提としています。コンポーネントを初めて使用する場合は、最初にそちらをお読みください。

プロパティやイベントが存在するにもかかわらず、 JavaScript で子コンポーネントに直接アクセスしなければならない場合があります。それを達成するために、`ref` 属性を使うことで子コンポーネントや HTML 要素に参照 ID を割り当てられます。例えば、以下のようになります:

```html
<input ref="input" />
```

これは、例えば、コンポーネントのマウント時にプログラムで input をフォーカスさせたい時に便利です:

```js
const app = Vue.createApp({})

app.component('base-input', {
  template: `
    <input ref="input" />
  `,
  methods: {
    focusInput() {
      this.$refs.input.focus()
    }
  },
  mounted() {
    this.focusInput()
  }
})
```

また、別の `ref` をコンポーネント自体に追加し、それを使用して親コンポーネントからの `focusInput` イベントをトリガーできます:

```html
<base-input ref="usernameInput"></base-input>
```

```js
this.$refs.usernameInput.focusInput()
```

::: warning
`$refs` は、コンポーネントがレンダリングされた後にのみ生成されます。これは、子要素を直接操作するための脱出ハッチとしてのみ意図されています。テンプレートや `computed` プロパティから `$refs` にアクセスするべきではありません。
:::

**こちらも参照してください**: [コンポジション API でテンプレート参照を使用する](/guide/composition-api-template-refs.html#template-refs)
