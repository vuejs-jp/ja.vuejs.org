---
title: v-if と v-for の優先順位
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概要

- **破壊的変更**: 2 つを同じエレメントで利用している場合、`v-if` は　`v-for` より優先されます。

## イントロダクション

Vue.js で最も一般的に使われているディレクティブの 2 つは `v-if` と `v-for` です。したがって開発者が両方を一緒に使用したいときが来るのは当然のことです。これは推奨される方法ではありませんが、必要な場合があるため、私たちはその仕組みについてのガイダンスを提供したいと思いました。

## 2.x での構文

2.x では、`v-if` と `v-for` を同じエレメントで使うと、`v-for` が優先されます。

## 3.x での構文

3.x では、 `v-if` はいつも `v-for` より優先されます。

## 移行の戦略

構文の曖昧さにより、同じエレメントで両方の使用を避けることをおすすめします。

これをテンプレートレベルで管理するのではなく、これを実現する 1 つの方法は表示されている要素のリストを除外する算出プロパティを作成することです。

[移行ビルドのフラグ: `COMPILER_V_IF_V_FOR_PRECEDENCE`](migration-build.html#compat-の設定)

## 参照

- [リストレンダリング - フィルタ・ソート結果の表示](/guide/list.html#displaying-filtered-sorted-results)
- [リストレンダリング - `v-for` と `v-if`](/guide/list.html#v-for-with-v-if)
