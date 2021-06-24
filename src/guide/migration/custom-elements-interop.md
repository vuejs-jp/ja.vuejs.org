---
badges:
  - breaking
---

# カスタム要素の相互運用性 <MigrationBadges :badges="$frontmatter.badges" />

## 概要

- **破壊的変更:** タグをカスタム要素として扱うかのチェックは、テンプレートのコンパイル中に実行されるようになりました。そのためランタイム設定ではなくコンパイラオプションで設定する必要があります。
- **破壊的変更:** 特別な `is` プロパティの使用は予約済みの `<component>` タグのみに制限されます。
- **新規:** ネイティブ HTML のパース制限を回避するためにネイティブ要素で `is` が使用されていた 2.x のユースケースをサポートするため、値の前に `vue:` を付けて、Vue コンポーネントとして解決します。

##  自主的なカスタム要素

Vue の外部で定義されたカスタム要素を追加したい場合（例えば Web Components API の使用）、Vue にカスタム要素として扱うように「指示」する必要があります。以下のテンプレートを例にしてみましょう。

```html
<plastic-button></plastic-button>
```

### 2.x での構文

Vue 2.x では、カスタム要素としてタグを設定するには `Vue.config.ignoredElements` を使用していました。

```js
// 以下で Vue は Vue の外部で定義されたカスタム要素を無視するようになります
// (例: Components APIの使用)

Vue.config.ignoredElements = ['plastic-button']
```

### 3.x での構文

**Vue 3.0 では、このチェックはテンプレートのコンパイル時に実行されます。** コンパイラに `<plastic-button>` をカスタム要素として扱うように指示するには、以下のようにします。

- ビルドステップを使用する場合: Vue テンプレートコンパイラに `isCustomElement` オプションを設定します。`vue-loader` を使用している場合は、`vue-loader` の `compilerOptions` オプションを介して設定する必要があります。

  ```js
  // webpackの設定
  rules: [
    {
      test: /\.vue$/,
      use: 'vue-loader',
      options: {
        compilerOptions: {
          isCustomElement: tag => tag === 'plastic-button'
        }
      }
    }
    // ...
  ]
  ```

- 直接テンプレートをコンパイルする場合は、`app.config.isCustomElement`で設定します。

  ```js
  const app = Vue.createApp({})
  app.config.isCustomElement = tag => tag === 'plastic-button'
  ```

  ランタイム設定はランタイムテンプレートのコンパイルにしか影響しないことに注意してください - コンパイル済みのテンプレートには影響しません。

## カスタマイズされたビルトイン要素

カスタム要素の仕様では、ビルトイン要素に`is`属性を追加するとこで、カスタム要素を[カスタマイズされたビルトイン要素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)として利用する方法を提供しています。

```html
<button is="plastic-button">Click Me!</button>
```

Vue では、ブラウザで普遍的に利用できるようになる前のネイティブ属性の動作をシミュレートするために、特別なプロパティ `is` を使用していました。しかし、2.x では、`plastic-button`という名前の Vue コンポーネントをレンダリングしていると解釈されていました。これにより、上記のカスタマイズされたビルトイン要素のネイティブな使用がブロックされます。

3.0では、Vue の `is` プロパティの特別な扱いを `<component>` タグのみに制限しています。

- 予約済みの `<component>` タグで使用された場合、2.x と全く同じ動作をします。
- 通常のコンポーネントに使用すると、通常のプロパティのように動作します。

  ```html
  <foo is="bar" />
  ```

- 2.x の動作: `bar` コンポーネントをレンダリングします。
- 3.x の動作: `foo` コンポーネントをレンダリングし、`is` プロパティを渡します。

- 通常の要素で使用される場合、`is` プロパティとして `createElement` の呼び出しに渡され、ネイティブ属性としてもレンダリングされます。これはカスタマイズされたビルトイン要素の使用をサポートします。

  ```html
  <button is="plastic-button">Click Me!</button>
  ```

- 2.x の動作: `plastic-button` コンポーネントをレンダリングします。
- 3.x の動作: ネイティブなボタンをレンダリングします。

    ```js
    document.createElement('button', { is: 'plastic-button' })
    ```

[移行ビルドのフラグ: `COMPILER_IS_ON_ELEMENT`](migration-build.html#compat-の設定)

## `vue:` プレフィックスは DOM 内テンプレートパースのための回避策

> 注: このセクションは、Vue テンプレートがページの HTML に直接記述されている場合にのみ影響します。
> DOM 内テンプレートを使用している場合、テンプレートはネイティブ HTML パースルールに従います。HTML 要素の中には、`<ul>`, `<ol>`, `<table>`, `<select>` のように、その中に表示できる要素に制限があり、また、`<li>`, `<tr>`, `<option>` のように、特定の他の要素の中にしか表示できない要素もあります。

### 2.x での構文

Vue 2 では、ネイティブタグに `is` プロパティを使用してこれらの制限を回避することを推奨しています。

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

### 3.x での構文

`is` の動作変更に伴い、要素を Vue コンポーネントとして解決するには `vue:` プレフィックスが必要になりました。

```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

## 移行の戦略

- `config.ignorededElements` を `vue-loader` の `compilerOptions` (ビルドステップ) または `app.config.isCustomElement` (直接テンプレートコンパイル) のいずれかで置き換えます。

- `<component>`以外のタグで `is` を使用しているものはすべて `<component is="...">` (SFC テンプレートの場合) または `vue:` プレフィックス (DOM 内テンプレートの場合) に変更します。
