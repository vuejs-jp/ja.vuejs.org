# Vue と Web コンポーネント

[Web コンポーネント (Web Components)](https://developer.mozilla.org/en-US/docs/Web/Web_Components) は開発者が再利用可能なカスタム要素 (custom elements) を作成するための一連の Web ネイティブ API の包括的な用語です。

私たちは Vue と Web コンポーネントを主に補完的な技術とみなすことができます。Vue はカスタム要素の作成と使うこと両方に対して優れたサポートを提供します。既にある Vue アプリケーションにカスタム要素を統合する場合や、Vue を使ってビルドしそしてカスタム要素を配布する場合においても、あなたには良き友です。

## Vue でカスタム要素を使う

Vue は[カスタム要素の全てのテストにおいてスコアは 100% で完璧です](https://custom-elements-everywhere.com/libraries/vue/results/results.html)。Vue アプリケーション内部でカスタム要素を使うことはネイティブ HTML 要素を使う場合とほぼ同じですが、いくつか注意点があります:

### コンポーネント解決のスキップ

デフォルトで、Vue は、カスタム要素をレンダリングするためにフォールバックする前に、ネイティブではない HTML タグを、登録された Vue コンポーネントとして解決しようとします。これにより、開発中に Vue が "failed to resolve component" という警告を出力を出すことになるでしょう。特定の要素をカスタム要素として扱い、コンポーネントの解決をスキップすることを Vue に知らせるために、[`compilerOptions.isCustomElement` オプション](/api/application-config.html#compileroptions)を指定することができます。

もし、ビルドセットアップによって Vue が使われている場合は、そのオプションは、コンパイル時のオプションであるため、ビルド設定経由で渡される必要があります。

#### Vite 設定の例

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // ダッシュを含むすべてのタグをカスタム要素として扱う
          isCustomElement: tag => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Vue CLI 設定の例

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options
        compilerOptions: {
          // ion- で始まるタグはすべてカスタム要素として扱う
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### DOM プロパティの受け渡し

DOM 属性は文字列のみしか扱えないため、複雑なデータをカスタム要素に DOM 要素として渡す必要があります。カスタム要素上に props が設定されるとき、Vue 3 は自動的に `in` 演算子を使って DOM プロパティの存在をチェックし、キーが存在する場合は DOM プロパティとして値を設定するよう優先します。これは、多くのケースではカスタム要素が[推奨されるベストプラクティス](https://developers.google.com/web/fundamentals/web-components/best-practices#aim-to-keep-primitive-data-attributes-and-properties-in-sync,-reflecting-from-property-to-attribute,-and-vice-versa.)に従っている場合は、この点を考慮する必要はないことを意味します。

しかしながら、まれに、データを DOM プロパティとして渡さなければならないのに、カスタム要素がそのプロパティを適切に定義 / 反映していない (`in` チェックが失敗する) 場合があります。このようなケースの場合、`.prop` 修飾子を使って `v-bind` バインディングを DOM プロパティとして設定するように強制することができます:

```html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- 省略同等 -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Vue によるカスタム要素のビルド

カスタム要素の最大の利点は、それらがどんなフレームワークでも、あるいはフレームワークなくても使用できるということです。そのため、利用者が同じフロントエンドスタックを使用していない場合にコンポーネントを配布する場合や、アプリケーションが使用するコンポーネントの実装の詳細から該当アプリケーションを隔離したい場合に最適です。

### defineCustomElement

Vue は [`defineCustomElement`](/api/global-api.html#definecustomelement) メソッドを介したまったく同じ Vue コンポーネント API を使ったカスタム要素の作成をサポートします。このメソッドは [`defineComponent`](/api/global-api.html#definecomponent) と同じ引数を受け付けますが、代わりに `HTMLElement` を拡張したカスタム要素を返します:

```html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 通常の Vue コンポーネントオプションはここに
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement のみ: shadow root に注入される CSS
  styles: [`/* inlined css */`]
})

// カスタム要素の登録。
// 登録後、ページ上の全ての `<my-vue-element>` タグは
// アップグレードされます。
customElements.define('my-vue-element', MyVueElement)

// プログラマチックに要素をインスタンス化することもできます:
// (登録後にのみ行うことができます)
document.body.appendChild(
  new MyVueElement({
    // 初期化 props (任意)
  })
)
```

#### ライフサイクル

- Vue カスタム要素は、要素の [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) が初めて呼び出されたときに、その shadow root 内に内部の Vue コンポーネントインスタンスをマウントします。

- 要素の `disconnectedCallback` が呼び出されるとき、Vue はマイクロタスクの tick 後、ドキュメントから要素が切り離されているかどうかチェックします。

  - もし、要素がまだドキュメントに存在している場合は、それは移動状態であり、コンポーネントインスタンスは維持されています。

  - もし、要素がドキュメントから切り離されている場合は、それは削除された状態であり、コンポーネントインスタンスはアンマウントされます。

#### Props

- `props` オプションを使って宣言されたすべての Props は、カスタム要素にプロパティとして定義されます。Vue は、必要に応じて、属性とプロパティの間のリフレクションを自動的に処理します。

  - 属性は常に対応するプロパティに反映されます。

  - プリミティブな値 (`string`、`boolean`、`number`) を持つプロパティは、属性として反映されます。

- また、Vue は、`Boolean` や `Number` で宣言された props が属性 (常に文字列）として設定されると、自動的に希望の型にキャストします。例えば、次のような props 宣言があるとします。

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  そして、カスタム要素での使用:

  ```html
  <my-element selected index="1"></my-element>
  ```

  コンポーネントでは、`selected` は `true`（真偽値）に、 `index` は `1`（数値）にキャストされます。

#### イベント

`this.$emit` や setup の `emit` を通じて発行されたイベントは、カスタム要素上でネイティブの[カスタムイベント (CustomEvents)](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent)としてディスパッチされます。
追加のイベント引数(ペイロード)は、カスタムイベントオブジェクトの `details` プロパティの配列として公開されます。

#### スロット

コンポーネント内部では、スロットは通常どおり `<slot/>` 要素を使ってレンダリングできます。しかし、生成された要素が使われる際には[ネイティブなスロット構文](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)しか受け付けません:

- [スコープ付きスロット](/guide/component-slots.html#scoped-slots)はサポートされていません。

- 名前付きスロットを渡すときは、`v-slot` ディレクティブの代わりに `slot` 属性を使用します:

  ```html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject

[Provide / Inject API](/guide/component-provide-inject.html#provide-inject) と[同様の Composition API](/api/composition-api.html#provide-inject) も、Vue で定義されたカスタム要素間で動作します。しかしながら、これは**カスタム要素間のみ**動作するということに注意してください。つまり、Vue で定義されたカスタム要素は、カスタム要素ではない Vue コンポーネントによってプロパティを注入することはできません。

### カスタム要素としての SFC

`defineCustomElement` は、Vue の単一ファイルコンポーネント (SFC: Single File Components) でも動作します。しかしながら、デフォルトのツール設定では、SFC 内の `<style>` は、プロダクションビルド時に抽出され、単一の CSS ファイルにマージされます。SFC をカスタム要素として使用する場合は、代わりにカスタム要素の shadow root に `<style>` タグを注入するのが望ましいことが多いです。

公式の SFC ツールは、"カスタム要素モード (custom element mode)" での SFC の読み込みをサポートしています (`@vitejs/plugin-vue@^1.4.0` または `vue-loader@^16.5.0` が必要)。カスタム要素モードで読み込まれた SFC は、その `<style>` タグを CSS の文字列としてインライン化し、コンポーネントの `styles` オプションで公開します。これは、`defineCustomElement` によってピックアップされ、インスタンス化されたときに要素の shadow root に注入されます。

このモードを利用する(オプトイン)には、コンポーネントのファイル名の最後に `.ce.vue` をつけるだけです:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* inlined css */"]

// カスタム要素のコンストラクタに変換
const ExampleElement = defineCustomElement(Example)

// 登録
customElements.define('my-example', ExampleElement)
```

もし、カスタム要素モードでどのファイルをインポートするかをカスタマイズしたい場合（例えば、_すべて_ の SFC をカスタム要素として扱うなど）、それぞれのビルドプラグインに `customElement` オプションを渡すことができます:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Vue カスタム要素ライブラリ向けの秘訣

Vue でカスタム要素をビルドする場合、要素は Vue のランタイムに依存します。使用する機能の数に応じて、ベースラインサイズが 16kb 程度になります。 つまり、単一のカスタム要素を提供する場合、Vue を使用することは理想的ではありません。vanilla JavaScript、[petite-vue](https://github.com/vuejs/petite-vue)、またはランタイムサイズの小ささに特化したフレームワークを使いたいかもしれません。しかしながら、複雑なロジックを持つカスタム要素の集合体を出荷する場合、Vue によって各コンポーネントがより少ないコードで作成されるため、基本サイズの大きさは正当化されます。一緒に出荷する要素が多ければ多いほど、トレードオフは良くなります。

もし、カスタム要素が Vue を使用しているアプリケーションで使用される場合、ビルドされたバンドルから Vue を外部化することを選択し、要素がホストアプリケーションの Vue の同じコピーを使用するようにできます。

個々の要素コンストラクタをエクスポートして、ユーザーが必要に応じてインポートしたり、必要なタグ名で登録したりできる柔軟性を持たせることをお勧めします。また、すべての要素を自動的に登録する便利な関数をエクスポートすることもできます。以下は、Vue カスタム要素ライブラリのエントリーポイントの例です:

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.bar'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// 個々の要素をエクスポート
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

もし多くのコンポーネントがある場合、Vite の [glob インポート](https://vitejs.dev/guide/features.html#glob-import)や webpack の [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext)のようなビルドツールの機能を利用して、ディレクトリからすべてのコンポーネントを読み込むこともできます。

## Web コンポーネント と Vue コンポーネントの比較

開発者の中には、フレームワークに依存した独自のコンポーネントモデルは避けるべきであり、カスタム要素のみを使用することでアプリケーションの"将来性"を確保できると考える人もいます。ここでは、この考え方が問題を単純化しすぎていると思われる理由を説明します。

カスタム要素と Vue コンポーネントの間には、確かにある程度の機能の重複があります。どちらも、データの受け渡し、イベントの発行、ライフサイクルの管理を備えた再利用可能なコンポーネントを定義することができます。しかし、Web コンポーネントの API は比較的低レベルで素っ気ないものです。実際のアプリケーションを構築するには、このプラットフォームがカバーしていない、かなりの数の追加機能が必要です:

- 宣言的で効率的なテンプレートシステム

- コンポーネント間でのロジックの抽出と再利用を容易にする、リアクティブな状態管理システム

- SEO や [LCP などの Web Vitals の指標](https://web.dev/vitals/) に重要な、サーバー上でコンポーネントをレンダリングし、クライアント上でハイドレートするパフォーマンスの高い方法 (SSR)。ネイティブのカスタム要素の SSR では、一般的に Node.js で DOM をシミュレートし、変異された DOM をシリアライズしますが、Vue の SSR では可能な限り文字列の連結にコンパイルされるため、より効率的です。

Vue のコンポーネントモデルは、これらのニーズを考慮して、一貫したシステムとして設計されています。

有能なエンジニアリングチームであれば、ネイティブのカスタム要素上に同等のものを構築することができるでしょう。しかし、これは、Vue のような成熟したフレームワークのエコシステムやコミュニティの恩恵を受けられない一方で、自社フレームワークの長期的なメンテナンスの負担を負うことを意味します。

カスタム要素をコンポーネントモデルの基礎として使用しているフレームワークもありますが、これらのフレームワークでは、上記のような問題に対して独自の解決策を導入しなければなりません。これらのフレームワークを使用することは、これらの問題を解決する方法に関する彼らの技術的な決定を支持することになります。これは、宣伝されているにもかかわらず、将来の混乱を自動的に避けることはできません。

また、カスタム要素では限界があると感じる部分もあります:

- 先行スロット評価は、コンポーネントの構成を妨げる。Vue の[スコープ付きスロット](/guide/component-slots.html#scoped-slots)は、コンポーネント構成のための強力なメカニズムですが、ネイティブスロットの先行性質のため、カスタム要素はサポートされません。先行スロットは、受信側のコンポーネントがスロットコンテンツの一部をレンダリングするタイミングやその有無を制御できないことを意味します。

- 現在、shadow DOM にスコープされた CSS を持つカスタム要素を配布するには、実行時に shadow root に注入できるように、JavaScript 内に CSS を埋め込む必要があります。また、SSR シナリオでは、マークアップに重複したスタイルが発生します。この分野では、[プラットフォーム機能](https://github.com/whatwg/html/pull/4898/)の開発が進められていますが、現時点ではまだ普遍的にサポートされているわけではなく、パフォーマンスや SSR の面でも解決すべき問題があります。一方で、Vue の SFC は、スタイルをプレーンな CSS ファイルに抽出することをサポートする[CSS スコープ化するメカニズム](/api/sfc-style.html)を提供しています。

Vue は、Web プラットフォームの最新の規格に常に対応しており、開発しやすくなるのであれば、プラットフォームが提供するものを喜んで活用します。しかしながら、私たちの目標は今日でも十分に機能するソリューションを提供することです。つまり、批判的な考え方で新しいプラットフォームの機能を取り入れなければなりません。そのためには、標準では不十分な部分を今のうちに埋めておく必要があります。