# Provide / Inject

> このページは、すでに [Provide / Inject](component-provide-inject.html)、[Composition API 導入](composition-api-introduction.html)、[リアクティブの基礎](reactivity-fundamentals.html)を読み終えていることを想定しています。

[provide / inject](component-provide-inject.html) は Composition API でも使うことができます。どちらも現在アクティブなインスタンスの [`setup()`](composition-api-setup.html) 中にのみ呼び出すことが可能です。

## シナリオの背景

これから、Composition API を使用して、以下のコードを書き直そうとしているとしましょう。以下のコードでは、`MyMap` コンポーネントが `MyMarker` コンポーネントにユーザの位置情報を提供しています。

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  provide: {
    location: 'North Pole',
    geolocation: {
      longitude: 90,
      latitude: 135
    }
  }
}
</script>
```

```vue
<!-- src/components/MyMarker.vue -->
<script>
export default {
  inject: ['location', 'geolocation']
}
</script>
```

## Provide の使い方

`provide` を `setup()` 内で使う場合、始めに `vue` から明示的に `provide` をインポートします。これにより、 各プロパティについて `provide` の呼び出しで定義することができるようになります。

`provide` 関数は2つの引数によってプロパティを定義できます:

1. プロパティの名前 (`<String>` 型)
2. プロパティの値

`MyMap` コンポーネントは、以下のようにリファクタリングすることができます:

```vue{7,14-20}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    provide('location', 'North Pole')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    })
  }
}
</script>
```

## Inject の使い方

`inject` を `setup()` 内で使う場合も、`vue` から明示的に `inject` をインポートする必要があります。そうしておけば、これを呼び出すことで、注入された値をコンポーネントに公開する方法を定義することができるようになります。

`inject` 関数は2つの引数をとります:

1. 注入されるプロパティ名
2. デフォルト値 (**任意**)

`MyMarker` コンポーネントは、以下のようにリファクタリングすることができます:

```vue{3,6-14}
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')

    return {
      userLocation,
      userGeolocation
    }
  }
}
</script>
```

## リアクティブ

### リアクティブの追加

提供された値と注入された値をリアクティブにするには、値を提供する際に [ref](reactivity-fundamentals.html#独立したリアクティブな値を-参照-として作成する) または [reactive](reactivity-fundamentals.html#リアクティブな状態の宣言) を使います。

`MyMap` コンポーネントは、以下のように変更できます:

```vue{7,15-22}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
  }
}
</script>
```

これで、どちらかのプロパティに何か変更があった場合、`MyMarker` コンポーネントも自動的に更新されるようになります。

### リアクティブプロパティの変更

リアクティブな provide / inject の値を使う場合、**リアクティブなプロパティに対しての変更は可能な限り _提供する側_ の内部に留めることが推奨されます**

例えば、以下の location を変更する必要があるイベントでは、location の変更は `MyMap` コンポーネント内で行われるのが理想的です。

```vue{28-32}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)

    return {
      location
    }
  },
  methods: {
    updateLocation() {
      this.location = 'South Pole'
    }
  }
}
</script>
```

しかし、データが注入されたコンポーネント側でデータを更新する必要がある場合もあります。そのような場合、リアクティブなプロパティを更新する責務を持つメソッドを提供することを推奨します。

```vue{21-23,27}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', location)
    provide('geolocation', geolocation)
    provide('updateLocation', updateLocation)
  }
}
</script>
```

```vue{9,14}
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation
    }
  }
}
</script>
```

最後に、`provide` で渡したデータが、注入されたコンポーネント内で変更されないようにしたい場合は、提供するプロパティに `readonly` をつけることを推奨します。

```vue{7,25-26}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateLocation', updateLocation)
  }
}
</script>
```
