# SFC 構文の仕様

## はじめに

`*.vue` ファイルは、HTML のような構文を使って Vue コンポーネントを記述するカスタムファイル形式です。各 `*.vue` ファイルは 3 種類のトップレベル言語ブロックから構成されます: `<template>` と `<script>` と `<style>` に、必要に応じてカスタムブロックがあります:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  This could be e.g. documentation for the component.
</custom1>
```

## 言語ブロック

### `<template>`

- 各 `*.vue` ファイルは一度に最大 1 つのトップレベル `<template>` ブロックを含めることができます。

- コンテンツは抽出され、`@vue/compiler-dom` に渡され、JavaScript の Render 関数にプリコンパイルされ、エクスポートされたコンポーネントの `render` オプションとしてアタッチされます。

### `<script>`

- 各 `*.vue` ファイルは一度に最大 1 つの `<script>` ブロック（[`<script setup>`](/api/sfc-script-setup.html) を除く）を含むことができます。

- スクリプトは ES モジュールとして実行されます。

- **default export** は、プレーンなオブジェクトとして、または [defineComponent](/api/global-api.html#definecomponent) の戻り値として、Vue コンポーネントのオプションオブジェクトでなければなりません。

### `<script setup>`

- 各 `*.vue` ファイルは一度に最大 1 つの `<script setup>` ブロック（通常の `<script>` を除く）を含むことができます。

- スクリプトは事前処理され、コンポーネントの `setup()` 関数として使用されます。つまり、**コンポーネントのインスタンスごとに** 実行されます。`<script setup>` のトップレベルのバインディングは、自動的にテンプレートへ公開されます。詳細については、[`<script setup>` の専用ドキュメント](/api/sfc-script-setup) を参照してください。

### `<style>`

- 1 つの `*.vue` ファイルには複数の `<style>` タグを含めることができます。

- `<style>` は、現在のコンポーネントにスタイルをカプセル化するのに役立つ `scoped` や `module` 属性を持つことができます（詳しくは [SFC Style Features](/api/sfc-style) を参照）。カプセル化モードが異なる複数の `<style>` タグを同じコンポーネントに混在させることができます。

### カスタムブロック

様々なプロジェクト固有のニーズ、例えば `<docs>` ブロックなど、追加のカスタムブロックを `*.vue` ファイルに含めることができます。カスタムブロックの実例には、次のようなものがあります:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

カスタムブロックの処理はツールに依存します。もし独自のカスタムブロック統合を構築したいなら、[SFC ツール](/api/sfc-tooling.html#custom-blocks-integration) で詳細について参照してください。

## 自動 `name` 推論

SFC は次のようなケースで **ファイル名** からコンポーネント名を自動で推測します:

- 開発警告のフォーマット
- DevTools のインスペクタ
- 再帰的な自己参照。例えば `FooBar.vue` というファイル名は、そのテンプレート内で `<FooBar/>` というようにそれ自体を参照できます。これは明示的に登録・インポートされたコンポーネントよりは優先度が低くなります。

## プリプロセッサ

ブロックは `lang` 属性を使ってプリプロセッサの言語を宣言することができます。もっとも一般的なケースは `<script>` ブロックで TypeScript を使用することです:

```html
<script lang="ts">
  // TypeScript を使用
</script>
```

`lang` はどのブロックにも適用できます。例えば `<style>` に [SASS](https://sass-lang.com/) や `<template>` に [Pug](https://pugjs.org/api/getting-started.html) を使えます:

```html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

プリプロセッサとの統合はツールチェーンによって異なる場合があることに注意してください。例については、各ドキュメントを参照してください:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Src Imports

`*.vue` コンポーネントを複数のファイルに分割したい場合は、`src` 属性を使って、言語ブロックに外部ファイルをインポートできます:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

`src` インポートは webpack のモジュールリクエストと同じパス解決ルールに従うことに注意してください。つまり次のことです:

- 相対パスは `./` から始まる必要があります
- npm の依存関係からリソースをインポートできます:

```vue
<!-- インストールされた "todomvc-app-css" npm パッケージのファイルをインポート -->
<style src="todomvc-app-css/index.css">
```

`src` インポートはカスタムブロックでも機能します。例えば:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## コメント

各ブロック内では、使用している言語（HTML、CSS、JavaScript、Pug など）のコメント構文を使用してください。トップレベルのコメントには、HTML コメント構文を使用します: `<!-- comment contents here -->`
