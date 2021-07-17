# アセット

## directives

- **型:** `Object`

- **詳細:**

  コンポーネントインスタンスで利用可能なディレクティブのハッシュです。

- **使用方法:**

  ```js
  const app = createApp({})

  app.component('focused-input', {
    directives: {
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    },
    template: `<input v-focus>`
  })
  ```

- **参照:** [カスタムディレクティブ](../guide/custom-directive.html)

## components

- **型:** `Object`

- **詳細:**

  コンポーネントインスタンスで利用可能なコンポーネントのハッシュです

- **使用方法:**

  ```js
  const Foo = {
    template: `<div>Foo</div>`
  }

  const app = createApp({
    components: {
      Foo
    },
    template: `<Foo />`
  })
  ```

- **参照:** [コンポーネント](../guide/component-basics.html)
