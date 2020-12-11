# イントロダクション

## クックブックとガイド

クックブックはガイドとどう違うのでしょうか？なぜそれが必要なのでしょうか？

- **よりフォーカスする**: ガイドの中では、基本的にストーリーを語っています。それぞれのセクションは、前のセクションの知識を基にしています。クックブックにおいては、それぞれのレシピはそれ自体が独立しています。つまりレシピは、一般的なVueの概要を説明するのではなく、Vueの特定の側面に焦点を当てることができます。

- **より深くまで**: ガイドは長くなりすぎず、それぞれの機能を理解していただくために、可能な限り簡単な例だけを掲載するようにしています。そして次に進みます。クックブックでは、興味深い方法で機能を組み合わせた、より複雑な例を含めることができます。それぞれレシピはまた、それらの例を完全に探求するために、必要なだけ長くて詳細なものにすることができます。

- **JavaScriptを教える**: ガイドでは、少なくともES5のJavaScriptの中級程度の知識があることを前提としています。例えば、 `Array.prototype.filter` がリストをフィルタリングする計算プロパティでどのように動作するかは説明しません。しかし、クックブックでは、必須の JavaScript 機能 (ES6/2015+ を含む) を探索し、より良い Vue アプリケーションの構築にどのように役立つのかという文脈で説明します。

- **エコシステムを探求する**: 高度な機能については、ある程度のエコシステムの知識を前提としています。たとえば、Webpack でシングルファイルコンポーネントを使用したい場合、Webpack の confing についての Vue 以外の部分を設定する方法については説明しません。クックブックでは、少なくともVue開発者にとって普遍的に有用な範囲でこれらのエコシステムライブラリをより深く探求するスペースがあります。

::: ヒント
これらの違いはあるものの、クックブックはまだステップバイステップのマニュアルではないことに注意してください。その内容のほとんどは、HTML、CSS、JavaScript、npm/yarnなどの概念を基本的に理解していることが求められます。

## Cookbook Contributions

### What we're looking for

The Cookbook gives developers examples to work off of that both cover common or interesting use cases, and also progressively explain more complex detail. Our goal is to move beyond a simple introductory example, and demonstrate concepts that are more widely applicable, as well as some caveats to the approach.

If you're interested in contributing, please initiate collaboration by filing an issue under the tag **cookbook idea** with your concept so that we can help guide you to a successful pull request. After your idea has been approved, please follow the template below as much as possible. Some sections are required, and some are optional. Following the numerical order is strongly suggested, but not required.

Recipes should generally:

- Solve a specific, common problem
- Start with the simplest possible example
- Introduce complexities one at a time
- Link to other docs, rather than re-explaining concepts
- Describe the problem, rather than assuming familiarity
- Explain the process, rather than just the end result
- Explain the pros and cons of your strategy, including when it is and isn't appropriate
- Mention alternative solutions, if relevant, but leave in-depth explorations to a separate recipe

We request that you follow the template below. We understand, however, that there are times when you may necessarily need to deviate for clarity or flow. Either way, all recipes should at some point discuss the nuance of the choice made using this pattern, preferably in the form of the alternative patterns section.

### Base Example <Badge text="required" type="error" />

1.  Articulate the problem in a sentence or two.
2.  Explain the simplest possible solution in a sentence or two.
3.  Show a small code sample.
4.  Explain what this accomplishes in a sentence.

### Details about the Value <Badge text="required" type="error" />

1.  Address common questions that one might have while looking at the example. (Blockquotes are great for this)
2.  Show examples of common missteps and how they can be avoided.
3.  Show very simple code samples of good and bad patterns.
4.  Discuss why this may be a compelling pattern. Links for reference are not required but encouraged.

### Real-World Example <Badge text="required" type="error" />

Demonstrate the code that would power a common or interesting use case, either by:

1.  Walking through a few terse examples of setup, or
2.  Embedding a codepen/jsfiddle example

If you choose to do the latter, you should still talk through what it is and does.

### Additional Context <Badge text="optional" />

It's extremely helpful to write a bit about this pattern, where else it would apply, why it works well, and run through a bit of code as you do so or give people further reading materials here.

### When To Avoid This Pattern <Badge text="optional" />

This section is not required, but heavily recommended. It won't make sense to write it for something very simple such as toggling classes based on state change, but for more advanced patterns like mixins it's vital. The answer to most questions about development is ["It depends!"](https://codepen.io/rachsmith/pen/YweZbG), this section embraces that. Here, we'll take an honest look at when the pattern is useful and when it should be avoided, or when something else makes more sense.

### Alternative Patterns <Badge text="required with avoidance section" type="warning" />

This section is required when you've provided the section above about avoidance. It's important to explore other methods so that people told that something is an antipattern in certain situations are not left wondering. In doing so, consider that the web is a big tent and that many people have different codebase structures and are solving different goals. Is the app large or small? Are they integrating Vue into an existing project, or are they building from scratch? Are their users only trying to achieve one goal or many? Is there a lot of asynchronous data? All of these concerns will impact alternative implementations. A good cookbook recipe gives developers this context.

## Thank you

It takes time to contribute to documentation, and if you spend the time to submit a PR to this section of our docs, you do so with our gratitude.
