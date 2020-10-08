# Enter & Leave Transitions

<!-- ここは v2.x と同じ-->

Vue は、DOM からアイテムが追加、更新、削除されたときにトランジション効果を適用するための方法を複数提供しています:

- 自動的に CSS トランジションやアニメーションのためのクラスを適用します。
- [Animate.css](https://animate.style/) のようなサードパーティの CSS アニメーションライブラリと連携します。
- トランジションフックが実行されている間、JavaScript を使って直接 DOM 操作を行います。
- サードパーティの JavaScript アニメーションライブラリと連携します。

On this page, we'll only cover entering, leaving, and list transitions, but you can see the next section for [managing state transitions](transitions-state.html).

## Transitioning Single Elements/Components

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

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="3466d06fb252a53c5bc0a0edb0f1588a" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Simple Transition Component">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/3466d06fb252a53c5bc0a0edb0f1588a">
  Simple Transition Component</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

`transition` コンポーネントにラップされた要素が挿入あるいは削除されるとき、次のことが行われます:

1. Vue は、対象の要素が CSS トランジションあるいはアニメーションが適用されるか自動的に察知します。それがない場合、適切なタイミングで、CSS トランジションのクラスを追加/削除します。

2. もし、トランジションコンポーネントが [JavaScript フック](#JavaScript-フック) を提供している場合は、適切なタイミングでそれらのフックが呼ばれます。

3. もし、CSS トランジション/アニメーションが検出されず、JavaScript フックも提供されない場合、挿入、削除のいずれか、あるいは両方の DOM 操作を次のフレームでただちに実行します。(注意: ここでのフレームはブラウザのアニメーションフレームを指します。 Vue の `nextTick` のコンセプトのそれとは異なるものです)

### Transition Classes

<!-- ここは概ね v2.x と同じ-->

There are six classes applied for enter/leave transitions.

1. `v-enter-from`: Starting state for enter. Added before element is inserted, removed one frame after element is inserted.

2. `v-enter-active`: Active state for enter. Applied during the entire entering phase. Added before element is inserted, removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve for the entering transition.

3. `v-enter-to`: **Only available in versions 2.1.8+.** Ending state for enter. Added one frame after element is inserted (at the same time `v-enter` is removed), removed when transition/animation finishes.

4. `v-leave-from`: Starting state for leave. Added immediately when a leaving transition is triggered, removed after one frame.

5. `v-leave-active`: Active state for leave. Applied during the entire leaving phase. Added immediately when leave transition is triggered, removed when the transition/animation finishes. This class can be used to define the duration, delay and easing curve for the leaving transition.

6. `v-leave-to`: **Only available in versions 2.1.8+.** Ending state for leave. Added one frame after a leaving transition is triggered (at the same time `v-leave` is removed), removed when the transition/animation finishes.

![Transition Diagram](/images/transitions.svg)

Each of these classes will be prefixed with the name of the transition. Here the `v-` prefix is the default when you use a `<transition>` element with no name. If you use `<transition name="my-transition">` for example, then the `v-enter-from` class would instead be `my-transition-enter-from`.

`v-enter-active` and `v-leave-active` give you the ability to specify different easing curves for enter/leave transitions, which you'll see an example of in the following section.

### CSS Transitions

<!-- ここは v2.x と同じ-->

One of the most common transition types uses CSS transitions. Here's an example:

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
/* Enter and leave animations can use different */
/* durations and timing functions.              */
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

<p class="codepen" data-height="300" data-theme-id="39028"  data-preview="true" data-default-tab="css,result" data-user="Vue" data-slug-hash="0dfa7869450ef43d6f7bd99022bc53e2" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Different Enter and Leave Transitions">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/0dfa7869450ef43d6f7bd99022bc53e2">
  Different Enter and Leave Transitions</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### CSS Animations

CSS animations are applied in the same way as CSS transitions, the difference being that `v-enter-from` is not removed immediately after the element is inserted, but on an `animationend` event.

Here's an example, omitting prefixed CSS rules for the sake of brevity:

<!-- div への ID だけ変わっているが対応の必要なし -->

```html
<div id="example-2">
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
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

<p class="codepen" data-height="300" data-theme-id="39028"  data-preview="true" data-default-tab="html,result" data-user="Vue" data-slug-hash="8627c50c5514752acd73d19f5e33a781" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS Animation Transition Example">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/8627c50c5514752acd73d19f5e33a781">
  CSS Animation Transition Example</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Custom Transition Classes

You can also specify custom transition classes by providing the following attributes:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-from-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

These will override the conventional class names. This is especially useful when you want to combine Vue's transition system with an existing CSS animation library, such as [Animate.css](https://daneden.github.io/animate.css/).

Here's an example:

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

### Using Transitions and Animations Together

Vue needs to attach event listeners in order to know when a transition has ended. It can either be `transitionend` or `animationend`, depending on the type of CSS rules applied. If you are only using one or the other, Vue can automatically detect the correct type.

However, in some cases you may want to have both on the same element, for example having a CSS animation triggered by Vue, along with a CSS transition effect on hover. In these cases, you will have to explicitly declare the type you want Vue to care about in a `type` attribute, with a value of either `animation` or `transition`.

### Explicit Transition Durations

TODO: validate and provide an example

> New in 2.2.0+

In most cases, Vue can automatically figure out when the transition has finished. By default, Vue waits for the first `transitionend` or `animationend` event on the root transition element. However, this may not always be desired - for example, we may have a choreographed transition sequence where some nested inner elements have a delayed transition or a longer transition duration than the root transition element.

In such cases you can specify an explicit transition duration (in milliseconds) using the `duration` prop on the `<transition>` component:

```html
<transition :duration="1000">...</transition>
```

You can also specify separate values for enter and leave durations:

```html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### JavaScript Hooks

You can also define JavaScript hooks in attributes:

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
  // the done callback is optional when
  // used in combination with CSS
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
  // the done callback is optional when
  // used in combination with CSS
  leave(el, done) {
    // ...
    done()
  },
  afterLeave(el) {
    // ...
  },
  // leaveCancelled only available with v-show
  leaveCancelled(el) {
    // ...
  }
}
```

These hooks can be used in combination with CSS transitions/animations or on their own.

When using JavaScript-only transitions, **the `done` callbacks are required for the `enter` and `leave` hooks**. Otherwise, the hooks will be called synchronously and the transition will finish immediately. Adding `:css="false"` will also let know Vue to skip CSS detection. Aside from being slightly more performant, this also prevents CSS rules from accidentally interfering with the transition.

Now let's dive into an example. Here's a JavaScript transition using [GreenSock](https://greensock.com/):

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

<p class="codepen" data-height="300" data-theme-id="39028"  data-preview="true" data-default-tab="js,result" data-user="Vue" data-slug-hash="68ce1b8c41d0a6e71ff58df80fd85ae5" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="JavaScript Hooks Transition">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/68ce1b8c41d0a6e71ff58df80fd85ae5">
  JavaScript Hooks Transition</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Transitions on Initial Render

If you also want to apply a transition on the initial render of a node, you can add the `appear` attribute:

```html
<transition appear>
  <!-- ... -->
</transition>
```

## Transitioning Between Elements

We discuss [transitioning between components](#transitioning-between-components) later, but you can also transition between raw elements using `v-if`/`v-else`. One of the most common two-element transitions is between a list container and a message describing an empty list:

```html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```

It's actually possible to transition between any number of elements, either by using multiple `v-if`s or binding a single element to a dynamic property. For example:

TODO: rewrite example and put in codepen example

```html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

Which could also be written as:

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

### Transition Modes

There's still one problem though. Try clicking the button below:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="Rwrqzpr" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transition Modes Button Problem">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/Rwrqzpr">
  Transition Modes Button Problem</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

As it's transitioning between the "on" button and the "off" button, both buttons are rendered - one transitioning out while the other transitions in. This is the default behavior of `<transition>` - entering and leaving happens simultaneously.

Sometimes this works great, like when transitioning items are absolutely positioned on top of each other:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="abdQgLr" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transition Modes Button Problem- positioning">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/abdQgLr">
  Transition Modes Button Problem- positioning</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Sometimes this isn't an option, though, or we're dealing with more complex movement where in and out states need to be coordinated, so Vue offers an extremely useful utility called **transition modes**:

- `in-out`: New element transitions in first, then when complete, the current element transitions out.
- `out-in`: Current element transitions out first, then when complete, the new element transitions in.

::: tip
You'll find very quickly that `out-in` is the state you will want most of the time :)
:::

Now let's update the transition for our on/off buttons with `out-in`:

```html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="ZEQmdvq" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transition Modes Button Problem- solved">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/ZEQmdvq">
  Transition Modes Button Problem- solved</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

With one attribute addition, we've fixed that original transition without having to add any special styling.

We can use this to coordinate more expressive movement, such as a folding card, as demonstrated below. It's actually two elements transitioning between eachother, but since the beginning and end states are scaling the same: horizontally to 0, it appears like one fluid movement. This type of slight-of-hand can be very useful for realistic UI microinteractions:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="76e344bf057bd58b5936bba260b787a8" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transition Modes Flip Cards">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/76e344bf057bd58b5936bba260b787a8">
  Transition Modes Flip Cards</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Transitioning Between Components

Transitioning between components is even simpler - we don't even need the `key` attribute. Instead, we wrap a [dynamic component](component-basics.html#dynamic-components):

TODO: update to Vue 3

```html
<transition name="component-fade" mode="out-in">
  <component :is="view"></component>
</transition>
```

```js
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
```

```css
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

TODO: example
