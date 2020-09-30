# コンポーネントの基本

## 基本例

Vue コンポーネントの例を次に示します:

```js
// Vue アプリケーションを作成します
const app = Vue.createApp({})

// グローバルな button-counter というコンポーネントを定義します
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
})
```

::: info
ここでは単純な例を示していますが, 典型的な Vue アプリケーションでは文字列テンプレートではなく単一ファイルコンポーネントを使用します。 詳しくは[こちら](single-file-component.html)で解説しています。
:::

コンポーネントは名前付きの再利用可能なインスタンスです。この例の場合は`<button-counter>`です。このコンポーネントをルートインスタンスの中でカスタム要素として使用することができます。

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
app.mount('#components-demo')
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="abORVEJ" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/abORVEJ">
  Component basics</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

コンポーネントは再利用可能なインスタンスなので、`data`、 `computed`、 `watch`、 `methods`、そしてライフサイクルフックのようなルートインスタンスと同様のオプションが利用可能です。唯一の例外は `el` のようなルート固有のオプションです。

## コンポーネントの再利用

コンポーネントは必要なだけ何度でも再利用できます:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="rNVqYvM" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: reusing components">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/rNVqYvM">
  Component basics: reusing components</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

ボタンをクリックすると、それぞれが独自の `count` を保持することに注意してください。 これはコンポーネントを使用する度に新しいコンポーネントの**インスタンス**が作成されるためです。

## コンポーネントの構成

一般的にアプリケーションはネストされたコンポーネントのツリーに編成されます:

![コンポーネントツリー](/images/components.png)

例えば、 ヘッダー、サイドバー、コンテンツエリアなどのコンポーネントがあり、それぞれには一般的にナビゲーションリンクやブログ投稿などのコンポーネントが含まれています。

これらのコンポーネントをテンプレートで使用するためには、 Vue がそれらを認識できるように登録する必要があります。 コンポーネントの登録には**グローバル**と**ローカル**の2種類があります。これまでは、アプリケーションの `component` メソッドを利用してグローバルに登録してきただけです:

```js
const app = Vue.createApp({})

app.component('my-component-name', {
  // ... オプション ...
})
```

グローバルに登録されたコンポーネントはその後作成された `app` インスタンスのテンプレートで使用することができます。さらに、ルートインスタンスのコンポーネントツリーの全てのサブコンポーネント内でも使用することが出来ます。

とりあえずコンポーネント登録についてはこれで以上ですが、このページを読み終えて十分に理解できたら、後から戻ってきて[コンポーネント登録](component-registration.md)の完全なガイドを読むことをお勧めします。

## プロパティを用いた子コンポーネントへのデータの受け渡し

先ほど、 ブログ投稿用のコンポーネントの作成について触れました。問題は、 表示する特定の投稿のタイトルや内容のようなデータを作成したコンポーネントに渡せなければそのコンポーネントは役に立たないということです。プロパティはここで役立ちます。

プロパティはコンポーネントに登録できるカスタム属性です。値がプロパティ属性に渡されると、そのコンポーネントインスタンスのプロパティになります。先ほどのブログ投稿用のコンポーネントにタイトルを渡すためには、`props`オプションを用いてこのコンポーネントが受け取るプロパティのリストの中に含めることができます:

```js
const app = Vue.createApp({})

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-post-demo')
```

コンポーネントは必要に応じて多くのプロパティを持つことができ、デフォルトでは任意のプロパティに任意の値を渡すことができます。上記のテンプレートでは、`data` と同様に、コンポーネントインスタンスでこの値にアクセスできることが分かります。

プロパティが登録されたら、 次のようにカスタム属性としてデータをプロパティに渡すことができます:

```html
<div id="blog-post-demo" class="demo">
  <blog-post title="My journey with Vue"></blog-post>
  <blog-post title="Blogging with Vue"></blog-post>
  <blog-post title="Why Vue is so fun"></blog-post>
</div>
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="PoqyOaX" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: passing props">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/PoqyOaX">
  Component basics: passing props</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

しかしながら、一般的なアプリケーションではおそらく `data` に投稿の配列を持っています:

```js
const App = {
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}

const app = Vue.createApp(App)

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-posts-demo')
```

そしてコンポーネントをそれぞれ描画します:

```html
<div id="blog-posts-demo">
  <blog-post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
  ></blog-post>
</div>
```

上記では、 `v-bind` を用いて動的にプロパティを渡すことができると分かります。これは描画する内容が事前に分からない場合に特に便利です。

とりあえずプロパティについてはこれで以上ですが、 このページを読み終えて十分に理解できたら、後から戻ってきて[プロパティ](component-props.html)の完全なガイドを読むことをお勧めします。

## 子コンポーネントのイベントを購読する

`<blog-post>` コンポーネントを開発する中で、いくつかの機能で親コンポーネントとの通信が必要になるかもしれません。例えば、残りの部分の大きさはそのままで、ブログ記事の文字の文字を拡大するアクセシビリティ機能を実装することを決めるかもしれません。

親コンポーネントでは、`postFontSize` データプロパティを追加することでこの機能をサポートすることができます:

```js
const App = {
  data() {
    return {
      posts: [
        /* ... */
      ],
      postFontSize: 1
    }
  }
}
```

すべてのブログ投稿のフォントサイズを制御するためにテンプレート内で使用できます:

```html
<div id="blog-posts-events-demo">
  <div v-bind:style="{ fontSize: postFontSize + 'em' }">
    <blog-post v-for="post in posts" :key="post.id" :title="title"></blog-post>
  </div>
</div>
```

それでは、すべての投稿の内容の前にテキストを拡大するボタンを追加します:

```js
app.component('blog-post', {
  props: ['title'],
  template: `
    <div class="blog-post">
      <h4>{{ title }}</h4>
      <button>
        Enlarge text
      </button>
    </div>
  `
})
```

問題は、このボタンが何もしないことです:

```html
<button>
  Enlarge text
</button>
```

ボタンをクリックすると、全ての投稿のテキストを拡大する必要があることを親に伝える必要があります。親は、ネイティブ DOM イベントでの場合と同様に、 `v-on` や `@` を用いて子コンポーネントのインスタンスでのイベントを購読することができます:

```html
<blog-post ... @enlarge-text="postFontSize += 0.1"></blog-post>
```

そして子コンポーネントはビルトインの [**`$emit`** メソッド](../api/instance-methods.html#emit)にイベントの名前を渡して呼び出すことで、イベントを送出することができます:

```html
<button @click="$emit('enlarge-text')">
  Enlarge text
</button>
```

親コンポーネントは `v-on:enlarge-text="postFontSize += 0.1"` リスナーによって、このイベントを受け取り `postFontSize` を更新することができます。

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="KKpGyrp" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: emitting events">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/KKpGyrp">
  Component basics: emitting events</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

コンポーネントの `emits` オプションにより排出されたイベントをリストアップすることができます。

```js
app.component('blog-post', {
  props: ['title'],
  emits: ['enlarge-text']
})
```

これにより、コンポーネントが排出する全てのイベントをチェックし、オプションでそれらを[検証する](component-custom-events.html#validate-emitted-events)ことができます。

### イベントと値を送出する

イベントを特定の値と一緒に送出すると便利な場合があります。例えば、テキストをどれだけ大きく表示するかを `<blog-post>` コンポーネントの責務とさせたいかもしれません。そのような場合、 `$emit` の第二引数を使ってこの値を渡すことができます:

```html
<button @click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```

そして親でこのイベントを購読すると、 `$event` を用いて排出されたイベントの値にアクセスすることができます:

```html
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

または、イベントハンドラがメソッドの場合:

```html
<blog-post ... @enlarge-text="onEnlargeText"></blog-post>
```

値はそのメソッドの第一引数として渡されます:

```js
methods: {
  onEnlargeText(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### コンポーネントで `v-model` を使う

カスタムイベントは `v-model` で動作するカスタム入力を作成することもできます。このことを覚えておいてください:

```html
<input v-model="searchText" />
```

これは以下と同じことです:

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

コンポーネントで使用する場合、 `v-model` は代わりにこれを行います:

```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

::: warning
ここでは in-DOM テンプレートを使用しているため、 `model-value` をケバブケースで表記していることに注意してください。ケバブケースの属性とキャメルケースの属性に関しては[DOM テンプレートの構文解析の注意点](#dom-template-parsing-caveats)の章で詳しく解説されています。
:::

これが実際に機能するためには、テンプレート内の `<input>` は以下でなければなりません:

- `value` 属性を `modelValue` プロパティにバインドする
- `input` では、 `update:modelValue` イベントを新しい値と共に送出する

以下のようになります:

```js
app.component('custom-input', {
  props: ['modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

これで `v-model` はこのコンポーネントで完璧に動作します:

```html
<custom-input v-model="searchText"></custom-input>
```

カスタムコンポーネント内で `v-model` を使うもう一つの方法は `computed` プロパティを利用してゲッターとセッターを定義することです。

以下の例では、computed プロパティを用いて `custom-input` コンポーネントをリファクタリングします。

注意して欲しいのは、 `get` メソッドは `modelValue` 属性を返し、バインディングに使用しているプロパティがどれであるかに関わらず、 `set` メソッドはそのプロパティに対応する `$emit` を送出しなければならないということです。

```js
app.component('custom-input', {
  props: ['modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

とりあえずカスタムコンポーネントイベントについてはこれで以上ですが、このページを読み終えて十分に理解できたら、後から戻ってきて[カスタムイベント](component-custom-events.md)の完全なガイドを読むことをお勧めします。

## スロットによるコンテンツ配信

HTML 要素のように、コンポーネントに要素を渡すことができると便利なことがよくあります。例えば以下の通り:

```html
<alert-box>
  Something bad happened.
</alert-box>
```

これは以下のように描画されるでしょう。:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="jOPeaob" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: slots">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/jOPeaob">
  Component basics: slots</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

幸いにも、この作業は Vue のカスタム `<slot>` 要素により非常に簡単になります:

```js
app.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

上で見た通り、ただ渡したいところにスロットを追加するだけです。それだけです。終わりです！

とりあえずスロットについてはこれで以上ですが、このページを読み終えて十分に理解できたら、後から戻ってきて[スロット](component-slots.md)の完全なガイドを読むことをお勧めします。

## 動的なコンポーネント

タブ付きのインターフェースのように、コンポーネント間を動的に切り替えると便利なことがあります:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="oNXaoKy" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: dynamic components">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/oNXaoKy">
  Component basics: dynamic components</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

上記は Vue の `<component>` 属性に特別な属性である `is` を持たせることで実現しています:

```html
<!-- コンポーネントは currentTabComponent に変更があったときに変更されます -->
<component :is="currentTabComponent"></component>
```

上記の例では、 `currentTabComponent` は以下のいずれかを含むことができます:

- 登録されたコンポーネントの名前、または
- コンポーネントのオプションオブジェクト

完全なコードを試すには [この例](https://codepen.io/team/Vue/pen/oNXaoKy)、登録された名前ではなくコンポーネントのオプションオブジェクトをバインドしている例は[こちらのバージョン](https://codepen.io/team/Vue/pen/oNXapXM)を参照してください。

この属性は通常の HTML 要素で使用することができますが、それらはコンポーネントとして扱われ、すべての属性は **DOM 属性としてバインドされる**ことを覚えておいてください。 `value` のようないくつかのプロパティが期待通りに動作するためには、 [`.prop` 修飾子](../api/directives.html#v-bind)を用いてバインドする必要があります。

とりあえず動的なコンポーネントについてはこれで以上ですが、このページを読み終えて十分に理解できたら、後から戻ってきて[動的 & 非同期コンポーネント](./component-dynamic-async.html)の完全なガイドを読むことをお勧めします。

## DOM テンプレートパース時の警告

`<ul>` 、 `<ol>` 、 `<table>` 、 `<select>` のようないくつかの HTML 属性にはその内側でどの要素が現れるかに制限があり、`<li>` 、 `<tr>` 、 `<option>` のようないくつかの属性は他の特定の要素の中にしか現れません。

このような制限を持つ属性を含むコンポーネントを使用すると問題が発生することがあります。例えば:

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

このカスタムコンポート `<blog-post-row>` は無効なコンテンツとして摘み出され、最終的に描画された内容にエラーが発生します。幸い、これを回避するために `v-is` という特殊なディレクティブを使用することができます:

```html
<table>
  <tr v-is="'blog-post-row'"></tr>
</table>
```

:::warning
`v-is` の値は JavaScript の文字列リテラルである必要があります:

```html
<!-- 間違い、何も出力されません-->
<tr v-is="blog-post-row"></tr>

<!-- 正解 -->
<tr v-is="'blog-post-row'"></tr>
```

:::

また、 HTML の属性名は大文字小文字を区別しないので、ブラウザは全ての大文字を小文字として解釈します。つまり、 in-DOM テンプレートを使用している場合、キャメルケースのプロパティ名やイベントハンドラのパラメータはそれと同等のケバブケース（ハイフンで区切られた記法）を使用する必要があります:

```js
// JavaScript ではキャメルケース

app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```html
<!-- HTML ではケバブケース -->

<blog-post post-title="hello!"></blog-post>
```

**これらの制限は次のソースのいずれかの文字列テンプレートを使用している場合 _適用されない_ ことに**気をつけてください:

- 文字列テンプレート (例: `template: '...'`)
- [単一ファイル (`.vue`) コンポーネント](single-file-component.html)
- `<script type="text/x-template">`

とりあえず DOM テンプレートパース時の警告についてはこれで以上です。そして実は、Vue の _本質_ の最後となります。おめでとうございます! まだまだ学ぶべきことはありますが、まずは一休みして自分で Vue を実際に使って楽しいものを作ってみることをお勧めします。

理解したばかりの知識に慣れてきたら、サイドバーのコンポーネントの詳細セクションの他のページと同様に、[動的 & 非同期コンポーネント](component-dynamic-async.html)の完全なガイドを読むために戻ってくることをお勧めします。
