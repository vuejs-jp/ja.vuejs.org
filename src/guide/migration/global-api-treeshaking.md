---
badges:
  - breaking
---

# グローバル API の Treeshaking <MigrationBadges :badges="$frontmatter.badges" />

## 2.x での構文

手動で DOM 操作を行う必要があった場合に、このようなパターンを目にしたと思います:

```js
import Vue from 'vue'

Vue.nextTick(() => {
  // DOM に関連した処理
})
```

あるいは、[非同期コンポーネント](/guide/component-dynamic-async.html) に関わるアプリケーションのユニットテストを行う場合、次のように書いていたことでしょう:

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // DOM 関連の処理を実行

  await wrapper.vm.$nextTick()

  // アサーションの実行
})
```

`Vue.nextTick()` は、個々の Vue オブジェクトに直接公開されるグローバルな API です - 実際に、インスタンスメソッドである `$nextTick()` は、まさに `Vue.nextTick()` を利便性のため `this` のコンテキストをそのインスタンスに自動的にバインドされたコールバックと共にラップしたものです。

しかし、もし手動で DOM 操作を行う必要がなかったり、アプリケーション内で非同期コンポーネントを扱ったり、テストすることがない時はどうでしょうか？もしくは、どんな理由であれ、代わりに古き良き `window.setTimeout()` を使いたい時は？そのような場合に、`nextTick()` を使うコードはデッドコードになります。 - すなわち、書かれてあっても使われないということです。そして、とりわけファイルサイズが大切になるクライアント側においては、デッドコードは少なくともいいものではありません。

[webpack](https://webpack.js.org/) のようなモジュールバンドラーは、[tree-shaking](https://webpack.js.org/guides/tree-shaking/) と呼ばれる、聞こえの良い "不要コード削除" をサポートします。残念ながら Vue の過去のバージョンではコードの作りに起因して `Vue.nextTick()` のようなグローバル API は tree-shaking 可能ではなく、実際にどこで使われているかそうでないかに関わらず、最終成果物の中に含まれてしまいます。

## 3.x での構文

Vue 3 では、グローバル API と内部 API は tree-shaking のサポートを念頭に置いて作り直されました。その結果、グローバル API は ES Modules ビルドの名前付きエクスポートとしてのみアクセスすることができます。例えば、以前のスニペットは次のようになります:

```js
import { nextTick } from 'vue'

nextTick(() => {
  // DOM に関連した処理
})
```

そして

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'
import { nextTick } from 'vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // DOM 関連の処理を実行

  await nextTick()

  // アサーションの実行
})
```

`Vue.nextTick()` を直接呼び出すと、忌まわしい `undefined is not a function` エラーになるでしょう。

モジュールバンドラーが tree-shaking をサポートしているなら、この変更によって、Vue アプリケーション内で使用されていないグローバル API は最終成果物から削除され、最適なファイルサイズになります。

## 影響を受ける API

この変更により、次の Vue 2.x のグローバル API が影響を受けます:

- `Vue.nextTick`
- `Vue.observable` (`Vue.reactive` に置き換えられます)
- `Vue.version`
- `Vue.compile` (完全ビルドのみ)
- `Vue.set` (互換ビルドのみ)
- `Vue.delete` (互換ビルドのみ)

## 内部ヘルパー

公開 API に加え、多くの内部コンポーネントや内部ヘルパーも同様に、名前付きエクスポートされるようになります。これにより、コンパイラは機能が使われたときにのみインポートするコードを生成できるようになります。例えば、次のテンプレートは:

```html
<transition>
  <div v-show="ok">hello</div>
</transition>
```

次のようなコードにコンパイルされます:

```js
import { h, Transition, withDirectives, vShow } from 'vue'

export function render() {
  return h(Transition, [withDirectives(h('div', 'hello'), [[vShow, this.ok]])])
}
```

これは `Transition` コンポーネントが、実際にアプリケーションで使われた時のみインポートされるということを本質的に意味します。言い換えると、もしアプリケーション内に `<transition>` がない場合は、その機能をサポートするコードは最終成果物の中には存在しなくなります。

グローバルな tree-shaking によって、ユーザは実際に使う機能についてのみ "支払い" ます。更に良いことに、オプションな機能はそれらが使われていないアプリケーションのバンドルサイズを増加させないということは、将来的に追加される機能がどんなものであれ、フレームワークのサイズによる懸念はずっと小さくなります。

::: warning 重要
上記は、tree-shaking が可能な [ES Modules ビルド](/guide/installation.html#explanation-of-different-builds) の利用についてのみ適用されます - 依然として、UMD ビルドはすべての機能を含み、すべてがグローバル Vue 変数上に公開されます(そして、コンパイラはインポートに代えて、グローバルの API を使用して適切な成果物を生成します)
:::

## プラグインでの用途

例えば、もし影響を受ける Vue 2.x のグローバル API にプラグインが依存していた場合:

```js
const plugin = {
  install: Vue => {
    Vue.nextTick(() => {
      // ...
    })
  }
}
```

Vue 3 では、明示的にインポートしなければいけません:

```js
import { nextTick } from 'vue'

const plugin = {
  install: app => {
    nextTick(() => {
      // ...
    })
  }
}
```

webpack のようなモジュールバンドラーを使っている時、プラグインに Vue のソースをバンドルされてしまう可能性があり、これは大抵の場合に望まれた結果ではありません。これを防ぐ一般的な方法は、最終成果物から Vue を除外するようにモジュールバンドラーを設定することです。webpack の場合、 [`externals`](https://webpack.js.org/configuration/externals/) という設定のオプションが利用できます:

```js
// webpack.config.js
module.exports = {
  /*...*/
  externals: {
    vue: 'Vue'
  }
}
```

これは、Vue モジュールを外部ライブラリとして扱い、バンドルしないように webpack に伝えます。

もし選んだバンドラーがたまたま [Rollup](https://rollupjs.org/) であったなら、Rollup はデフォルトで絶対モジュール ID(この場合には `'vue'`)を外部依存として扱い、それらを最終成果物に含めないため、元から設定無しに同じ効果が得られます。バンドル中、 ["Treating vue as external dependency"](https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency) という注意が出ることがありますが、これは `external` オプションで抑制できます:

```js
// rollup.config.js
export default {
  /*...*/
  external: ['vue']
}
```
