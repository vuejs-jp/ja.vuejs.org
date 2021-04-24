# フォーム入力バインディング

## 基本的な使い方

form の input 要素や textarea 要素、 select 要素に双方向データバインディングを付与するためには、`v-model`を使用することができます。`v-model`は、要素を更新する適切な方法を入力の種類に基づき自動的に選択します。少し魔法のようですが、本来`v-model`は糖衣構文(syntax sugar)であり、ユーザの入力イベントに応じてデータを更新し、さらにエッジケースに対する特別な配慮をしてくれます。

::: tip
`v-model` はフォーム要素の`value`属性や`checked`属性、`selected`属性の初期値を無視します。`v-model`は常に、現在アクティブなインスタンスの`data`を信頼できる情報源として扱います。初期値の宣言は JavaScript 側、コンポーネントの`data`オプション内で行ってください。
:::

内部的には、`v-model`は異なる input 要素に対し異なるプロパティを使用し、異なるイベントを送出します。

- text および textarea 要素には、`value`プロパティと`input`イベントを用います
- チェックボックスおよびラジオボタンには、`checked`プロパティと`change`イベントを用います
- select フィールドには、`value`プロパティと`change`イベントを用います

<span id="vmodel-ime-tip"></span>
::: tip Note
[IME](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%83%97%E3%83%83%E3%83%88%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89)を必要とする言語 (中国語、日本語、韓国語など) においては、IME による入力中に `v-model` が更新を行わないことに気づくでしょう。このような更新にも対応したい場合、 `v-model` をつかう代わりに `input` イベントリスナと `value` のバインディングを使ってください。
:::

### テキスト

```html
<input v-model="message" placeholder="edit me" />
<p>Message is: {{ message }}</p>
```

<common-codepen-snippet title="Handling forms: basic v-model" slug="eYNPEqj" :preview="false" />

### 複数行テキスト

```html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br />
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

<common-codepen-snippet title="Handling forms: textarea" slug="xxGyXaG" :preview="false" />

textarea への挿入は機能しません。代わりに`v-model`を用いてください。

```html
<!-- bad -->
<textarea>{{ text }}</textarea>

<!-- good -->
<textarea v-model="text"></textarea>
```

### チェックボックス

単一のチェックボックスと boolean 値:

```html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<common-codepen-snippet title="Handling forms: checkbox" slug="PoqyJVE" :preview="false" />

同じ配列にバインドされた複数のチェックボックス:

```html
<div id="v-model-multiple-checkboxes">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames" />
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
  <label for="mike">Mike</label>
  <br />
  <span>Checked names: {{ checkedNames }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      checkedNames: []
    }
  }
}).mount('#v-model-multiple-checkboxes')
```

<common-codepen-snippet title="Handling forms: multiple checkboxes" slug="bGdmoyj" :preview="false" />

### ラジオ

```html
<div id="v-model-radiobutton">
  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">One</label>
  <br />
  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Two</label>
  <br />
  <span>Picked: {{ picked }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      picked: ''
    }
  }
}).mount('#v-model-radiobutton')
```

<common-codepen-snippet title="Handling forms: radiobutton" slug="MWwPEMM" :preview="false" />

### セレクト

単一のセレクト:

```html
<div id="v-model-select" class="demo">
  <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      selected: ''
    }
  }
}).mount('#v-model-select')
```

<common-codepen-snippet title="Handling forms: select" slug="KKpGydL" :preview="false" />

:::tip Note
`v-model`の式の初期値がいずれのオプションとも一致しない場合、`<select>`要素は *未選択* の状態で描画されます。これにより iOS では最初のアイテムが選択できなくなります。なぜなら iOS はこのような場合に `change` イベントを発火させないためです。したがって、上記の例で示したように、`value`を持たない`disabled` なオプションを追加しておくことをおすすめします。
:::

複数個のセレクト（配列にバインド）:

```html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br />
<span>Selected: {{ selected }}</span>
```

<common-codepen-snippet title="Handling forms: select bound to array" slug="gOpBXPz" tab="html,result" :preview="false" />

動的なオプションを`v-for`により描画:

```html
<div id="v-model-select-dynamic" class="demo">
  <select v-model="selected">
    <option v-for="option in options" :value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ]
    }
  }
}).mount('#v-model-select-dynamic')
```

<common-codepen-snippet title="Handling forms: select with dynamic options" slug="abORVZm" :preview="false" />

## 値のバインディング

ラジオやチェックボックス、セレクトの option において、`v-model`でバインディングされる値は通常は静的な文字列（チェックボックスの場合は boolean も）です:

```html
<!-- チェックされているとき`picked` は文字列"a"になります -->
<input type="radio" v-model="picked" value="a" />

<!-- toggle` は true または false のどちらかです -->
<input type="checkbox" v-model="toggle" />

<!-- 最初のオプションが選択されているとき`selected` は文字列"abc"です -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

しかし、現在アクティブなインスタンスの動的なプロパティに値をバインドしたいときがあるかもしれません。それを実現するためには`v-bind`を使用できます。さらに、`v-bind`を使用することで入力値に文字列以外の値もバインドできるようになります。

### チェックボックス

```html
<input type="checkbox" v-model="toggle" true-value="yes" false-value="no" />
```

```js
// チェックされているとき:
vm.toggle === 'yes'
// チェックされていないとき:
vm.toggle === 'no'
```

:::tip Tip
`true-value` と `false-value` 属性は input の `value` 属性には影響を及ぼしません。なぜならブラウザはチェックされていないチェックボックスをフォーム送信内容には含めないためです。二つの値（例: "yes" または "no"）のうち一つが必ず送信されることを保証するには、代わりにラジオを使用してください。
:::

### ラジオ

```html
<input type="radio" v-model="pick" v-bind:value="a" />
```

```js
// チェックされているとき:
vm.pick === vm.a
```

### セレクトオプション

```html
<select v-model="selected">
  <!-- インラインオブジェクトリテラル -->
  <option :value="{ number: 123 }">123</option>
</select>
```

```js
// 選択されているとき:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## 修飾子

### `.lazy`
デフォルトでは`v-model`は各`input`イベント後に入力値とデータを同期します（[上述](#vmodel-ime-tip)の IME 入力の例外はあります）。`lazy` 修飾子を加えることで、`change`イベント後に同期するよう変更できます。

```html
<!-- "input" ではなく "change" イベントの後に同期されます -->
<input v-model.lazy="msg" />
```

### `.number`

ユーザ入力を自動的に number へ型キャストさせたい場合は、`v-model`で管理している input に`number`修飾子を加えることができます。

```html
<input v-model.number="age" type="number" />
```

これはしばしば有用です。なぜなら`type="number"`が書いてあったとしても HTML の input 要素は常に文字列を返すためです。値が`parseFloat()` でパースできない場合は、元々の値が返却されます。

### `.trim`

ユーザ入力から空白を自動で取り除きたい場合は、`v-model`で管理している input に `trim` 修飾子を加えることができます。

```html
<input v-model.trim="msg" />
```

## コンポーネントの`v-model`

> まだ Vue コンポーネントに慣れていない場合、この節は一旦スキップすることができます。

HTML 組み込みの input タイプが、常にあなたのニーズに適っているとは限りません。幸運にも、Vue コンポーネントによって、動作を隅々までカスタマイズ可能な再利用性のある入力フォームを自作することができます。それらのフォームに`v-model`を使うことも可能です！詳しくは、コンポーネントガイドの [カスタム input](./component-basics.html#using-v-model-on-components) を参照してください。
