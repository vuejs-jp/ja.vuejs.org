---
title: トランジションクラスの変更
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概要

`v-enter` トランジションクラスは `v-enter-from` へ、そして `v-leave` トランジションクラスは `v-leave-from` へと名前が変更されました。

## 2.x での構文

v2.1.8 以前では、それぞれのトランジションの方向のために開始状態と活性状態の二つのトランジションクラスを使用していました。

v2.1.8 では `v-enter-to` トランジションクラスを導入して、 enter/leave トランジション間のタイミングのギャップに対応しました。しかし、後方互換性のために `v-enter` という名前はそのままになってしまっています。

```css
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-leave,
.v-enter-to {
  opacity: 1;
}
```

これは _enter_ と _leave_ が広義であり、クラスのフックと同じ命名規則を使っていないため、混乱を招いてしまっています。

## 3.x での更新

より明示的で読みやすいように、これらの開始状態クラスの名前を変更しました。

```css
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-leave-from,
.v-enter-to {
  opacity: 1;
}
```

この変更により状態の変化が何であるかがより明確となります。

![Transition Diagram](/images/transitions.svg)

`<transition>` コンポーネントの関連するプロップ名も変更されます。

- `leave-class` は `leave-from-class` に名前が変更されます。（描画関数や JSX では `leaveFromClass` と書くことができます）
- `enter-class` は `enter-from-class` に名前が変更されます。（描画関数や JSX では `leaveFromClass` と書くことができます）

## 移行の戦略

1. `.v-enter` のインスタンスを `.v-enter-from` に置き換えます。
2. `.v-leave` のインスタンスを `.v-leave-from` に置き換えます。
3. 上記のように、関連するプロップ名のインスタンスを置き換えます。

## 参照

- [`<TransitionGroup>` はデフォルトでラッパー要素をレンダリングしなくなりました](/guide/migration/transition-group.html)
