# その他

## name

- **型:** `string`

- **詳細:**

  コンポーネントがテンプレートの中で自分自身を再帰的に呼び出すことを許可します。コンポーネントが [`app.component`](/api/application-api.html#component) でグローバルに登録されているとき、グローバル ID が自動的にその名前として設定されることに注意してください。

  `name` オプションを指定する他の利点はデバッグです。名前付きのコンポーネントは、警告メッセージでより助けになります。また、[vue-devtools](https://github.com/vuejs/vue-devtools) でアプリケーションを調査するとき、名前のないコンポーネントは `<AnonymousComponent>` として表示されてしまい、あまり情報量が多くありません。`name` オプションを提供することで、より情報量の多いコンポーネントツリーを得ることができます。

## inheritAttrs

- **型:** `boolean`

- **デフォルト:** `true`

- **詳細:**

  デフォルトでは、プロパティとして認識されていない親スコープの属性バインディグは「通り抜けて落ちる」ようにされます。つまり、単一のルートコンポーネントがある場合、属性バインディングは通常の HTML 属性として子コンポーネントのルート要素に適用されます。ターゲット要素や他のコンポーネントをラップするコンポーネントを作成する場合、これは必ずしも望んだ動作ではないかもしれません。`inheritAttrs` を `false` に設定することで、このデフォルトの動作を無効にすることができます。属性は `$attrs` インスタンスプロパティで利用でき、`v-bind` を使ってルートでない要素に明示的にバインドすることができます。

- **使用方法:**

  ```js
  app.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input'],
    template: `
      <label>
        {{ label }}
        <input
          v-bind="$attrs"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
        >
      </label>
    `
  })
  ```

- **参照:** [属性の継承の無効化](../guide/component-attrs.html#属性の継承の無効化)

## compilerOptions <Badge text="3.1+" />

- **型:** `Object`

- **詳細:**

  これは [アプリケーションの `compilerOptions` 設定](/api/application-config.html#compileroptions) に相当するコンポーネントレベルの設定です。

- **使用方法:**

  ```js
  const Foo = {
    // ...
    compilerOptions: {
      delimiters: ['${', '}'],
      comments: true
    }
  }
  ```

  ::: tip Important
  アプリケーションレベルの `compilerOptions` 設定と同じように、このオプションはブラウザ内でテンプレートのコンパイルをするフルビルドを使ったときにのみ尊重されます。
  :::

## delimiters <Badge text="deprecated" type="warning" />

3.1.0 では非推奨です。代わりに `compilerOptions.delimiters` を使ってください。
