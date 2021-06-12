# DOM

## template

- **型:** `string`

- **詳細:**

  コンポーネントインスタンスのマークアップとして使われる文字列のテンプレートです。そのテンプレートはマウントされた要素の `innerHTML` を **置換** します。マウントされた要素内の既存マークアップは、テンプレート内にコンテンツ配信スロットが存在しない限り、どれも無視されます。

  文字列が `#` から始まる場合は、`querySelector` として扱われ、テンプレート文字列として選択された要素の innerHTML を使います。これは一般的な `<script type="x-template">` の方法を使って、テンプレートを含むことができます。

  :::tip Note
  セキュリティの観点からは、あなたが信頼できる Vue テンプレートだけを使うべきです。ユーザが作成したコンテンツをテンプレートとして使ってはいけません。
  :::

  :::tip Note
  Render 関数が Vue オプションに存在する場合、テンプレートは無視されます。
  :::

- **参照:**
  - [ライフサイクルダイアグラム](../guide/instance.html#ライフサイクルダイアグラム)
  - [スロットによるコンテンツ配信](../guide/component-basics.html#スロットによるコンテンツ配信)

## render

- **型:** `Function`

- **詳細:**

  文字列テンプレートの代わりに、JavaScript のプログラム能力をフル活用することができます。

- **使用方法:**

  ```html
  <div id="app" class="demo">
    <my-title blog-title="A Perfect Vue"></my-title>
  </div>
  ```

  ```js
  const { createApp, h } = Vue
  const app = createApp({})

  app.component('my-title', {
    render() {
      return h(
        'h1', // tag name,
        this.blogTitle // tag content
      )
    },
    props: {
      blogTitle: {
        type: String,
        required: true
      }
    }
  })

  app.mount('#app')
  ```

  :::tip Note
  `render` 関数は、`template` オプションや、マウントした要素の DOM 内 HTML テンプレートからコンパイルされたレンダリング関数よりも高い優先度を持ちます。
  :::

- **参照:** [Render 関数](../guide/render-function.html)
