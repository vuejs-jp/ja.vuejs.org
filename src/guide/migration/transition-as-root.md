---
badges:
  - breaking
---

# ルートとしてのトランジション <MigrationBadges :badges="$frontmatter.badges" />

## 概要

コンポーネントのルートに `<transition>` を使うとき、外部からコンポーネントがトグルされても、トランジションをトリガーしなくなりました。

## 2.x での挙動

Vue 2 では、コンポーネントのルートに `<transition>` を使うことで、コンポーネントの外部からトランジションをトリガーすることができました:

```html
<!-- modal component -->
<template>
  <transition>
    <div class="modal"><slot/></div>
  </transition>
</template>
```

```html
<!-- usage -->
<modal v-if="showModal">hello</modal>
```

`showModal` の値をトグルすると、モーダルコンポーネントの内部でトランジションをトリガーしました。

これは設計にはなく、偶然に動きました。`<transition>` は `<transition>` 自身をトグルするのではなく、その子の変更によってトリガーされるようになっています。

この癖は現在では取り除かれています。

## 移行の戦略

似たような効果は、代わりにコンポーネントにプロパティを渡すことでも得られます:

```vue
<template>
  <transition>
    <div v-if="show" class="modal"><slot/></div>
  </transition>
</template>
<script>
export default {
  props: ['show']
}
</script>
```

```html
<!-- usage -->
<modal :show="showModal">hello</modal>
```

## 参照

- [トランジションクラスの変更](/guide/migration/transition.html)
- [`<TransitionGroup>` はデフォルトでラッパー要素をレンダリングしなくなりました](/guide/migration/transition-group.html)
