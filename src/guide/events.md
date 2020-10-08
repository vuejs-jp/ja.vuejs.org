# イベントハンドリング

<div class="vueschool"><a href="https://vueschool.io/lessons/vuejs-user-events?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to handle events on Vue School">イベントハンドリングする方法を Vue School の無料レッスンで学ぶ</a></div>

## イベントの購読

`v-on` ディレクティブを使うことで、DOM イベントの購読、イベント発火時の JavaScript の実行が可能になります。これは通常 `@` に省略することができます。`v-on:click="methodName"` もしくは `@click="methodName"` と書いて使用します。

例:

```html
<div id="basic-event">
  <button @click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      counter: 1
    }
  }
}).mount('#basic-event')
```

結果:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="xxGadPZ" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Event handling: basic">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/xxGadPZ">
  Event handling: basic</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## メソッドイベントハンドラ

多くのイベントハンドラのロジックはより複雑になっていくので、`v-on`  属性の値に JavaScript 式を記述し続けるのは現実的ではありません。そのため、`v-on`  は呼び出したいメソッドの名前も受け付けます。

例:

```html
<div id="event-with-method">
  <!-- `greet` は、あらかじめ定義したメソッドの名前 -->
  <button @click="greet">Greet</button>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      name: 'Vue.js'
    }
  },
  methods: {
    greet(event) {
      // メソッド内の `this` は、 Vue インスタンスを参照します
      alert('Hello ' + this.name + '!')
      // `event` は、ネイティブ DOM イベントです
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
}).mount('#event-with-method')
```

結果:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="jOPvmaX" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Event handling: with a method">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/jOPvmaX">
  Event handling: with a method</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## インラインメソッドハンドラ

メソッド名を直接指定する代わりに、インライン JavaScript 式でメソッドを指定することもできます:

```html
<div id="inline-handler">
  <button @click="say('hi')">Say hi</button>
  <button @click="say('what')">Say what</button>
</div>
```

```js
Vue.createApp({
  methods: {
    say(message) {
      alert(message)
    }
  }
}).mount('#inline-handler')
```

結果:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="WNvgjda" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Event handling: with an inline handler">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/WNvgjda">
  Event handling: with an inline handler</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

時には、インラインステートメントハンドラでオリジナルの DOM イベントを参照したいこともあるでしょう。特別な `$event` 変数を使うことでメソッドに DOM イベントを渡すことができます:

```html
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

```js
// ...
methods: {
  warn(message, event) {
    // ネイティブイベントを参照しています
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

## 複数イベントハンドラ

イベントハンドラ内ではカンマで区切ることで、複数のメソッドを設定することができます:

```html
<!-- ボタンをクリックすると、one（）とtwo（）の両方が実行されます -->
<button @click="one($event), two($event)">
  Submit
</button>
```

```js
// ...
methods: {
  one(event) {
    // one($event)のハンドラーロジック
  },
  two(event) {
    // two($event)のハンドラーロジック
  }
}
```

## イベント修飾子

イベントハンドラ内での `event.preventDefault()` または `event.stopPropagation()`  の呼び出しは、様々な場面で共通に必要になります。これらはメソッド内部で簡単に呼び出すことができますが、DOM イベントの込み入った処理をおこなうよりも、純粋なデータロジックだけになっている方がより良いでしょう。

この問題に対応するために、Vue は `v-on` のために **イベント修飾子(event modifiers)** を提供しています。修飾子は、ドット(.)で表記されるディレクティブの接尾辞を思い返してください。

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`
- `.passive`

```html
<!-- クリックイベントの伝搬が止まります -->
<a @click.stop="doThis"></a>

<!-- submit イベントによってページがリロードされません -->
<form @submit.prevent="onSubmit"></form>

<!-- 修飾子は繋げることができます -->
<a @click.stop.prevent="doThat"></a>

<!-- 値を指定せず、修飾子だけ利用することもできます -->
<form @submit.prevent></form>

<!-- イベントリスナーを追加するときにキャプチャモードで使います -->
<!-- 言い換えれば、内部要素を対象とするイベントは、その要素によって処理される前にここで処理されます -->
<div @click.capture="doThis">...</div>

<!-- event.target が要素自身のときだけ、ハンドラが呼び出されます -->
<!-- 言い換えると子要素のときは呼び出されません -->
<div @click.self="doThat">...</div>
```

::: tip
修飾子を使用するとき、関連するコードが同じ順序で生成されるため注意してください。それゆえ、`@click.prevent.self` を使用すると**全てのクリックイベント**を防ぐことはできますが、`@click.self.prevent` は要素自身におけるクリックイベントを防ぐだけです。
:::

```html
<!-- 最大1回、クリックイベントはトリガされます -->
<a @click.once="doThis"></a>
```

他の修飾子とは違って、ネイティブ DOM イベント専用ではありますが、`.once` 修飾子を[コンポーネントイベント](component-custom-events.html)でも使用することができます。まだコンポーネントについて読んでいないなら、今は気にする必要はありません。

Vue は [`addEventListener`の `passive` オプション](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)に対応する `.passive` 修飾子も提供しています。

```html
<!-- `onScroll` が `event.preventDefault()` を含んでいたとしても -->
<!-- スクロールイベントのデフォルトの挙動(つまりスクロール)は -->
<!-- イベントの完了を待つことなくただちに発生するようになります -->
<div @scroll.passive="onScroll">...</div>
```

`.passive` 修飾子は特にモバイルでのパフォーマンスを改善するのに有用です。

::: tip
`.passive` と `.prevent` を一緒に使わないでください。`.prevent `は無視され、ブラウザにはおそらく警告が表示されます。`.passive` はイベントのデフォルトの挙動を妨げないことをブラウザに伝達することを思い出してください。
:::

## キー修飾子

キーボードイベントを購読するにあたって、特定のキーのチェックが必要になることがあります。Vue では、`v-on` または `@` に対してキー修飾子を追加することができます:

```html
<!-- `key` が `Enter` のときだけ、`vm.submit()` が呼ばれます  -->
<input @keyup.enter="submit" />
```

[`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)  で公開されている任意のキー名は、ケバブケースに変換することで修飾子として直接使用できます。

```html
<input @keyup.page-down="onPageDown" />
```

上の例では、ハンドラは `$event.key `が `'PageDown'` に等しい場合だけ呼ばれます。

### キーコード

Vue は最も一般的に使用されるキーコードのエイリアスを提供しています:

- `.enter`
- `.tab`
- `.delete` ("Delete" と "Backspace" キー両方をキャプチャします)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

## システム修飾子キー

次の修飾子を使用すると、対応するキーが押されたときにのみマウスもしくはキーボードのイベントリスナをトリガできます:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Note
注意: Macintosh キーボードの場合、meta はコマンドキー（⌘）です。Windows のキーボードでは、meta はウィンドウキー（⊞）です。Sun Microsystems のキーボードでは、メタは実線のダイヤモンド（◆）とマークされています。特定のキーボードでは、特に MIT や Lisp マシンのキーボードと Knight キーボード、space-cadet キーボード、メタのような後継機には "META" と表示されます。 Symbolics のキーボードでは、 “META" または “Meta" というラベルが付いています。
:::

例:

```html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
修飾子キーは通常のキーとは異なり、`keyup` イベントで使用する場合、イベント発生時に押されていなければならないことに注意してください。言い換えると、`keyup.ctrl` は `ctrl` を押しながら何かのキーを離したときにのみ、トリガされます。`ctrl` キーだけを離しても、トリガされません。
:::

### `.exact` 修飾子

`.exact` 修飾子はイベントを引き起こすために必要なシステム修飾子の正確な組み合わせを制御します。

```html
<!-- これは Ctrl に加えて Alt や Shift キーが押されていても発行されます -->
<button @click.ctrl="onClick">A</button>

<!-- これは Ctrl キーが押され、他のキーが押されてないときだけ発行されます -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- これは システム修飾子が押されてないときだけ発行されます -->
<button @click.exact="onClick">A</button>
```

### マウスボタンの修飾子

- `.left`
- `.right`
- `.middle`

これらの修飾子は、イベントのトリガのハンドリングを、特定のマウスのボタンのみに制限します。

## なぜ HTML にリスナを記述するのですか

これまで説明してきたようなイベント監視のアプローチは、"関心の分離"という古き良きルールを破っているのではないか、と心配されるかもしれません。安心してください。すべての Vue ハンドラ関数と式は、現在の View を扱う ViewModel に厳密に閉じています。それによってメンテナンスが難しくなることはありません。実際、`v-on` または `@` を利用することでいくつかの利点があります。

1. HTML テンプレートを眺めることで、JS コード内のハンドラ関数を探すことを容易にします

2. JS 内のイベントリスナーを手作業でアタッチする必要がないので、ViewModel を DOM 依存のない純粋なロジックにできます。これはテスタビリティを向上させます。

3. ViewModel が消去されるときに、すべてのイベントリスナーは自動で削除されます。手動でそれらの消去をおこなうことを気にする必要はありません。
