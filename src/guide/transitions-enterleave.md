# Enter & Leave トランジション

Vue は、DOM からアイテムが追加、更新、削除されたときにトランジション効果を適用するための方法を複数提供しています:

- 自動的に CSS トランジションやアニメーションのためのクラスを適用します。
- [Animate.css](https://animate.style/) のようなサードパーティの CSS アニメーションライブラリと連携します。
- トランジションフックが実行されている間、JavaScript を使って直接 DOM 操作を行います。
- サードパーティの JavaScript アニメーションライブラリと連携します。

このページでは、entering/leaving のトランジションについてのみ取り扱いますが、次の章では、[リストのトランジション](transitions-list.html) と [状態のトランジション](transitions-state.html) について扱います。

## 単一要素/コンポーネントのトランジション

Vue は、`transition` ラッパーコンポーネントを提供しています。このコンポーネントは、次のコンテキストにある要素やコンポーネントに entering/leaving トランジションを追加することを可能にします:

- 条件付きの描画 (`v-if` を使用)
- 条件付きの表示 (`v-show` を利用)
- 動的コンポーネント
- コンポーネントルートノード (Component root nodes)

これは、アクションのように見える非常にシンプルな例です:

```html
<div id="demo">
  <button @click="show = !show">
    Toggle
  </button>

  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

<common-codepen-snippet title="Simple Transition Component" slug="3466d06fb252a53c5bc0a0edb0f1588a" tab="html,result" :editable="false" />

`transition` コンポーネントにラップされた要素が挿入あるいは削除されるとき、次のことが行われます:

1. Vue は、対象の要素が CSS トランジションあるいはアニメーションが適用されるか自動的に察知します。それがない場合、適切なタイミングで、CSS トランジションのクラスを追加/削除します。

2. もし、トランジションコンポーネントが [JavaScript フック](#JavaScript-フック) を提供している場合は、適切なタイミングでそれらのフックが呼ばれます。

3. もし、CSS トランジション/アニメーションが検出されず、JavaScript フックも提供されない場合、挿入、削除のいずれか、あるいは両方の DOM 操作を次のフレームでただちに実行します。(注意: ここでのフレームはブラウザのアニメーションフレームを指します。 Vue の `nextTick` のコンセプトのそれとは異なるものです)

### トランジションクラス

以下は、enter/leave トランジションのために適用される 6 つのクラスです。

1. `v-enter-from `: enter の開始状態。その要素が挿入される前に適用され、その要素が挿入された 1 フレーム後に削除されます。

2. `v-enter-active`: enter の活性状態。トランジションに入るフェーズ中に適用されます。その要素が挿入される前に追加され、そのトランジション/アニメーションが終了すると削除されます。このクラスは、トランジションの開始に対して、期間、遅延、およびイージングカーブを定義するために使用できます。

3. `v-enter-to`: enter の終了状態。その要素が挿入された 1 フレーム後に追加され (同時に `v-enter-from` が削除されます)、そのトランジション/アニメーションが終了すると削除されます。

4. `v-leave-from`: leave の開始状態。トランジションの終了がトリガされるとき、直ちに追加され、1 フレーム後に削除されます。

5. `v-leave-active`: leave の活性状態。トランジションが終わるフェーズ中に適用されます。leave トランジションがトリガされるとき、直ちに追加され、トランジション/アニメーションが終了すると削除されます。このクラスは、トランジションの終了に対して、期間、遅延、およびイージングカーブを定義するために使用できます。

6. `v-leave-to`: leave の終了状態。leave トランジションがトリガされた 1 フレーム後に追加され (同時に `v-leave-from` が削除されます)、トランジション/アニメーションが終了すると削除されます。

![Transition Diagram](/images/transitions.svg)

各クラスは、トランジションの名前が先頭に付きます。`<transition>` 要素に名前がない場合は、デフォルトで `v-` が先頭に付きます。例えば、`<transition name="my-transition">` の場合は、`v-enter-from` クラスではなく、`my-transition-enter-from` となります。

`v-enter-active` と `v-leave-active` は、次のセクションの例で見ることができるような、enter/leave トランジションで異なるイージングカーブの指定を可能にします。

### CSS トランジション

トランジションを実現する最も一般な方法として、CSS トランジションを使います。これはシンプルな例です:

```html
<div id="demo">
  <button @click="show = !show">
    Toggle render
  </button>

  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
/* Enter および leave アニメーションは、それぞれ異なる */
/* 間隔やタイミング関数を利用できます。              */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<common-codepen-snippet title="Different Enter and Leave Transitions" slug="0dfa7869450ef43d6f7bd99022bc53e2" tab="css,result" :editable="false" />

### CSS アニメーション

CSS アニメーションは、CSS トランジションと同じように適用されますが、異なるのは `v-enter-from` が要素が挿入された直後に削除されないことです。しかし、`animationend` イベント時には削除されています。

これは簡潔にするために CSS ルールの接頭辞を除いた例です。

```html
<div id="demo">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis
      enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi
      tristique senectus et netus.
    </p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<common-codepen-snippet title="CSS Animation Transition Example" slug="8627c50c5514752acd73d19f5e33a781" tab="html,result" :editable="false" />

### カスタムトランジションクラス

次の属性で、カスタムトランジションクラスを指定できます:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

これらは、クラス名の規約を上書きします。これは、Vue のトランジションシステムと [Animate.css](https://daneden.github.io/animate.css/) のような既存の CSS アニメーションライブラリを組み合わせたいときに特に便利です。

こちらが例となります:

```html
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.0/animate.min.css"
  rel="stylesheet"
  type="text/css"
/>

<div id="demo">
  <button @click="show = !show">
    Toggle render
  </button>

  <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__tada"
    leave-active-class="animate__animated animate__bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

### トランジションとアニメーションの併用

Vue はトランジションが終了したことを把握するためのイベントリスナのアタッチを必要とします。イベントは、適用される CSS ルールに応じて `transitionend` か `animationend` のいずれかのタイプになります。あなたがトランジションとアニメーション、どちらか一方だけ使用する場合は、Vue は自動的に正しいタイプを判断することができます。

しかし、例えば、ホバーの CSS トランジション効果と Vue による CSS アニメーションのトリガの両方を持つ場合など、時には、同じ要素に両方を使うこともあるかもしれません。これらのケースでは、Vue に扱って欲しいタイプを `type` 属性で明示的に宣言するべきでしょう。この属性の値は、`animation` あるいは `transition` を取ります。

### 明示的なトランジション期間の設定

<!-- TODO: validate and provide an example -->

ほとんどの場合、 Vue は、自動的にトランジションが終了したことを見つけ出すことは可能です。デフォルトでは、 Vue はルート要素の初めの `transitionend` もしくは `animationend` イベントを待ちます。しかし、これが常に望む形とは限りません。例えば、幾つかの入れ子となっている内部要素にてトランジションの遅延がある場合や、ルートのトランジション要素よりも非常に長いトランジション期間を設けている場合の、一連のトランジションのまとまりなどです。

このような場合 `<transition>` コンポーネントがもつ `duration` プロパティを利用することで、明示的に遷移にかかる時間（ミリ秒単位）を指定することが可能です:

```html
<transition :duration="1000">...</transition>
```

また、活性化時と終了時の期間を、個別に指定することも可能です:

```html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### JavaScript フック

属性によって JavaScript フックを定義することができます:

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
  :css="false"
>
  <!-- ... -->
</transition>
```

```js
// ...
methods: {
  // --------
  // ENTERING
  // --------

  beforeEnter(el) {
    // ...
  },
  // CSS と組み合わせて使う時、
  // done コールバックはオプションです
  enter(el, done) {
    // ...
    done()
  },
  afterEnter(el) {
    // ...
  },
  enterCancelled(el) {
    // ...
  },

  // --------
  // LEAVING
  // --------

  beforeLeave(el) {
    // ...
  },
  // CSS と組み合わせて使う時、
  // done コールバックはオプションです
  leave(el, done) {
    // ...
    done()
  },
  afterLeave(el) {
    // ...
  },
  // v-show と共に使うときだけ leaveCancelled は有効です
  leaveCancelled(el) {
    // ...
  }
}
```

これらのフックは、CSS トランジション/アニメーション、または別の何かと組み合わせて使うことができます。

JavaScript のみを利用したトランジションの場合は、**`done` コールバックを `enter` と `leave` フックで呼ぶ必要があります**。呼ばない場合は、フックは同期的に呼ばれ、トランジションはただちに終了します。また、 `:css="false"` を追加することで、CSS の検出をスキップすることも Vue に伝えられます。これによってわずかにパフォーマンスが改善するほか、CSS のルールの誤ったトランジションへの干渉を防ぐことができます。

今から例をみていきましょう。これは [GreenSock](https://greensock.com/) を使ったシンプルな JavaScript トランジションの例です:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js"></script>

<div id="demo">
  <button @click="show = !show">
    Toggle
  </button>

  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: false
    }
  },
  methods: {
    beforeEnter(el) {
      gsap.set(el, {
        scaleX: 0.8,
        scaleY: 1.2
      })
    },
    enter(el, done) {
      gsap.to(el, {
        duration: 1,
        scaleX: 1.5,
        scaleY: 0.7,
        opacity: 1,
        x: 150,
        ease: 'elastic.inOut(2.5, 1)',
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        duration: 0.7,
        scaleX: 1,
        scaleY: 1,
        x: 300,
        ease: 'elastic.inOut(2.5, 1)'
      })
      gsap.to(el, {
        duration: 0.2,
        delay: 0.5,
        opacity: 0,
        onComplete: done
      })
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="JavaScript Hooks Transition" slug="68ce1b8c41d0a6e71ff58df80fd85ae5" tab="js,result" :editable="false" />

## 初期描画時のトランジション

ノードの初期描画時にトランジションを適用したい場合は、`appear` 属性を追加することができます:

```html
<transition appear>
  <!-- ... -->
</transition>
```

## 要素間のトランジション

あとで [コンポーネント間のトランジション](#コンポーネント間のトランジション) について説明しますが、`v-if`/`v-else` を使った通常の要素同士でもトランジションできます。最も共通の 2 つの要素のトランジションの例として、リストコンテナとリストが空と説明するメッセージの間で行うものがあります:

```html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```

`v-if`/`v-else-if`/`v-else` を使ったり、ひとつの要素に対して動的プロパティでバインディングを行ういずれの場合でも、複数個の要素を対象にトランジションすることが可能です。例:

<!-- TODO: rewrite example and put in codepen example -->

```html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-else-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-else-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

このようにも書き換えることもできます:

```html
<transition>
  <button :key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

```js
// ...
computed: {
  buttonMessage() {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```

### トランジションモード

まだひとつ問題が残っています。以下のボタンをクリックしてください:

<common-codepen-snippet title="Transition Modes Button Problem" slug="Rwrqzpr" :editable="false" />

それは、"on" ボタンと "off" ボタン間でトランジションを行うとき、片方のボタンがトランジションアウトして、別の片方がトランジションインするとき、両方のボタンが描画されてしまうことです。これは、`<transition>` のデフォルトの振る舞いです - entering と leaving は同時に起きます。

時には、これで問題なく、うまく動作する場合があります。例えば、位置が絶対位置で指定されているアイテムのトランジションを行うような場合です:

<common-codepen-snippet title="Transition Modes Button Problem- positioning" slug="abdQgLr" :editable="false" />

ただ、そうするわけにはいかない場合や、より複雑な in と out の動きの扱いについてコーディネートする必要がある場合に、Vue は非常に便利な **トランジションモード** というユーティリティを提供しています。

- `in-out`: 最初に新しい要素がトランジションして、それが完了したら、現在の要素がトランジションアウトする。
- `out-in`: 最初に現在の要素がトランジションアウトして、それが完了したら、新しい要素がトランジションインする。

::: tip
`out-in` がほとんどの場合に求めているものと感じるはずです。
:::

今から、`out-in` を使って、先程の on/off ボタンのトランジションを書き換えてみましょう:

```html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

<common-codepen-snippet title="Transition Modes Button Problem- solved" slug="ZEQmdvq" :editable="false" />

特別なスタイルの追加無しで、ひとつのシンプルな属性を追加するだけでオリジナルのトランジションを修正できました。

これを利用することによって、以下のようなより表現力のある動きをコーディネートすることができます。2 つの要素がお互いの間でトランジションしていますが、そのお互いの大きさが同じであり、水平方向の 0 の位置で重なるため、1 つの要素の動きの流れに見えます。このような細かな調整は、よりリアルなマイクロインタラクションの表現で役立ちます:

<common-codepen-snippet title="Transition Modes Flip Cards" slug="76e344bf057bd58b5936bba260b787a8" :editable="false" />

## コンポーネント間のトランジション

コンポーネント間のトランジションは、 `key` 属性が必要ではないのでさらに単純です。代わりに、ただ [動的コンポーネント](components.html#動的コンポーネント) でラップするだけです:

```html
<div id="demo">
  <input v-model="view" type="radio" value="v-a" id="a"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component :is="view"></component>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      view: 'v-a'
    }
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
```

<common-codepen-snippet title="Transitioning between components" slug="WNwVxZw" tab="html,result" theme="39028" />
