---
badges:
  - breaking
---

# VNode ライフサイクルイベント <MigrationBadges :badges="$frontmatter.badges" />

## 概要

Vue 2 では、イベントを使ってコンポーネントのライフサイクルの重要なステージを監視することができました。これらのイベントは、プレフィックスの `hook:` からはじまり、その後にライフサイクルフックの名前がついていました。

Vue 3 では、このプレフィックスが `vnode-` に変更されました。また、これらのイベントは、コンポーネントとしてだけでなく HTML 要素でも利用できるようになりました。

## 2.x での構文

Vue 2 では、イベント名は同等のライフサイクルフックと同じで、プレフィックスに `hook:` がついています:

```html
<template>
  <child-component @hook:updated="onUpdated">
</template>
```

## 3.x での構文

Vue 3 では、イベント名のプレフィックスに `vnode-` がついています:

```html
<template>
  <child-component @vnode-updated="onUpdated">
</template>
```

またはキャメルケース（camelCase）を使用している場合は、単に `vnode` となります:

```html
<template>
  <child-component @vnodeUpdated="onUpdated">
</template>
```

## 移行の戦略

ほとんどの場合、プレフィックスの変更だけで済みます。ライフサイクルフックの `beforeDestroy` と `destroyed` は、それぞれ `beforeUnmount` と `unmounted` に名前が変更され、対応するイベント名も更新する必要があります。

[移行ビルドのフラグ: `INSTANCE_EVENT_HOOKS`](migration-build.html#compat-の設定)

## 参照

- [移行ガイド - イベント API](/guide/migration/events-api.html)
