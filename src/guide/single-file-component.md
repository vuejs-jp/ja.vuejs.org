# 単一ファイルコンポーネント

<VideoLesson href="https://vueschool.io/lessons/vue-3-introduction-to-single-file-components?friend=vuejs" title="Free Vue.js Single File Components Lesson">Learn about single file components with a free video lesson on Vue School</VideoLesson>

## 前書き

Vue 単一ファイルコンポーネント（別名 `*.vue` ファイル、 **SFC** と省略）は、Vue コンポーネントのテンプレート、ロジック、そして **スタイル** を 1 つのファイルにまとめることができる特別なファイル形式です。これが SFC の例です:

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

このように、Vue SFC は古典的な HTML、CSS、JavaScript という 3 つの自然な拡張です。それぞれの `*.vue` ファイルは、3 種類のトップレベル言語ブロックで構成されています: `<template>` と `<script>` と `<style>` です:

- `<script>` セクションは、標準的な JavaScript モジュールです。Vue コンポーネント定義をデフォルトでエクスポートする必要があります。
- `<template>` セクションは、コンポーネントのテンプレートを定義します。
- `<style>` セクションは、コンポーネントに関連する CSS を定義します。

詳しくは [SFC 構文の仕様](/api/sfc-spec) を参照してください。

## 仕組み

Vue SFC はフレームワーク固有のファイル形式で、[@vue/compiler-sfc](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc) によって標準的な JavaScript と CSS にプリコンパイルする必要があります。コンパイルされた SFC は標準的な JavaScript (ES) モジュールで、つまり、適切なビルド設定をすれば SFC をモジュールのようにインポートすることができます:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

SFC 内の `<style>` タグは、ホットアップデートに対応するため、開発中はネイティブの `<style>` タグとして注入されるのが一般的です。本番向けには、これらのタグを抽出して、ひとつの CSS ファイルにマージすることができます。

[Vue SFC Playground](https://sfc.vuejs.org/) では、SFC を試したり、どのようにコンパイルされるかを調べたりすることができます。

実際のプロジェクトでは、通常 SFC コンパイラを [Vite](https://vitejs.dev/) や（[webpack](https://webpack.js.org/) をベースとした）[Vue CLI](http://cli.vuejs.org/) などのビルドツールを統合して、Vue は公式で SFC をできるだけ早く使い始めるための足場となるツールを提供しています。詳しくは [SFC ツール](/api/sfc-tooling) セクションを確認してください。

## なぜ SFC なのか

SFC ビルドのステップが必要ですが、その代わりに多くの利点があります:

- 使い慣れた HTML、CSS、JavaScript の構文を利用してモジュール化されたコンポーネントを作成
- コンパイル済みのテンプレート
- [コンポーネントスコープの CSS](/api/sfc-style)
- [Composition API を使用する際の、より人間工学的な構文](/api/sfc-script-setup)
- テンプレートとスクリプトの相互分析によるコンパイル時間の最適化
- [IDE サポート](/api/sfc-tooling.html#ide-support) でテンプレート式の自動補完と型チェック
- すぐに使える Hot-Module Replacement (HMR) のサポート

SFC はフレームワークとしての Vue を定義する特徴で、次のようなシナリオで Vue を使用する場合に推奨されるアプローチです:

- シングルページアプリケーション (SPA)
- 静的サイト生成 (SSG)
- より良い開発エクスペリエンス (DX) を正当化できるビルドステップのある単純ではないフロントエンド

とはいえ、SFC が過剰に感じるシナリオがあることも理解しています。これが Vue はビルドステップなしにプレーンな JavaScript で使用できる理由です。軽いインタラクションに大部分が静的な HTML を強化したいだけならば、プログレッシブ・エンハンスメントに最適化された Vue の 5kb のサブセットである [petite-vue](https://github.com/vuejs/petite-vue) をチェックアウトすることもできます。

## 関心の分離については？

従来のウェブ開発のバックグラウンドを持つユーザの中には、SFC は HTML/CSS/JS が分離するはずだった異なる関心を同じ場所で混ぜ合わせているのでは、と懸念する人もいるかもしれません。

この質問に答えるためには、 **関心の分離はファイルタイプの分離と等しくない** ということに同意することが重要です。エンジニアリング原則の究極の目標は、コードベースの保守性を向上させることです。関心の分離は、ファイルタイプの分離のように独断的に適用された場合、ますます複雑化するフロントエンドアプリケーションという文脈で、その目標を達成する助けにはなりません。

最近の UI 開発では、コードベースを互いに織り合わせる 3 つの巨大なレイヤーに分割するのではなく、疎結合のコンポーネントに分割して構成する方がはるかに理にかなっていることがわかりました。コンポーネント内では、そのテンプレート、ロジック、スタイルが本質的に結合されていて、それらを連結することで実際にコンポーネントの凝集性と保守性が高くなります。

単一ファイルコンポーネントのアイデアが気に入らない場合でも、[Src Imports](/api/sfc-spec.html#src-imports) を使って JavaScript と CSS を別々のファイルに分けることで、ホットリロードやプリコンパイルの機能を活用できます。
