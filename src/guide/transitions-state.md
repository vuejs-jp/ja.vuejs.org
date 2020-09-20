# 状態のトランジション

Vue のトランジションシステムは entering、leaving、およびリストをアニメーションさせるための多くの単純な方法を提供しますが、あなたのデータ自体をアニメーションさせる場合はどうでしょうか？例えば:

- 数値と計算
- 表示される色
- SVG ノードの位置
- 要素のサイズやその他のプロパティ

これらはすべて、生の数値として保持されているか、あるいは数値に変換することが可能です。一度それをすれば、Vue のリアクティブな性質とコンポーネントシステムの組み合わせにより、状態から中間フレームを生成するためのサードパーティのライブラリを使ってアニメーションさせることができます。

## ウォッチャによる状態のアニメーション

ウォッチャは、任意の数値プロパティの変化によって他のプロパティをアニメーションさせることができるようにします。それは理論的には複雑に聞こえるかもしれませんが、[GreenSock](https://greensock.com/) を使った例に没頭してみましょう:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>

<div id="animated-number-demo">
  <input v-model.number="number" type="number" step="20" />
  <p>{{ animatedNumber }}</p>
</div>
```

```js
const Demo = {
  data() {
    return {
      number: 0,
      tweenedNumber: 0
    }
  },
  computed: {
    animatedNumber() {
      return this.tweenedNumber.toFixed(0)
    }
  },
  watch: {
    number(newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue })
    }
  }
}

Vue.createApp(Demo).mount('#animated-number-demo')
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="22903bc3b53eb5b7817378ecb985ce96" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transitioning State 1">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/22903bc3b53eb5b7817378ecb985ce96">
  Transitioning State 1</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

数値を更新すると、その変更が入力の下でアニメーションします。

## 動的な状態のトランジション

Vue のトランジションコンポーネントを使う場合と同様に、状態のトランジションの背後にあるデータはリタルタイムに更新でき、これは特にプロトタイピングにおいて便利です！単純な SVG のポリゴンに使用して、変数で少し遊ぶだけで、それまで思い付くのが難しかった多くの効果を得られます。

<p class="codepen" data-height="500" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="a8e00648d4df6baa1b19fb6c31c8d17e" data-preview="true" style="height: 493px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Updating SVG">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/a8e00648d4df6baa1b19fb6c31c8d17e">
  Updating SVG</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## コンポーネント内のトランジションの整理

多くの状態のトランジションを管理することで、コンポーネントの複雑さが急速に高まります。幸いにも、多くのアニメーションは専用の子コンポーネントに抽出できます。前の例のアニメーションする数値でこれをやってみましょう:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>

<div id="app">
  <input v-model.number="firstNumber" type="number" step="20" /> +
  <input v-model.number="secondNumber" type="number" step="20" /> = {{ result }}
  <p>
    <animated-integer :value="firstNumber"></animated-integer> +
    <animated-integer :value="secondNumber"></animated-integer> =
    <animated-integer :value="result"></animated-integer>
  </p>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      firstNumber: 20,
      secondNumber: 40
    }
  },
  computed: {
    result() {
      return this.firstNumber + this.secondNumber
    }
  }
})

app.component('animated-integer', {
  template: '<span>{{ fullValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tweeningValue: 0
    }
  },
  computed: {
    fullValue() {
      return Math.floor(this.tweeningValue)
    }
  },
  methods: {
    tween(newValue, oldValue) {
      gsap.to(this.$data, {
        duration: 0.5,
        tweeningValue: newValue,
        ease: 'sine'
      })
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.tween(newValue, oldValue)
    }
  },
  mounted() {
    this.tween(this.value, 0)
  }
})

app.mount('#app')
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="e9ef8ac7e32e0d0337e03d20949b4d17" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="State Transition Components">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/e9ef8ac7e32e0d0337e03d20949b4d17">
  State Transition Components</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

これらの子コンポーネントを使用した複数の状態を構成することができるようになりました。Vue の [組み込みのトランジションシステム](transitions.html) によるものと同時に、このページで取り扱ったあらゆるトランジション戦略の組み合わせを利用できます。同時に、達成できることにはごくわずかの制限があります。

データの可視化、物理効果、キャラクターのアニメーションやインタラクションにどのように使用できるのかが分かるでしょう。可能性は無限大です。

## デザインに命を吹き込む

1つの定義によってアニメーションすること、それは命を吹き込むことを意味します。残念なことに、デザイナーがアイコン、ロゴ、そしてマスコットを作成するとき、それらは一般的に画像や静的 SVG として配布されます。そのため GitHub のオクトキャットや Twitter の青い鳥、そして多くのその他ロゴは生き物に似ていますが、本当に生きているようには見えません。

Vue はそれを手助けできます。 SVG は単なるデータなので、これらの生き物が興奮したり、考えたり、または驚いたりしたときにどう見えるかの例が必要なだけです。そして Vue はこれらの状態間のトランジションを支援して、あなたのウェルカムページ、ローディングインジケータ、そして通知をより感情的で魅力的にします。

Sarah Drasner は以下のデモでタイマーとインタラクティブ駆動での状態変更の組合せを用いてこれを示しています:

<p data-height="400" data-theme-id="light" data-slug-hash="YZBGNp" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Vue-controlled Wall-E" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/YZBGNp/">Vue-controlled Wall-E</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
