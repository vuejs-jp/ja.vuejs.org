# リストのトランジション

ここまでで、私たちが管理しているトランジションは以下です:

- 個別のノード
- 一度だけレンダリングされる複数のノード

その上で、例えば `v-for` のように、全てをまとめてレンダーしたいリスト全体がある場合はどうしましょうか？このような場合では、 `<transition-group>` コンポーネントを利用します。ですが具体的な例を見る前に、コンポーネントについていくつかの重要なことを知っておく必要があります:

- `<transition>` とは異なり、デフォルトで実際の `<span>` 要素をレンダリングします。レンダリングされる要素は、 `tag` 属性によって変更できます。
- 2つの排他の要素が切り替わっているわけではないため、[Transition モード](/guide/transitions-enterleave#transition-modes) は利用できません。
- 要素の内部では、 **常に** 固有の `key` 属性を **持つ必要** があります。
- CSS トランジションクラスは内部の要素に適用され、グループやコンテナには適用されません。

### リストの Enter/Leave トランジション

早速例に飛び込んでみましょう。以前利用したものと同じ CSS クラスを利用して、 enter/leave を行います:

```html
<div id="list-demo">
  <button @click="add">Add</button>
  <button @click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    randomIndex() {
      return Math.floor(Math.random() * this.items.length)
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove() {
      this.items.splice(this.randomIndex(), 1)
    }
  }
}

Vue.createApp(Demo).mount('#list-demo')
```

```css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
```

<common-codepen-snippet title="Transition List" slug="e1cea580e91d6952eb0ae17bfb7c379d" tab="js,result" :editable="false" :preview="false" />

この例には一つの問題があります。item を追加や削除を行うと、その item の周りのものがスムーズに遷移せず、すぐに移動してしまいます。これは後で修正します。

### List Move Transitions

`<transition-group>` コンポーネントはもう一つの機能を持っています。それは、 enter/leave にだけでなく、位置の変更もアニメーションできることです。この機能を利用するための概念として、要素が位置を変更するときに **`v-move` クラス** が追加されることを知る必要があります。これはその他のクラスと同様、接頭辞はトランジションの `name` 属性と一致しているほか、 `move-class` 属性で手動でクラスを指定できます。

このクラスは、後述のようにトランジションのタイミングや easing カーブを設定する際に便利です。

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"></script>

<div id="flip-list-demo">
  <button @click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  methods: {
    shuffle() {
      this.items = _.shuffle(this.items)
    }
  }
}

Vue.createApp(Demo).mount('#flip-list-demo')
```

```css
.flip-list-move {
  transition: transform 0.8s ease;
}
```

<common-codepen-snippet title="Transition-group example" slug="049211673d3c185fde6b6eceb8baebec" tab="html,result" :editable="false" :preview="false" />

これは魔法のように見えますが、Vue は [FLIP](https://aerotwist.com/blog/flip-your-animations/) と呼ばれるアニメーションのテクニックによって、transform を利用した要素の位置をスムーズに遷移させています。

このテクニックと前の実装を組み合わせることで、リストへの変更をアニメーションさせることができます！

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button @click="shuffle">Shuffle</button>
  <button @click="add">Add</button>
  <button @click="remove">Remove</button>
  <transition-group name="list-complete" tag="p">
    <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    randomIndex() {
      return Math.floor(Math.random() * this.items.length)
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove() {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle() {
      this.items = _.shuffle(this.items)
    }
  }
}

Vue.createApp(Demo).mount('#list-complete-demo')
```

```css
.list-complete-item {
  transition: all 0.8s ease;
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
}
```

<common-codepen-snippet title="Transition-group example" slug="373b4429eb5769ae2e6d097fd954fd08" tab="js,result" :editable="false" :preview="false" />

::: tip
重大な注意点として、これらの FLIP トランジションは、 `display: inline` が設定された要素では動作しません。代わりに、 `display: inline-block` を利用するか、または flex コンテキスト内に要素を配置することとなります。
:::

これらの FLIP アニメーションは、一つの軸の動作に限定されません。多次元のグリッドに対しても、[同様に](https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-list-move-transitions)操作できます:

TODO: example

### 時間差でのリストトランジション

data 属性によって JavaScript によるトランジションと通信することで、時間差でのリストトランジションが可能となります:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js"></script>

<div id="demo">
  <input v-model="query" />
  <transition-group
    name="staggered-fade"
    tag="ul"
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      :key="item.msg"
      :data-index="index"
    >
      {{ item.msg }}
    </li>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      query: '',
      list: [
        { msg: 'Bruce Lee' },
        { msg: 'Jackie Chan' },
        { msg: 'Chuck Norris' },
        { msg: 'Jet Li' },
        { msg: 'Kung Fury' }
      ]
    }
  },
  computed: {
    computedList() {
      var vm = this
      return this.list.filter(item => {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        height: '1.6em',
        delay: el.dataset.index * 0.15,
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        opacity: 0,
        height: 0,
        delay: el.dataset.index * 0.15,
        onComplete: done
      })
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Staggered Lists" slug="c2fc5107bd3025ceadea049b3ee44ec0" tab="js,result" :editable="false" :preview="false" />

## 再利用可能なトランジション

トランジション群は、 Vue のコンポーネントシステムによって再利用できます。再利用可能なトランジションを作るためには、コンポーネントのルートに `<transition>` または `<transition-group>` を配置し、その children をトランジションコンポーネントへと渡すだけです。

TODO: refactor to Vue 3

これらは、template コンポーネントを利用した例です:

```js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      @before-enter="beforeEnter"\
      @after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\
  ',
  methods: {
    beforeEnter(el) {
      // ...
    },
    afterEnter(el) {
      // ...
    }
  }
})
```

そして[関数型コンポーネント](render-function.html#Functional-Components)は、このようなタスクに時に適しています:

```js
Vue.component('my-special-transition', {
  functional: true,
  render: function(createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition',
        mode: 'out-in'
      },
      on: {
        beforeEnter(el) {
          // ...
        },
        afterEnter(el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

## 動的なトランジション

そうです！Vue では、トランジションの設定さえもデータ駆動となります。動的なトランジション設定の最も基本的な例は、 `name` 属性を動的なプロパティに紐付けるものです。

```html
<transition :name="transitionName">
  <!-- ... -->
</transition>
```

これは Vue のトランジションクラスの規約によって、 CSS トランジション/アニメーションを定義し、切り替えたい場合に便利です。

そしてこれは本当にあらゆるトランジション属性を動的に紐付けることができ、その対象は属性だけではありません。イベントフックはメソッドであるため、コンテキストにおけるあらゆるデータへとアクセスすることができます。それはコンポーネントの状態に依存して、 JavaScript トランジションが異なる挙動する可能性があるということです。

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Fade In:
  <input type="range" v-model="fadeInDuration" min="0" :max="maxFadeDuration" />
  Fade Out:
  <input
    type="range"
    v-model="fadeOutDuration"
    min="0"
    :max="maxFadeDuration"
  />
  <transition
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <p v-if="show">hello</p>
  </transition>
  <button v-if="stop" @click="stop = false; show = false">
    Start animating
  </button>
  <button v-else @click="stop = true">Stop it!</button>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      show: true,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,
      maxFadeDuration: 1500,
      stop: true
    }
  },
  mounted() {
    this.show = false
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
    },
    enter(el, done) {
      var vm = this
      Velocity(
        el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function() {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave(el, done) {
      var vm = this
      Velocity(
        el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function() {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})

app.mount('#dynamic-fade-demo')
```

TODO: example

最後に、究極的には、プロップを受け付けるコンポーネントを利用し、性質を変化させる、動的なトランジションを実現することができます。安っぽい表現に聞こえるかもしれませんが、限界はあなたの想像力次第です。
