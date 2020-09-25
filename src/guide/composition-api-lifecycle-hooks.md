# ライフサイクルフック

> このページは、すでに [コンポジション API の基本](composition-api-introduction.html) と [リアクティブの基礎](reactivity-fundamentals.html) を読んでいることを前提としています。 コンポジション API を初めて使用する場合は、最初にそちらをお読みください。

ライフサイクルフックの前に "on" をつけることで、コンポーネントのライフサイクルフックにアクセスすることができます。

[setup()](composition-api-setup.html) 内で、ライフサイクルフックを呼び出す方法は、次の表の通りです:


| オプション API      | `setup` 内のフック          |
| ----------------- | -------------------------- |
| `beforeCreate`    | 不要\*               |
| `created`         | 不要\*               |
| `beforeMount`     | `onBeforeMount`            |
| `mounted`         | `onMounted`                |
| `beforeUpdate`    | `onBeforeUpdate`           |
| `updated`         | `onUpdated`                |
| `beforeUnmount`   | `onBeforeUnmount`          |
| `unmounted`       | `onUnmounted`              |
| `errorCaptured`   | `onErrorCaptured`          |
| `renderTracked`   | `onRenderTracked`          |
| `renderTriggered` | `onRenderTriggered`        |

:::tip
`setup` は `beforeCreate` と `created` のライフサイクルで実行されるため、これらのフックを明示的に定義する必要はありません。言い換えれば、これらのフック内のコードは、 `setup` 内に直接書くべきです。
:::

これらの関数は、コンポーネントからフックが呼び出された時に実行されるコールバックを、受け入れます:

```js
// MyBook.vue

export default {
  setup() {
    // mounted
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
```
