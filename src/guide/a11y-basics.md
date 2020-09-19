# 基礎

ウェブアクセシビリティ(a11y とも呼ばれる)とは、障害のある人、回線速度が遅い人、古かったり壊れたハードウェアを使用している人、単に芳しくない環境にいる人など、誰もが利用できるウェブサイトを作ることを指します。たとえば、ビデオに字幕を追加すると、聴覚障害のあるユーザと、大きな音がして電話の音が聞こえないユーザの両方に役立ちます。同様に、テキストのコントラストを低くしないようにすることで、目の見えないユーザと、明るい日光の下で携帯電話を使おうとしているユーザの両方に役立ちます。

アクセシビリティを始めたいけど、どこを参照すれば良いかわかりませんか？

[World Wide Web Consortium (W3C)](https://www.w3.org/) が提供する [Planning and Managing Web Accessibility](https://www.w3.org/WAI/planning-and-managing/) を参照してください。

## スキップリンク

ユーザが複数のウェブページで繰り返されるコンテンツをスキップできるように、各ページの上部にメインコンテンツエリアに直接行くリンクを追加する必要があります。

すべてのページで最初にフォーカス可能な要素になるため、通常これは `App.vue` の上部で使われます:

``` html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink">Skip to main content</a>
  </li>
</ul>
```

フォーカスされていない時にリンクを非表示にするには、以下のスタイルを追加します:

``` css
.skipLink {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skipLink:focus {
  opacity: 1;
  background-color: white;
  padding: .5em;
  border: 1px solid black;
}
```

ユーザがルートを変更したら、スキップリンクにフォーカスを戻します。これは以下のように `ref` にフォーカスを呼ぶことで実現できます:

``` vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus();
    }
  }
};
</script>
```

<p class="codepen" data-height="350" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="VwepxJa" style="height: 350px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Skip to Main">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/VwepxJa">
  Skip to Main</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

[メインコンテンツへのスキップリンクについてのドキュメントを読む](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## コンテンツの構造

アクセシビリティの最も重要な部分の1つは、デザインがアクセシブルな実装をサポートできることを確認することです。デザインは、色のコントラスト、フォントの選択、テキストのサイズ、言語だけでなく、アプリケーション内でのコンテンツの構造も考慮する必要があります。

### 見出し

ユーザは見出しを使ってアプリケーションをナビゲートできます。アプリケーションの各セクションに説明的な見出しをつけると、ユーザが各セクションの内容を予測しやすくなります。見出しに関しては、いくつかの推奨されるアクセシビリティの実践方法があります:

- 見出しを順番にネストする: `<h1>` - `<h6>`
- セクション内の見出しをスキップしない
- テキストのスタイル設定の代わりに実際の見出しタグを使用して、見出しの外観を設定する

[見出しについてもっと読む](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
</main>
```

### ランドマーク

ランドマークを使用すると、アプリケーション内のセクションへプログラムによるアクセスができます。支援技術に依存しているユーザは、アプリケーションの各セクションに移動し、コンテンツをスキップすることができます。これを実現するために、[ARIA ロール](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles)を使用することができます。

| HTML            | ARIA ロール                                                         | ランドマークの目的                                                                       |
| --------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| header          | role="banner"                                                     | 主な見出し：ページのタイトル                                                       |
| nav             | role="navigation"                                                 | 文書や関連文書をナビゲートする際に使用するのに適したリンク集 |
| main            | role="main"                                                       | 文書の主な内容または中心的な内容。                                           |
| footer          | role="contentinfo"                                                | 親文書に関する情報:脚注/著作権/プライバシーポリシーへのリンク |
| aside           | role="complementary"                                              | メインコンテンツをサポートしながらも、それ自身コンテンツとして分離され、意味のあるものになっています            |
| _利用不可_ | role="search"                                                     | セクションに含まれるアプリケーションの検索機能                     |
| form            | role="form"                                                       | フォーム関連の要素コレクション                                                 |
| section         | role="region"  | 関連性があり、ユーザがナビゲートする可能性が高いコンテンツ。この要素にはラベルを指定する必要があります                |

:::tip Tip:
レガシーな [HTML5 のセマンティック要素をサポートしていないブラウザ](https://caniuse.com/#feat=html5semantic)との互換性を最大限に高めるために、冗長なランドマークロール属性を持つランドマーク HTML 要素を使用することをお勧めします。
:::

[ランドマークについてもっと読む](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)
