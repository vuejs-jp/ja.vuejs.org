# 概要

Vue は何らかの変化に応じてトランジションやアニメーションを付けるのに役立つ、いくつかの抽象化を提供します。これらの抽象化には、次のものが含まれます:

- 組み込みコンポーネントの `<transition>` を使用して、CSS と JS の両方で DOM に出入りするコンポーネントをフックします。
- トランジションの途中の順序を調整できるようにトランジションモードがあります。
- `<transition-group>` コンポーネントを使用すると、パフォーマンス向上のために内部で FLIP 手法が適用され、複数の要素が所定の位置で更新された時にフックします。
- アプリケーション内をさまざまな状態へ遷移するには `watchers` を使用します。

このガイドの次の 3 つのセクションでは、上記のことについてすべて説明します。ただし、提供する便利な API とは別に、前セクションで説明したクラスとスタイルの宣言を使用して、アニメーションやトランジションを適用し、より単純なユースケースにすることもできます。

この次のセクションでは、いくつかの Web アニメーションとトランジションの基本について説明し、さらに詳しく調べるためにいくつかのリソースにリンクします。Web アニメーションとそれらの原則が Vue のディレクティブの一部でどのように機能するか既に理解している場合、次のセクションをスキップしてください。Web アニメーションの基本についてもう少し学びたい人は、次のセクションを読んでください。

## クラスベースのアニメーションとトランジション

`<transition>` コンポーネントはコンポーネントを出入りさせるのに最適ですが、条件付きクラスを追加することでコンポーネントをマウントせずにアニメーションをアクティブ化することもできます。

```html
<div id="demo">
  Push this button to do something you shouldn't be doing:<br />

  <div :class="{ shake: noActivated }">
    <button @click="noActivated = true">Click me</button>
    <span v-if="noActivated">Oh no!</span>
  </div>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```

```js
const Demo = {
  data() {
    return {
      noActivated: false
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Create animation with a class" slug="ff45b91caf7a98c8c9077ad8ab539260" tab="css,result" :editable="false" :preview="false" />

## スタイルバインディングによるトランジション

一部のトランジションによる効果は補間値を適用できます。たとえば、トランジションの発生中に要素にスタイルをバインドすることによって適用できます。例を見てみましょう:

```html
<div id="demo">
  <div
    @mousemove="xCoordinate"
    :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
    class="movearea"
  >
    <h3>Move your mouse across the screen...</h3>
    <p>x: {{x}}</p>
  </div>
</div>
```

```css
.movearea {
  transition: 0.2s background-color ease;
}
```

```js
const Demo = {
  data() {
    return {
      x: 0
    }
  },
  methods: {
    xCoordinate(e) {
      this.x = e.clientX
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Interpolation with style bindings" slug="JjGezQY" :editable="false" />

この例では、マウスの動きに付随してアニメーションを作成しています。CSS トランジションは要素にも適用され、更新中にどのような操作か要素に通知します。

## パフォーマンス

上記のアニメーションは `transforms` のようなものを使用しています。そして、`perspective` のような奇妙なプロパティを適用していることに気付くかもしれません。なぜそれらは単に `margin` や `top` などを使用するのではなく、そのように構築されたのでしょう？

パフォーマンスを意識することで、Web 上で非常にスムーズなアニメーションを作成できます。 私たちは可能な限り要素をハードウェアで高速化し、再描画をトリガーしないプロパティを使用したいと考えています。これを実現する方法をいくつか見ていきましょう。

### 変形と不透明度

[CSS-Triggers](https://csstriggers.com/) などのリソースをチェックして、アニメーション化した場合にどのプロパティが再描画をトリガーするか確認できます。ここで `transform` の項目を見ると:

> `transform` を変更してもジオメトリの変更や描画はトリガーされません。これは非常に優れています。これは GPU を使用して `compositor thread` で操作を実行できる可能性が高いことを意味します。

不透明度も同様に動作します。従って、それらは Web 上でのアニメーションに理想的な候補です。

### ハードウェアアクセラレーション

`perspective` , `backface-visibility` , `transform：translateZ（x）` などのプロパティにより、ブラウザはハードウェアアクセラレーションが必要であることを認識します。

要素をハードウェアで高速化したい場合、これらのプロパティのいずれかに適用できます（すべてに必要なわけではなく、1 つだけ）:

```css
perspective: 1000px;
backface-visibility: hidden;
transform: translateZ(0);
```

GreenSock のような多くの JS ライブラリは、ハードウェアアクセラレーションが必要になることを想定してデフォルトで適用するため、手動で設定する必要はありません。

## タイミング

単純な UI トランジション、つまり中間を持たないとある状態から別の状態へのトランジションでは、0.1 秒から 0.4 秒の間のタイミングを使用するのが一般的であり、ほとんどの人は _0.25秒_ がスイートスポットになる傾向があることに気付きます。そのタイミングをすべてに使用できますか？　いいえ、そうではありません。より長い距離を移動する必要があるもの、またはより多くのステップや状態変化があるものの場合、0.25 秒ではうまく機能せず、タイミングはより意図的に、よりユニークである必要があります。ただし、これはアプリケーション内で適切な既定値を設定できないという意味ではありません。

また、トランジションの序盤は終盤よりも少し時間がかかると見栄えが良くなります。ユーザは通常、序盤でガイドを受け途中で離脱したいので終盤での忍耐力が少なくなります。

## イージング

イージングはアニメーションの深みを伝える重要な方法です。 アニメーションの初心者がおかす最も一般的な間違いの 1 つは、序盤に `ease-in` を使用し、終盤に `ease-out` を使用することです。実際には反対のことが必要です。

この状態遷移を適用すると、次のようになります:

```css
.button {
  background: #1b8f5a;
  /* applied to the initial state, so this transition will be applied to the return state */
  transition: background 0.25s ease-in;
}

.button:hover {
  background: #3eaf7c;
  /* applied to the hover state, so this transition will be applied when a hover is triggered */
  transition: background 0.35s ease-out;
}
```

<common-codepen-snippet title="Transition Ease Example" slug="996a9665131e7902327d350ca8a655ac" tab="css,result" :editable="false" :preview="false" />

イージングはアニメーション化されている素材の品質を伝えることもできます。この CodePen を例にとると、どちらのボールが硬く、どちらのボールが柔らかいと思いますか？

<common-codepen-snippet title="Bouncing Ball Demo" slug="wvgqyyW" :height="500" :editable="false" />

イージングを調整することで多くのユニークな効果を得ることができ、アニメーションを非常にスタイリッシュにすることができます。CSS を使用すると、3 次のベジェ曲線のプロパティを調整して変形できます。Lea Verou 氏によって作成された [Playground](https://cubic-bezier.com/#.17,.67,.83,.67) は、イージングを探索するのに非常に役立ちます。

3 次のベジェ曲線が提供する 2 つのハンドルを使用すると単純なアニメーションで優れた効果を実現できますが、JavaScript では複数のハンドルを使用できるため、より多くのバリエーションが可能になります。

![Ease Comparison](/images/css-vs-js-ease.svg)

たとえば、バウンスさせる場合、CSS では各キーフレームを上下に宣言する必要があります。JavaScript では [GreenSock API (GSAP)](https://greensock.com/) で `bounce` を宣言することで、そのすべての動きを簡単に表現できます（他の JS ライブラリには他の種類のイージングの既定値があります）

CSS でバウンスに使用されるコードは次の通りです（animate.css の例）:

```css
@keyframes bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0) scaleY(3);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0) scaleY(0.9);
  }

  75% {
    transform: translate3d(0, -10px, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, 5px, 0) scaleY(0.985);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.bounceInDown {
  animation-name: bounceInDown;
}
```

そして、これが GreenSock を使用した JS での同じバウンスです:

```js
gsap.from(element, { duration: 1, ease: 'bounce.out', y: -500 })
```

次のセクションのいくつかの例では、GreenSock を使用します。GreenSock が持つ [ease visualizer](https://greensock.com/ease-visualizer) は、あなたがより良いイージングを構築するのに役立つでしょう。

## 参考文献

- [Designing Interface Animation: Improving the User Experience Through Animation by Val Head](https://www.amazon.com/dp/B01J4NKSZA/)
- [Animation at Work by Rachel Nabors](https://abookapart.com/products/animation-at-work)
