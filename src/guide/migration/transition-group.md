---
title: トランジショングループのルート要素
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概要

`<transition-group>` は、デフォルトではルート要素をレンダリングしなくなりましたが、 `tag` 属性でルート要素を作成することができます。

## 2.x での構文

Vue 2 では、 `<transition-group>` は他のカスタムコンポーネントと同様に、ルート要素を必要として、デフォルトでは `<span>` となっており `tag` 属性を通してカスタマイズできました。

```html
<transition-group tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</transition-group>
```

## 3.x での構文

Vue 3 では [Fragments](/guide/migration/fragments.html) があるので、コンポーネントにはルート要素が _必要なくなりました_ 。そのため、 `<transition-group>` はデフォルトではルート要素をレンダリングしなくなりました。

- 上の例のように、 `tag` 属性が Vue 2 のコードですでに定義されている場合、すべてが以前のように動作します
- もし定義されていなくて、スタイルやその他の動作が `<span>` ルート要素の存在に依存していた場合は、 `<transition-group>` に `tag="span"` を追加するだけです

```html
<transition-group tag="span">
  <!-- -->
</transition-group>
```

## 移行の戦略

[移行ビルドのフラグ: `TRANSITION_GROUP_ROOT`](migration-build.html#compat-の設定)

## 参照

- [トランジションクラスの変更](/guide/migration/transition.html)
- [ルートの `<Transition>` は外部からトグルできなくなりました](/guide/migration/transition-as-root.html)
