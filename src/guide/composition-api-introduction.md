# はじめに

## なぜ Composition API なのか？

::: tip Note
ドキュメントでここまで到達しているならば、[Vue の基本](introduction.md)と[コンポーネントの作成](component-basics.md)の両方にすでに精通しているはずです。
:::

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-essentials/why-the-composition-api" title="Vue Mastery で Composition API の仕組みを深く学ぶ">Vue Mastery の Composition API に関する無料ビデオを視聴する</VideoLesson>

Vue コンポーネントを作成するとその機能と結合されたインターフェースの繰り返し可能な部分を再利用可能なコードとして抽出することができます。これだけでも保守性と柔軟性の点でアプリケーションをかなり良くすることができます。しかし、蓄積された経験から、特にアプリケーションが非常に大規模な場合は、これだけでは不十分であることがわかっています。数百のコンポーネントがある場合を想像してみてください。そのような大規模なアプリケーションを扱う場合は、コードを共通化して再利用することが非常に重要になります。

このアプリには、特定のユーザーのリポジトリのリストを表示するビューがあると想像してみましょう。さらに、検索と絞り込みの機能を実装したいとします。このビューを処理するコンポーネントは次のようになります:

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // `this.user` を使用してユーザーのリポジトリを取得します
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

このコンポーネントには複数の責務が存在します:

1. 適当な外部 API からユーザー名に対応したリポジトリを取得して、ユーザーが変化するたびにそれを更新する
2. `searchQuery` 文字列を使用してリポジトリを検索する
3. `filters` オブジェクトを使用してリポジトリを絞り込む

コンポーネントのオプション (`data`, `computed`, `methods`, `watch`) でまとめたロジックはたいていの場合は正しく動作します。しかし、コンポーネントがより大きくなれば、**論理的な関心事**のリストもまた大きくなります。これは、特に最初からコンポーネントを書いていない人々にとって、コンポーネントを読みづらく、理解しづらいものにするかもしれません。

![Vue Options API: オプションの種類によってグループ分けされたコード](/images/options-api.png)

**論理的な関心事** が色でグループ化されている大きなコンポーネントを示す例。

このような分離は、複雑なコンポーネントを理解してメンテナンスすることを難しくします。このオプションの分離は背景にある論理的な関心事をわかりづらくします。さらに、単一の論理的な関心事に取り組む場合、関連するコードのオプションブロックを何度も "ジャンプ" する必要があります。

同じ論理的な関心事に関連するコードを並べることができれば、より良くなるでしょう。そして、これはまさに Composition API が可能にします。

## Composition API の基本

さて、**なぜ** がわかったところで **どのように** するのか取りかかりましょう。Composition API の使用を開始するには、はじめに実際に使用できる場所が必要です。Vue コンポーネントでは、この場所を `setup` と呼びます。

### `setup` コンポーネントオプション

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-essentials/setup-and-reactive-references" title="Vue Mastery で setup がどのように動作するのか学ぶ">Vue Mastery で setup に関する無料ビデオを視聴する</VideoLesson>

新しい `setup` コンポーネントオプションは、コンポーネントが作成される前に `props` が解決されると実行され、 Composition API のエントリポイントとして機能します。

::: warning
コンポーネントのインスタンスを参照しないため、`setup` の中で `this` を使うのは避けるべきです。`setup` は `data` プロパティ、`computed` プロパティ、`methods` が解決される前に呼び出されるため、`setup` の中では利用できません。
:::

`setup` オプションは `props` と[後で](composition-api-setup.html#引数)紹介する `context` を受け付ける関数であるべきです。さらに、`setup` から返される全てのものは、コンポーネントの残りの要素 (computed プロパティ、methods、ライフサイクルフックなど) およびコンポーネントの template に公開されます。

`setup` をコンポーネントに追加しましょう:

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    console.log(props) // { user: '' }

    return {} // ここで返されるものはコンポーネントの他のオプションで使用可能です
  }
  // 以降、コンポーネントの"他"のオプション
}
```

それでは、最初の論理的な関心事 (元のスニペットで "1" とマークされている) を抽出することから始めましょう。

> 1. 適当な外部 API からユーザー名に対応したリポジトリを取得して、ユーザーが変化するたびにそれを更新する

最も明らかな部分から始めましょう:

- リポジトリのリスト
- リポジトリのリストを更新する関数
- リストと関数を返して、他のコンポーネントのオプションから利用できるようにすること

```js
// src/components/UserRepositories.vue `setup` 関数
import { fetchUserRepositories } from '@/api/repositories'

// コンポーネント内部
setup (props) {
  let repositories = []
  const getUserRepositories = async () => {
    repositories = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories // 返される関数は methods と同様の振る舞いをします
  }
}
```

これが出発点ですが、`repositories` 変数がリアクティブではないのでまだ正しく動作しません。これはユーザーの観点からは、リポジトリのリストは空のままになっていることを意味します。これを直しましょう！

### `ref` によるリアクティブな変数

Vue 3.0 では、このように新しい `ref` 関数にとってあらゆる変数をリアクティブにすることができます:

```js
import { ref } from 'vue'

const counter = ref(0)
```

`ref` は引数を受け取って、それを `value` プロパティを持つオブジェクトでラップして返します。これを利用して、リアクティブな変数の値にアクセスしたり、変更したりします。

```js
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

オブジェクト内で値をラップすることは不要に思うかもしれませんが、JavaScript の異なるデータ型の間で動作を統一するために必要です。JavaScript において `Number` や `String` のようなプリミティブな型は参照ではなく、値によって渡されるからです:

![参照渡し vs 値渡し](https://blog.penjee.com/wp-content/uploads/2015/02/pass-by-reference-vs-pass-by-value-animation.gif)

どんな値でもラッパーオブジェクトを持つことで、途中でリアクティブでなくなることがなく、アプリ全体に安全に渡すことができます。

::: tip Note
言い換えれば、`ref` は値への**リアクティブな参照**を作成します。 **参照**を操作するという概念は Composition API 全体で頻繁に使用されます。
:::

例に戻って、リアクティブな `repositories` 変数を作成しましょう:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

// コンポーネント内部
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories
  }
}
```

完了です！これで `getUserRepositories` を呼ぶ出すたびに、`repositories` が更新され、変更を反映するようにビューが更新されます。コンポーネントは次のようになります:

```js
// src/components/UserRepositories.vue
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const repositories = ref([])
    const getUserRepositories = async () => {
      repositories.value = await fetchUserRepositories(props.user)
    }

    return {
      repositories,
      getUserRepositories
    }
  },
  data () {
    return {
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

最初の論理的な関心事のいくつかを `setup` メソッドに移動し、お互いにうまく近づけました。残りは `mounted` フックで `getUserRepositories` を呼び出し、`user` プロパティが変更されるたびに、それを実行するようにウォッチャを設定することです。

ライフサイクルフックから始めます。

### ライフサイクルフックを `setup` の中に登録する

Options API に比べて Composition API の機能を完全にするには、ライフサイクルフックを `setup` の中に登録する必要があります。これは Vue から提供されるいくつかの新しい関数のおかげで可能になりました。 Composition API におけるライフサイクルフックは Options API と同様の名称ですが、`on` というプレフィックスが付いています。例: `mounted` は `onMounted` のようになっています。

それらの関数はコンポーネントによってフックが呼び出されるときに実行されるコールバックを受け付けます。

では、`setup` 関数にそれを追加してみましょう:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// コンポーネント内部
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // `mounted` が `getUserRepositories` を呼び出します

  return {
    repositories,
    getUserRepositories
  }
}
```

これで `user` プロパティへの変更に反応する必要があります。そのために、スタンドアロンの `watch` 関数を使用します。

### `watch` で変化に反応する

コンポーネント内の `user` プロパティに `watch` オプションを使用してウォッチャを追加するのと同じように、Vue からインポートした `watch` 関数を使用することができます。それは以下の 3 つの引数を受け付けます:

- **リアクティブな参照**または監視するゲッター関数
- コールバック
- 任意の設定オプション

**その仕組みをざっと見てみましょう。**

```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})
```

`counter.value = 5` のように `counter` が更新されたときは、ウォッチはコールバック (第 2 引数) をトリガーして実行します。この場合は、コンソールに `'The new counter value is: 5'` を出力します。

**以下は Options API と同様です:**

```js
export default {
  data() {
    return {
      counter: 0
    }
  },
  watch: {
    counter(newValue, oldValue) {
      console.log('The new counter value is: ' + this.counter)
    }
  }
}
```

`watch` についての詳細は、[詳細ガイド](reactivity-computed-watchers.md#watch) を参照してください。

**例に適用しましょう:**

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// コンポーネント内部
setup (props) {
  // `props` の `user` プロパティへのリアクティブな参照を作成するために `toRefs` を使用します
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // リアクティブな値にアクセスするために `props.user` を `user.value` に更新します
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // ユーザープロパティへのリアクティブな参照のウォッチャをセットします
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

おそらく `setup` の先頭で `toRefs` が使われていることにお気づきでしょう。これはウォッチャが `user` プロパティに加えられた変更に確実に反応するためです。

これらの変更が行われたので、最初の論理的な関心事全体を 1 つの場所に移動しました。これで、2 番目の懸念事項である `searchQuery` に基づいた絞り込みでも同じことができます。今回は computed プロパティを使用します。

### スタンドアロンな `computed` プロパティ

`ref` や `watch` に似て、computed プロパティもまた Vue からインポートされた `computed` 関数を使用して Vue コンポーネントの外部でも作成することができます。カウンターの例に戻りましょう:

```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2
```

ここで、`computed` 関数は `computed` の第 1 引数として渡されたゲッターのようなコールバックの出力として*読み取り専用*の**リアクティブな参照**を返します。新しく作成され算出された変数の**値**にアクセスするためには、`ref` と同様に `.value` プロパティを使う必要があります。

検索機能を `setup` に移動させましょう:

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

// コンポーネント内部
setup (props) {
  // props の `user` プロパティへのリアクティブな参照を作成するために `toRefs` を使用します
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // リアクティブな値にアクセスするために `props.user` を `user.value` に更新します
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // ユーザープロパティへのリアクティブな参照のウォッチャをセットします
  watch(user, getUserRepositories)

  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(
      repository => repository.name.includes(searchQuery.value)
    )
  })

  return {
    repositories,
    getUserRepositories,
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

他の**論理的な関心事**にも同じことができますが、既に疑問があるかもしれません。- _これはコードを `setup` オプションに移動させて肥大させるだけではありませんか？_ そのため他の責務に移る前に、まず上記のコードをスタンドアロンな**Composition 関数**に抽出します。 `useUserRepositories` の作成から始めましょう:

```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

それから検索機能も:

```js
// src/composables/useRepositoryNameSearch.js

import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

**これらの 2 つの機能が別々のファイルにあるので、コンポーネントでそれらを使い始められます。これを行う方法は次の通りです:**

```js
// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // 絞り込まれていないリポジトリはあまり考慮しないので、
      // 絞り込んだ結果を `repositories` という名前で返して良いでしょう
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}
```

この時点でおそらくあなたは既にノウハウを知っているので、最後まで飛ばして、残りの絞り込み機能を移行しましょう。このガイドの目的ではないため、実装の詳細には立ち入りません。

```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // 絞り込まれていないリポジトリはあまり考慮しないので、
      // 絞り込んだ結果を `repositories` という名前で返して良いでしょう
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  },
}
```

これで完了です！

Composition API の表面とできることについてほんの少し触れただけであることを覚えておいてください。より詳しく知りたい場合は、詳細ガイドを参照してください。
