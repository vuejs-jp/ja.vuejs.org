# 編集可能な SVG アイコンシステム

## 基本的な例

SVG アイコンシステムを作成する方法はいろいろありますが、 Vue の機能を生かした方法として、編集可能なインラインのアイコンをコンポーネントとして作成する方法があります。この方法のいくつかの利点としては:

- 即座に編集することが簡単です
- アニメーションが可能です
- 標準的なプロパティとデフォルトを利用して標準サイズを保つことができ、必要に応じて変更することもできます
- インラインなので HTTP リクエストが不要です
- 動的にアクセスすることが可能です

まず、すべてのアイコンを入れるフォルダを作り、検索しやすいように一定のルールで命名します:

- `components/icons/IconBox.vue`
- `components/icons/IconCalendar.vue`
- `components/icons/IconEnvelope.vue`

ここにセットアップの全体像を見られるサンプルのリポジトリがあります: [https://github.com/sdras/vue-sample-svg-icons/](https://github.com/sdras/vue-sample-svg-icons/)

![Documentation site](/images/editable-svg-icons.jpg 'Docs demo')

スロットを利用した基本となるアイコン（`IconBase.vue`）コンポーネントを作成します。

```html
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
```

アイコンの `viewBox` に応じて `viewBox` を更新する必要があるだけで、この基本となるアイコンをそのまま使うことができます。この基本では、 `width` と `height` と `iconColor` とアイコン名をプロパティにして、プロパティから動的に更新できるようにしています。名前は `<title>` のコンテンツと、アクセシビリティのための `id` の両方に使われます。

スクリプト部分はこのようになります。いくつかのデフォルトがあり、特に指定しない限り、アイコンが一貫してレンダリングされるようにします:

```js
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
```

塗りつぶし色のデフォルト `currentColor` プロパティは、アイコンの周囲のテキスト色を継承します。必要なら、別の色をプロパティとして渡すこともできます。

アイコンのパスを内包する `IconWrite.vue` だけを内容にすると、このように使えます:

```html
<icon-base icon-name="write"><icon-write /></icon-base>
```

さまざまなサイズのアイコンを作りたいとなったら、とても簡単にできます:

```html
<p>
  <!-- より小さい `width` と `height` をプロパティとして渡せます -->
  <icon-base width="12" height="12" icon-name="write"><icon-write /></icon-base>
  <!-- あるいはデフォルトも使えます。デフォルトは 18 です -->
  <icon-base icon-name="write"><icon-write /></icon-base>
  <!-- または少し大きくすることも :) -->
  <icon-base width="30" height="30" icon-name="write"><icon-write /></icon-base>
</p>
```

<img src="/images/editable-svg-icons-sizes.png" width="450" />

## アニメーション可能なアイコン

アイコンをコンポーネントに入れておくと、特にインタラクションによってアニメーションさせたいときにとても便利です。インライン SVG は、いろいろなやり方の中で最もインタラクションをサポートします。これはクリックでアニメーションするアイコンのとても基本的な例です:

```html
<template>
  <svg
    @click="startScissors"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    aria-labelledby="scissors"
    role="presentation"
  >
    <title id="scissors" lang="en">Scissors Animated Icon</title>
    <path id="bk" fill="#fff" d="M0 0h100v100H0z" />
    <g ref="leftscissor">
      <path d="M..." />
      ...
    </g>
    <g ref="rightscissor">
      <path d="M..." />
      ...
    </g>
  </svg>
</template>
```

```js
import { TweenMax, Sine } from 'gsap'

export default {
  methods: {
    startScissors() {
      this.scissorAnim(this.$refs.rightscissor, 30)
      this.scissorAnim(this.$refs.leftscissor, -30)
    },
    scissorAnim(el, rot) {
      TweenMax.to(el, 0.25, {
        rotation: rot,
        repeat: 3,
        yoyo: true,
        svgOrigin: '50 45',
        ease: Sine.easeInOut
      })
    }
  }
}
```

移動する必要のあるパスのグループに `refs` を適用します。また、はさみの両側は連動して動く必要があるので、 `refs` を渡す再利用可能な関数を作成します。 GreenSock を使うとアニメーションのサポートや、ブラウザ間の `transform-origin` の問題を解決することができます。

<common-codepen-snippet title="Editable SVG Icon System: Animated icon" slug="dJRpgY" :preview="false" :editable="false" version="2" theme="0" />

<p style="margin-top:-30px">Pretty easily accomplished! And easy to update on the fly.</p>

他のアニメーションの例は、 [こちらの](https://github.com/sdras/vue-sample-svg-icons/) リポジトリで見ることができます。

## 補足

デザイナーの考えは変わるかもしれません。製品要件は変わります。アイコンシステム全体のロジックを 1 つの基本となるコンポーネントにまとめておけば、すべてのアイコンを素早く更新して、システム全体に広めることができます。アイコンローダーを使っても、場合によってはグローバルな変更を行うために、すべての SVG を再作成または編集しなければなりません。この方法ならば、そのような時間と苦痛からあなたを救うことができます。

## このパターンを回避するケース

このような SVG アイコンシステムは、サイト全体にさまざまな方法で使われているアイコンがたくさんある場合にとても便利です。1 つのページで同じアイコンを繰り返し使うならば（例えば、各行に削除アイコンのある巨大なテーブル）、すべてのスプライトをスプライトシートにコンパイルして `<use>` タグで読み込むほうが合理的でしょう。

## 代替パターン

SVG アイコンを管理するのに役立つ他のツールには、以下のものがあります:

- [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)
- [svgo-loader](https://github.com/rpominov/svgo-loader)

これらのツールはコンパイル時に SVG をバンドルしますが、実行時にそれらを編集することが少し難しくなります。これは `<use>` タグが複雑な処理をする際に、おかしなクロスブラウザの問題を引き起こす可能性があるからです。2 つの入れ子になった `viewBox` プロパティがあるために、2 つの座標系が存在します。このため実装が少し複雑になります。
