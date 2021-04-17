---
badges:
  - breaking
---

# キーコード修飾子 <MigrationBadges :badges="$frontmatter.badges" />

## 概要

変更点の概要は以下です:

- **破壊的変更**: `v-on` 修飾子にキーコードの数字を利用することはサポートされなくなりました
- **破壊的変更**: `config.keyCodes` の利用はサポートされなくなりました

## 2.x での構文

Vue 2 では、`v-on` メソッドでキーコードを利用することができました。

```html
<!-- キーコードを利用した場合 -->
<input v-on:keyup.13="submit" />

<!-- エイリアスを利用した場合 -->
<input v-on:keyup.enter="submit" />
```

さらに、`config.keyCodes` のグローバルオプションを利用することで、独自のエイリアスを定義できました。

```js
Vue.config.keyCodes = {
  f1: 112
}
```

```html
<!-- キーコードを利用した場合 -->
<input v-on:keyup.112="showHelpText" />

<!-- 独自のエイリアスを利用した場合 -->
<input v-on:keyup.f1="showHelpText" />
```

## 3.x での構文

[`KeyboardEvent.keyCode` は非推奨](https://developer.mozilla.org/ja/docs/Web/API/KeyboardEvent/keyCode) となり、Vue 3 においても引き続きサポートすることはもはや意味がありません。そのため、修飾子に利用したいキーのケバブケース名を利用することが推奨されます。

```html
<!-- Vue 3 の v-on でキー修飾子を利用する場合 -->
<input v-on:keyup.delete="confirmDelete" />
```

`config.keyCodes` の利用も同様の理由で非推奨となり、サポートされなくなりました。

## 移行の戦略

キーコードを利用している場合は、ケバブケースでの命名に変更することを推奨します。
