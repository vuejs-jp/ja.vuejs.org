# セマンティクス

## フォーム

フォームを作成するとき、以下の要素を使用することができます: `<form>` 、`<label>` 、`<input>` 、`<textarea>` 、そして `<button>` です。

ラベルは一般的にフォームの上部または左側に配置します。

```html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<p class="codepen" data-height="368" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="YzwpPYZ" style="height: 368px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Simple Form">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/YzwpPYZ">
  Simple Form</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

どのように `autocomplete='on'` をフォーム要素上に含むことができるかに注目してください。そしてそれはフォーム内の全ての入力欄に適用されます。また各入力欄の [autocomplete 属性に対して異なる値](https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/autocomplete)をセットすることもできます。

### ラベル

全てのフォームコントロールの目的を説明するためにラベルを提供してください。`for` と `id` はリンクしています:

```html
<label for="name">Name</label>
<input type="text" name="name" id="name" v-model="name" />
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="wvMrGqz" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Label">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/wvMrGqz">
  Form Label</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

chrome デベロッパツールでこの要素を検証し、Elements タブ内の Accessibility タブを開くと、どのように入力欄がその名前をラベルから取得するかを確認できます:

![label からアクセス可能な入力欄の名前を表示する Chrome デベロッパツール](/images/AccessibleLabelChromeDevTools.png)

:::warning Warning:
以下のように入力欄をラップしているラベルを見たことがあるかもしれません:

```html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

一致する id で明示的にラベルを設定することは支援技術によってより適切にサポートされます。
:::

#### aria-label

[`aria-label`](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) によりアクセス可能な名前を入力欄に付与することもできます。

```html
<label for="name">Name</label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="jOWGqgz" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form ARIA label">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/jOWGqgz">
  Form ARIA label</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

この要素を Chrome DevTools で自由に検証し、どのようにアクセス可能な名前が変更されたか確認してください:

![aria-label からアクセス可能な入力欄の名前を表示する Chrome デベロッパツール](/images/AccessibleARIAlabelDevTools.png)

#### aria-labelledby

[`aria-labelledby`](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) は `aria-label` に類似しており、ラベルテキストが画面に表示されている場合に使用されることを期待します。これは `id` によって他の要素とペアになっており、複数の `id` を関連付けることができます:

```html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="ZEQXOLP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form ARIA labelledby">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/ZEQXOLP">
  Form ARIA labelledby</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

![aria-labelledby からアクセス可能な入力欄の名前を表示する Chrome デベロッパツール](/images/AccessibleARIAlabelledbyDevTools.png)

#### aria-describedby

[aria-describedby](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) は `aria-labelledby` と同じ方法で使用され、ユーザが必要とする可能性のある追加情報と説明を提供します。これは任意の入力欄の基準を説明するために使用することができます:

```html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="JjGrKyY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form ARIA describedby">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/JjGrKyY">
  Form ARIA describedby</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Chrome DevTools で検出することで Description を確認することができます:

![aria-labelledby と aria-describedby を含む description からアクセス可能な入力欄の名前を表示する Chrome デベロッパツール](/images/AccessibleARIAdescribedby.png)

### プレースホルダ

多くのユーザが混乱する可能性があるため、プレースホルダの使用は避けてください。

プレースホルダによる問題の１つは初期状態で [color contrast criteria](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) を満たしていないことです。色のコントラストを修正するとプレースホルダが入力欄に事前入力されたデータのように見えます。以下の例を見ると、color contrast criteria を満たしている Last Name プレースホルダが事前入力されたデータのように見えることが確認できます:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="PoZJzeQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Placeholder">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/PoZJzeQ">
  Form Placeholder</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

ユーザがフォームを入力するために必要とするすべての情報を入力欄の外側で提供するのが最善です。

### 説明

入力欄に説明を追加するとき、入力欄に対して正しくリンクしていることを確認してください。
あなたは追加の説明を提供し、複数の id を  [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) 内に束縛することができます。これにより、さらに柔軟な設計が可能になります。

```html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date:</label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

あるいは、[`aria-describedby`](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) を使用して入力欄に説明を添付することもできます:

```html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="GRoMqYy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Instructions">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/GRoMqYy">
  Form Instructions</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### コンテンツの非表示

入力欄がアクセス可能な名前を持っている場合でも、視覚的にラベルを非表示にすることは非推奨です。しかし、入力欄の機能が周囲のコンテンツから理解できる場合は、視覚的なラベルを非表示にすることができます。

以下の検索フィールドを見てみましょう:

```html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

これができるのは、検索ボタンが視覚的にユーザが入力欄の目的を特定を助けるためです。

CSSを使用して要素を視覚的に非表示にすることができますが、それらを支援技術で利用できるようにしておきます:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="qBbpQwB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Search">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/qBbpQwB">
  Form Search</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

#### aria-hidden="true"

 `aria-hidden="true"` を追加すると要素は支援技術から隠されますが、他のユーザから視覚的に利用可能になります。フォーカス可能な要素や、純粋に装飾的なコンテンツ、複製されたコンテンツ、または画面外のコンテンツには使用しないでください。

```html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### ボタン

フォーム内でボタンを使用するときは、フォームの送信をしないようにタイプを設定する必要があります。
入力欄を使用してボタンを作ることもできます:

```html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Buttons -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- Input buttons -->
  <input type="button" value="Cancel" />
  <input type="submit" value="Submit" />
</form>
```

<p class="codepen" data-height="467" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="PoZEXoj" style="height: 467px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Buttons">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/PoZEXoj">
  Form Buttons</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

#### 機能的な画像

機能的な画像を作るために次の技術を使うことができます。

- 入力欄

  - これらの画像はフォーム上の送信タイプのボタンとして機能します

  ```html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- アイコン

```html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="NWxXeqY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Functional Images">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/NWxXeqY">
  Functional Images</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
