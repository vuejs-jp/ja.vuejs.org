---
title:  v-forのref配列
badges:
- breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

Vue 2 では、`v-for` の中で `ref` 属性を記述すると、対応する `$refs` プロパティに参照の配列を入れます。この動作は、入れ子になった `v-for` がある場合、曖昧で非効率的になります。

Vue 3 では、この記述では `$refs` に配列が作成されなくなりました。1 つのバインディングから複数の参照を取得するには、関数に `ref` をバインドします (これは新機能です)。

```html
<div v-for="item in list" :ref="setItemRef"></div>
```

オプション API を使う場合

```js
export default {
  data() {
    return {
      itemRefs: []
    }
  },
  methods: {
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el)
      }
    }
  },
  beforeUpdate() {
    this.itemRefs = []
  },
  updated() {
    console.log(this.itemRefs)
  }
}
```

コンポジション API を使う場合

```js
import { onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      if (el) {
        itemRefs.push(el)
      }
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      setItemRef
    }
  }
}
```

注意点

- `itemRefs` は配列である必要はありません。 反復キーで参照できるオブジェクトでも構いません。

- これにより、必要に応じて `itemRefs` をリアクティブにして監視することもできます。