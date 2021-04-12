---
badges:
  - breaking
---

# Inline Template 属性 <MigrationBadges :badges="$frontmatter.badges" />

## 概要

[inline-template 機能](https://vuejs.org/v2/guide/components-edge-cases.html#Inline-Templates)のサポートは終了しました。

## 2.x での構文

Vue 2.x では子コンポーネントの内部のコンテンツを分散コンテンツではなく、テンプレートとして使うようにするために子コンポーネントに `inline-template` 属性を提供していました。

```html
<my-component inline-template>
  <div>
    <p>これらはコンポーネント自身のテンプレートとしてコンパイルされます。</p>
    <p>親のトランスクルージョンコンテンツではありません。</p>
  </div>
</my-component>
```

## 3.x での構文

この機能はサポートされなくなります。

## 移行の戦略

`inline-template` のユースケースの多くでは、すべてのテンプレートが HTML ページ内に直接書かれるようなビルドツールを使わないセットアップを想定しています。

### オプション #1: `<script>` タグを使う

このような場合の最も簡単な回避策は、`<script>` を代替として使うことです:

```html
<script type="text/html" id="my-comp-template">
  <div>{{ hello }}</div>
</script>
```

そしてコンポーネントの中でセレクタを使ってテンプレートをターゲットにします:

```js
const MyComp = {
  template: '#my-comp-template'
  // ...
}
```

これはビルドセットアップを必要とせず、すべてのブラウザで動作し、DOM 内の HTML 解析に関係する警告対象にならず（例えばキャメルケースのプロパティ名を使えます)、 ほとんどの IDE で適切なシンタックスハイライトを提供します。従来のサーバーサイドのフレームワークでは、これらのテンプレートをサーバーテンプレートのパーシャル（メインの HTML テンプレートに含まれます）に分割して保守性を向上させることができます。

### オプション #2: デフォルトのスロット

前に `inline-template` を使っていたコンポーネントは、デフォルトのスロットを使ってリファクタリングすることもできます。デフォルトのスロットを使うことで子コンテンツをインラインで書く利便性を保ちながらデータスコープをより明確にします:

```html
<!-- 2.x での構文 -->
<my-comp inline-template :msg="parentMsg">
  {{ msg }} {{ childState }}
</my-comp>

<!-- デフォルトのスロットを使うバージョン -->
<my-comp v-slot="{ childState }">
  {{ parentMsg }} {{ childState }}
</my-comp>
```

子ではテンプレートを提供しないかわりにデフォルトの slot\* をレンダリングする必要があります:

```html
<!--
  子テンプレートでは、必要な子のプライベート状態を渡しながら
  デフォルトのスロットをレンダリングします。
-->
<template>
  <slot :childState="childState" />
</template>
```

> - Note: 3.x ではネイティブの [fragments](/guide/migration/fragments) サポートを使うことでスロットをルートとしてレンダリングできます！
