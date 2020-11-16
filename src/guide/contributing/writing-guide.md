# Vue ドキュメントライティングガイド

ドキュメントを書くことは共感の練習です．私たちは客観的な現実を記述しているわけではありません - それは既にソースコードがやってくれています．私たちの仕事は，ユーザーと Vue エコシステムとの関係を形成するための手助けをすることです．この進化し続けるガイドでは，Vue エコシステム内で一貫してドキュメントを作成する方法について，いくつかのルールと推奨事項を紹介しています．

## 原則

- **機能は十分に文書化されていないと存在しません。**
- **ユーザの認知能力（例えば，頭脳）を尊重する。**ユーザが読書を始めるときには，ある程度の限られた頭脳で始めます．そして彼らがそれを使い果たした時，学ぶのをやめます．
  - 認知能力は，複雑な文章、一度に複数の概念を学ばなければならないこと、そしてユーザの仕事に直接関係のない抽象的な例によって、**より早く枯渇します**。
  - 認知能力は、ユーザが一貫して賢く、力強く、好奇心旺盛であると感じさせるように支援すると、**よりゆっくりと枯渇していきます**。物事を消化しやすい断片に分解し、文書の流れに注意を払うことは、この状態を維持するのに役立ちます。
- **常にユーザの立場に立って見ることを心がけましょう。**私たちは何かを徹底的に理解すると、それが当たり前になってきます。これは _知識の呪い_（_the curse of knowledge_）と呼ばれています。良いドキュメントを書くためには、「この概念を学ぶときに最初に何を知る必要があったか？」を思い出すよう努力しましょう。どんな専門用語を学ぶ必要がありましたか？何を誤解していたでしょうか？理解するのに時間がかかったものは何ですか？優れたドキュメントは、ユーザーが読んでいる部分で概念を理解することができます。事前にその概念を実際に人に説明する練習をしておくと良いでしょう．
- **最初に _問題_ を説明し、次に解決策を説明します。**機能がどのように動作するかを示す前に、なぜその機能が存在するのかを説明することが重要です。そうしないと、その情報がユーザーにとって重要なものなのか（自分が経験した問題なのか）、あるいは，それをどのような予備知識，経験と結びつけるのかを知るためのコンテキストを把握することができません。
- **書いている間は、質問することを恐れないようにしましょう。**相手が "間抜け" であるかもしれないと怖がっている場合は特に．弱みがあるのは辛いことですが、質問することが説明する必要があることを完璧に理解するための唯一方法です．
- **機能の議論に参加しましょう。**最高の API は、後で説明する方法を考えようとするのではなく、説明しやすい機能を構築するという，ドキュメントドリブンの開発から生まれます。質問（特に，「間抜けな」質問）を早い段階ですることで、互換性のない修正を行う必要が出てくる前に，混乱や矛盾、問題のある動作を明らかにすることができます。

## 組織

- **Installation/Integration**: Provide a thorough overview of how to integrate the software into as many different kinds of projects as necessary.
- **Introduction/Getting Started**:
  - Provide a less than 10 minute overview of the problems the project solves and why it exists.
  - Provide a less than 30 minute overview of the problems the project solves and how, including when and why to use the project and some simple code examples. At the end, link to both to Installation page and the beginning of the Essentials Guide.
- **Guide**: Make users feel smart, powerful, and curious, then maintain this state so that users maintain the motivation and cognitive capacity to keep learning more. Guide pages are meant to be read sequentially, so should generally be ordered from the highest to lowest power/effort ratio.
  - **Essentials**: It should take no longer than 5 hours to read the Essentials, though shorter is better. Its goal is to provide the 20% of knowledge that will help users handle 80% of use cases. Essentials can link to more advanced guides and the API, though, in most cases, you should avoid such links. When they are provided, you need also provide a context so users are aware if they should follow this link on their first reading. Otherwise, many users end up exhausting their cognitive capacity link-hopping, trying to fully learn every aspect of a feature before moving on, and as a result, never finish that first read-through of the Essentials. Remember that a smooth read is more important than being thorough. We want to give people the information they need to avoid a frustrating experience, but they can always come back and read further, or Google a less common problem when they encounter it.
  - **Advanced**: While the Essentials helps people handle ~80% of use cases, subsequent guides help get users to 95% of use cases, plus more detailed information on non-essential features (e.g. transitions, animations), more complex convenience features (e.g. mixins, custom directives), and dev experience improvements (e.g. JSX, plugins). The final 5% of use cases that are more niche, complex, and/or prone to abuse will be left to the cookbook and API reference, which can be linked to from these advanced guides.
- **Reference/API**: Provide a complete list of features, including type information, descriptions of the problem each solves, examples of every combination of options, and links to guides, cookbook recipes, and other internal resources providing more detail. Unlike other pages, this one is not meant to be read top-to-bottom, so plenty of detail can be provided. These references must also be more easily skimmable than the guides, so the format should be closer to dictionary entries than the story-telling format of the guides.
- **Migrations**:
  - **Versions**: When important changes are made, it's useful to include a full list of changes, including a detailed explanation of why the change was made and how to migrate their projects.
  - **From other projects**: How does this software compare to similar software? This is important to help users understand what additional problems we might solve or create for them, and to what extent they can transfer knowledge they already have.
- **Style Guide**: There are necessarily some key pieces in development that need a decision, but are not core to the API. The style guide provides educated, opinionated recommendations to help guide these decisions. They shouldn't be followed blindly, but can help teams save time by being aligned on smaller details.
- **Cookbook**: Recipes in the cookbook are written with some assumption of familiarity with Vue and its ecosystem. Each is a highly structured document that walks through some common implementation details that a Vue dev might encounter.

## ライティング & 文法

### スタイル

- **Headings should describe problems**, not solutions. For example, a less effective heading might be "Using props", because it describes a solution. A better heading might be "Passing Data to Child Components with Props", because it provides the context of the problem props solve. Users won't really start paying attention to the explanation of a feature until they have some idea of why/when they'd use it.
- **When you assume knowledge, declare it** at the beginning and link to resources for less common knowledge that you're expecting.
- **Introduce only one new concept at a time whenever possible** (including both text and code examples). Even if many people are able to understand when you introduce more than one, there are also many who will become lost - and even those who don't become lost will have depleted more of their cognitive capacity.
- **Avoid special content blocks for tips and caveats when possible.** It's generally preferable to blend these more naturally into the main content, e.g. by building on examples to demonstrate an edge case.
- **Don't include more than two interwoven tips and caveats per page.** If you find that more than two tips are needed in a page, consider adding a caveats section to address these issues. The guide is meant to be read straight through, and tips and caveats can be overwhelming or distracting to someone trying to understand the base concepts.
- **Avoid appeals to authority** (e.g. "you should do X, because that's a best practice" or "X is best because it gives you full separation of concerns"). Instead, demonstrate with examples the specific human problems caused and/or solved by a pattern.
- **When deciding what to teach first, think of what knowledge will provide the best power/effort ratio.** That means teaching whatever will help users solve the greatest pains or greatest number of problems, with the relatively least effort to learn. This helps learners feel smart, powerful, and curious, so their cognitive capacity will drain more slowly.
- **Unless the context assumes a string template or build system, only write code that works in any environment by the software (e.g. Vue, Vuex, etc).**
- **Show, don't tell.** For example, "To use Vue on a page, you can add this to your HTML" (then show the script tag), instead of "To use Vue on a page, you can add a script element with a src attribute, the value of which should be a link to Vue's compiled source".
- **Almost always avoid humor (for English docs)**, especially sarcasm and pop culture references, as it doesn't translate well across cultures.
- **Never assume a more advanced context than you have to.**
- **In most cases, prefer links between sections of the docs over repeating the same content in multiple sections.** Some repetition in content is unavoidable and even essential for learning. However, too much repetition also makes the docs more difficult to maintain, because a change in the API will require changes in many places and it's easy to miss something. This is a difficult balance to strike.
- **Specific is better than generic.** For example, a `<BlogPost>` component example is better than `<ComponentA>`.
- **Relatable is better than obscure.** For example, a `<BlogPost>` component example is better than `<CurrencyExchangeSettings>`.
- **Be emotionally relevant.** Explanations and examples that relate to something people have experience with and care about will always be more effective.
- **Always prefer simpler, plainer language over complex or jargony language.** For example:
  - "you can use Vue with a script element" instead of "in order to initiate the usage of Vue, one possible option is to actually inject it via a script HTML element"
  - "function that returns a function" instead of "higher order function"
- **Avoid language that invalidate struggle**, such as "easy", "just", "obviously", etc. For reference, see [Words To Avoid in Educational Writing](https://css-tricks.com/words-avoid-educational-writing/).

### 文法

- **Avoid abbreviations** in writing and code examples (e.g. `attribute` is better than `attr`, `message` is better than `msg`), unless you are specifically referencing an abbreviation in an API (e.g. `$attrs`). Abbreviation symbols included on standard keyboards (e.g. `@`, `#`, `&`) are OK.
- **When referencing a directly following example, use a colon (`:`) to end a sentence**, rather than a period (`.`).
- **Use the Oxford comma** (e.g. "a, b, and c" instead of "a, b and c"). ![Why the Oxford comma is important](https://raw.githubusercontent.com/vuejs/vuejs.org/master/src/images/oxford-comma.jpg)
  - Source: [The Serial (Oxford) Comma: When and Why To Use It](https://www.inkonhand.com/2015/10/the-serial-oxford-comma-when-and-why-to-use-it/)
- **When referencing the name of a project, use the name that project refers to itself as.** For example, "webpack" and "npm" should both use lowercase as that's how their documentation refers to them.
- **Use Title Case for headings** - at least for now, since it's what we use through the rest of the docs. There's research suggesting that sentence case (only first word of the heading starts with a capital) is actually superior for legibility and also reduces the cognitive overhead for documentation writers, since they don't have to try to remember whether to capitalize words like "and", "with", and "about".
- **Don't use emojis (except in discussions).** Emojis are cute and friendly, but they can be a distraction in documentation and some emoji even convey different meanings in different cultures.

## イテレーション & コミュニケーション

- **Excellence comes from iteration.** First drafts are always bad, but writing them is a vital part of the process. It's extremely difficult to avoid the slow progression of Bad -> OK -> Good -> Great -> Inspiring -> Transcendent.
- **Only wait until something is "Good" before publishing.** The community will help you push it further down the chain.
- **Try not to get defensive when receiving feedback.** Our writing can be very personal to us, but if we get upset with the people who help us make it better, they will either stop giving feedback or start limiting the kind of feedback they give.
- **Proof-read your own work before showing it to others.** If you show someone work with a lot of spelling/grammar mistakes, you'll get feedback about spelling grammar/mistakes instead of more valuable notes about whether the writing is achieving your goals.
- **When you ask people for feedback, tell reviewers what:**
  - **you're trying to do**
  - **your fears are**
  - **balances you're trying to strike**
- **When someone reports a problem, there is almost always a problem**, even if the solution they proposed isn't quite right. Keep asking follow-up questions to learn more.
- People need to feel safe asking questions when contributing/reviewing content. Here's how you can do that:
  - **Thank people for their contributions/reviews, even if you're feeling grumpy.** For example:
    - "Great question!"
    - "Thanks for taking the time to explain. 🙂"
    - "This is actually intentional, but thanks for taking the time to contribute. 😊"
  - **Listen to what people are saying and mirror if you're not sure you're understanding correctly.** This can help validate people's feelings and experiences, while also understanding if _you're_ understanding _them_ correctly.
  - **Use a lot of positive and empathetic emojis.** It's always better to seem a little strange than mean or impatient.
  - **Kindly communicate rules/boundaries.** If someone behaves in a way that's abusive/inappropriate, respond only with kindness and maturity, but also make it clear that this behavior is not acceptable and what will happen (according to the code of conduct) if they continue behaving poorly.

### Tips, Callouts, Alerts, and Line Highlights

We have some dedicated styles to denote something that's worth highlighting in a particular way. These are captured [on this page](https://v3.vuejs.org/guide/doc-style-guide.html#alerts). **They are to be used sparingly.**

There is a certain temptation to abuse these styles, as one can simply add a change inside a callout. However, this breaks up the flow of reading for the user, and thus, should only be used in special circumstances. Wherever possible, we should attempt to create a narrative and flow within the page to respect the readers cognitive load.

Under no circumstances should 2 alerts be used next to one another, it's a sign that we're not able to explain context well enough.

### コントリビュート

We appreciate small, focused PRs. If you'd like to make an extremely large change, please communicate with team members prior to a pull request. Here's a [writeup that details why this is so critical](https://www.netlify.com/blog/2020/03/31/how-to-scope-down-prs/) for us to work well on this team. Please understand that though we always appreciate contributions, ultimately we have to prioritize what works best for the project as a whole.

## リソース

### ソフトウェア

- [Grammarly](https://www.grammarly.com/): Desktop app and browser extension for checking spelling and grammar (though grammar checking doesn't catch everything and occasionally shows a false positive).
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker): An extension for VS Code to help you check spelling within markdown and code examples.

### 本

- [On Writing Well](https://www.amazon.com/Writing-Well-30th-Anniversary-Nonfiction-ebook/dp/B0090RVGW0) (see [popular quotes](https://www.goodreads.com/work/quotes/1139032-on-writing-well-the-classic-guide-to-writing-nonfiction))
- [Bird by Bird](https://www.amazon.com/Bird-Some-Instructions-Writing-Life/dp/0385480016) (see [popular quotes](https://www.goodreads.com/work/quotes/841198-bird-by-bird-some-instructions-on-writing-and-life))
- [Cognitive Load Theory](https://www.amazon.com/Cognitive-Explorations-Instructional-Performance-Technologies/dp/144198125X/)
