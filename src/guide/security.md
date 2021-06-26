# セキュリティ

## 脆弱性の報告

脆弱性が報告されると、それは直ちに私たちの最重要課題となり、フルタイムコミットのコントリビュータがすべてを投げ出して取り組みます。脆弱性の報告は、[security@vuejs.org](mailto:security@vuejs.org) までメールしてください。

新しい脆弱性が発見されることはめったにありませんが、あなたのアプリケーションを可能な限り安全に保つために、Vue とその公式ライブラリの最新バージョンを常に利用することをおすすめします。

## 一番のルール: 信頼できないテンプレートを使わない

Vue を使うときの最も基本的なセキュリティルールは、 **信頼されていないコンテンツをコンポーネントのテンプレートに使わないこと** です。これはあなたのアプリケーションで任意の JavaScript の実行を許可することと同じで、さらに悪いことに、そのコードがサーバサイドレンダリング中に実行されると、サーバの侵害につながる可能性があります。そのような使い方の例です:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // 絶対にやってはいけないこと
}).mount('#app')
```

Vue のテンプレートは JavaScript にコンパイルされていて、テンプレート内の式はレンダリング処理の一部として実行されます。それらの式は特定のレンダリング・コンテキストに対して評価されますが、潜在的にグローバル実行環境が複雑なため、Vue のようなフレームワークが非現実的なパフォーマンスのオーバーヘッドを発生させることなく、潜在的な悪意のあるコードの実行から完全に保護することは現実的ではありません。このカテゴリの問題を完全に回避する最も簡単な方法は、あなたの Vue テンプレートのコンテンツが常に信頼され、完全に制御されるようにすることです。

## Vue があなたを守るために行っていること

### HTML コンテンツ

テンプレートでも Render 関数でも、コンテンツは自動的にエスケープされます。つまり、このテンプレートでは:

```html
<h1>{{ userProvidedString }}</h1>
```

`userProvidedString` が含まれている場合:

```js
'<script>alert("hi")</script>'
```

これは次のような HTML にエスケープされます:

```html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

これにより、スクリプトの注入を防ぐことができます。このエスケープは、`textContent` のようなブラウザのネイティブ API を使って行われるため、ブラウザ自体に脆弱性がある場合にのみ脆弱性が存在します。

### 属性の束縛

同じように、動的な属性の束縛も自動的にエスケープされます。つまり、このテンプレートでは:

```html
<h1 :title="userProvidedString">
  hello
</h1>
```

`userProvidedString` が含まれている場合:

```js
'" onclick="alert(\'hi\')'
```

これは次のような HTML にエスケープされます:

```html
&quot; onclick=&quot;alert('hi')
```

これにより、新しい任意の HTML を注入するために `title` 属性を閉じることができなくなります。このエスケープは、`setAttribute` のようなブラウザのネイティブ API を使って行われるため、ブラウザ自体に脆弱性がある場合にのみ脆弱性が存在します。

## 潜在的な危険性

ウェブアプリケーションにおいてはどれも、ユーザが提供したサニタイズしていないコンテンツを HTML、CSS、JavaScript として実行させることは、潜在的に危険なため、可能な限り避けるべきです。しかし、いくつかのリスクを許容できる場合もあるでしょう。

例えば、CodePen や JSFiddle といったサービスでは、ユーザが提供したコンテンツを実行することができますが、それは iframe の中である程度サンドボックス化されていて、想定されたコンテキストの中でのことです。もし重要な機能が本質的にいくらかの脆弱性を必要とする場合、その機能の重要性とその脆弱性が起こす可能性のある最悪のシナリオを比較検討するのは、あなたのチームの責任です。

### HTML の注入

以前学んだように、Vue は自動的に HTML コンテンツをエスケープして、あなたのアプリケーション内で実行可能な HTML を誤って注入してしまうことを防ぎます。しかし、HTML が安全だとわかっている場合には、HTML コンテンツを明示的にレンダリングすることができます:

- テンプレートを利用:

  ```html
  <div v-html="userProvidedHtml"></div>
  ```

- Render 関数を利用:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- JSX と Render 関数を利用:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::tip
ユーザが提供した HTML は、サンドボックス化された iframe や、その HTML を書いたユーザだけがアクセスできるアプリケーションの一部に置かない限り、100% 安全とは言えないことにちゅうしてください。加えて、ユーザが独自の Vue テンプレートを書けるようにしても同様の危険があります。
:::

### URL の注入

このような URL で:

```html
<a :href="userProvidedUrl">
  click me
</a>
```

`javascript:` を使った JavaScript の実行を防ぐ URL の「サニタイズ」がされていないと、これにはセキュリティの問題を抱える可能性があります。[sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) のようなライブラリがこのような問題の助けになりますが、注意が必要です:

:::tip
あなたがフロントエンドで URL のサニタイズをしているのであれば、すでにセキュリティの問題があります。ユーザが提供した URL は、データベースに保存する前に、常にバックエンドでサニタイズされるべきです。そうすれば、ネイティブ・モバイルアプリケーションを含む API に接続する _すべての_ クライアントに対して、この問題を回避することができます。またサニタイズされた URL でも、Vue はそれが安全なリンク先につながることを保証できないことに注意してください。
:::

### スタイルの注入

Looking at this example:

```html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

let's assume that `sanitizedUrl` has been sanitized, so that it's definitely a real URL and not JavaScript. With the `userProvidedStyles`, malicious users could still provide CSS to "click jack", e.g. styling the link into a transparent box over the "Log in" button. Then if `https://user-controlled-website.com/` is built to resemble the login page of your application, they might have just captured a user's real login information.

You may be able to imagine how allowing user-provided content for a `<style>` element would create an even greater vulnerability, giving that user full control over how to style the entire page. That's why Vue prevents rendering of style tags inside templates, such as:

```html
<style>{{ userProvidedStyles }}</style>
```

To keep your users fully safe from click jacking, we recommend only allowing full control over CSS inside a sandboxed iframe. Alternatively, when providing user control through a style binding, we recommend using its [object syntax](class-and-style.html#object-syntax-2) and only allowing users to provide values for specific properties it's safe for them to control, like this:

```html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### JavaScript の注入

We strongly discourage ever rendering a `<script>` element with Vue, since templates and render functions should never have side effects. However, this isn't the only way to include strings that would be evaluated as JavaScript at runtime.

Every HTML element has attributes with values accepting strings of JavaScript, such as `onclick`, `onfocus`, and `onmouseenter`. Binding user-provided JavaScript to any of these event attributes is a potential security risk, so should be avoided.

:::tip
Note that user-provided JavaScript can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that JavaScript can ever be exposed to it.
:::

Sometimes we receive vulnerability reports on how it's possible to do cross-site scripting (XSS) in Vue templates. In general, we do not consider such cases to be actual vulnerabilities, because there's no practical way to protect developers from the two scenarios that would allow XSS:

1. The developer is explicitly asking Vue to render user-provided, unsanitized content as Vue templates. This is inherently unsafe and there's no way for Vue to know the origin.

2. The developer is mounting Vue to an entire HTML page which happens to contain server-rendered and user-provided content. This is fundamentally the same problem as \#1, but sometimes devs may do it without realizing. This can lead to possible vulnerabilities where the attacker provides HTML which is safe as plain HTML but unsafe as a Vue template. The best practice is to never mount Vue on nodes that may contain server-rendered and user-provided content.

## ベストプラクティス

The general rule is that if you allow unsanitized, user-provided content to be executed (as either HTML, JavaScript, or even CSS), you might be opening yourself up to attacks. This advice actually holds true whether using Vue, another framework, or even no framework.

Beyond the recommendations made above for [Potential Dangers](#potential-dangers), we also recommend familiarizing yourself with these resources:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Then use what you learn to also review the source code of your dependencies for potentially dangerous patterns, if any of them include 3rd-party components or otherwise influence what's rendered to the DOM.

## バックエンドの調整

HTTP security vulnerabilities, such as cross-site request forgery (CSRF/XSRF) and cross-site script inclusion (XSSI), are primarily addressed on the backend, so aren't a concern of Vue's. However, it's still a good idea to communicate with your backend team to learn how to best interact with their API, e.g. by submitting CSRF tokens with form submissions.

## サーバサイドレンダリング（SSR）

There are some additional security concerns when using SSR, so make sure to follow the best practices outlined throughout [our SSR documentation](ssr/introduction.html) to avoid vulnerabilities.
