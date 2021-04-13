const sidebar = {
  cookbook: [{
    title: 'クックブック',
    collapsable: false,
    children: ['/cookbook/', '/cookbook/editable-svg-icons']
  }],
  guide: [{
      title: '基本的な使い方',
      collapsable: false,
      children: [
        '/guide/installation',
        '/guide/introduction',
        '/guide/instance',
        '/guide/template-syntax',
        '/guide/computed',
        '/guide/class-and-style',
        '/guide/conditional',
        '/guide/list',
        '/guide/events',
        '/guide/forms',
        '/guide/component-basics'
      ]
    },
    {
      title: 'コンポーネントの詳細',
      collapsable: false,
      children: [
        '/guide/component-registration',
        '/guide/component-props',
        '/guide/component-attrs',
        '/guide/component-custom-events',
        '/guide/component-slots',
        '/guide/component-provide-inject',
        '/guide/component-dynamic-async',
        '/guide/component-template-refs',
        '/guide/component-edge-cases'
      ]
    },
    {
      title: 'トランジションとアニメーション',
      collapsable: false,
      children: [
        '/guide/transitions-overview',
        '/guide/transitions-enterleave',
        '/guide/transitions-list',
        '/guide/transitions-state'
      ]
    },
    {
      title: '再利用と構成',
      collapsable: false,
      children: [
        '/guide/mixins',
        '/guide/custom-directive',
        '/guide/teleport',
        '/guide/render-function',
        '/guide/plugins'
      ]
    },
    {
      title: '高度な使い方',
      collapsable: false,
      children: [{
          title: 'リアクティビティ',
          children: [
            '/guide/reactivity',
            '/guide/reactivity-fundamentals',
            '/guide/reactivity-computed-watchers'
          ]
        },
        {
          title: 'Composition API',
          children: [
            '/guide/composition-api-introduction',
            '/guide/composition-api-setup',
            '/guide/composition-api-lifecycle-hooks',
            '/guide/composition-api-provide-inject',
            '/guide/composition-api-template-refs'
          ]
        },
        '/guide/optimizations',
        '/guide/change-detection'
      ]
    },
    {
      title: 'ツール',
      collapsable: false,
      children: [
        '/guide/single-file-component',
        '/guide/testing',
        '/guide/typescript-support'
      ]
    },
    {
      title: 'スケールアップ',
      collapsable: false,
      children: ['/guide/routing', '/guide/state-management', '/guide/ssr']
    },
    {
      title: 'アクセシビリティ',
      collapsable: false,
      children: [
        '/guide/a11y-basics',
        '/guide/a11y-semantics',
        '/guide/a11y-standards',
        '/guide/a11y-resources'
      ]
    },
    {
      title: 'Vue 2 からのマイグレーション',
      collapsable: true,
      children: [
        'migration/introduction',
        'migration/array-refs',
        'migration/async-components',
        'migration/attribute-coercion',
        'migration/attrs-includes-class-style',
        'migration/children',
        'migration/custom-directives',
        'migration/custom-elements-interop',
        'migration/data-option',
        'migration/emits-option',
        'migration/events-api',
        'migration/filters',
        'migration/fragments',
        'migration/functional-components',
        'migration/global-api',
        'migration/global-api-treeshaking',
        'migration/inline-template-attribute',
        'migration/keycode-modifiers',
        'migration/listeners-removed',
        'migration/props-default-this',
        'migration/render-function-api',
        'migration/slots-unification',
        'migration/transition',
        'migration/v-if-v-for',
        'migration/v-model',
        'migration/v-bind'
      ]
    },
    {
      title: 'ドキュメントへの貢献',
      collapsable: true,
      children: [
        'contributing/writing-guide',
        'contributing/doc-style-guide',
        'contributing/translations'
      ]
    }
  ],
  api: [
    '/api/application-config',
    '/api/application-api',
    '/api/global-api',
    {
      title: 'オプション',
      collapsable: false,
      children: [
        '/api/options-data',
        '/api/options-dom',
        '/api/options-lifecycle-hooks',
        '/api/options-assets',
        '/api/options-composition',
        '/api/options-misc'
      ]
    },
    '/api/instance-properties',
    '/api/instance-methods',
    '/api/directives',
    '/api/special-attributes',
    '/api/built-in-components.md',
    {
      title: 'リアクティビティ API',
      collapsable: false,
      children: [
        '/api/basic-reactivity',
        '/api/refs-api',
        '/api/computed-watch-api'
      ]
    },
    '/api/composition-api'
  ],
  examples: [{
    title: '例',
    collapsable: false,
    children: [
      '/examples/markdown',
      '/examples/commits',
      '/examples/grid-component',
      '/examples/tree-view',
      '/examples/svg',
      '/examples/modal',
      '/examples/elastic-header',
      '/examples/select2',
      '/examples/todomvc'
    ]
  }]
}

module.exports = {
  title: 'Vue.js',
  description: 'Vue.js - The Progressive JavaScript Framework',
  head: [
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css?family=Inter:300,400,500,600|Open+Sans:400,600;display=swap',
        rel: 'stylesheet'
      }
    ],
    [
      'link',
      {
        href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        rel: 'stylesheet'
      }
    ],
    ['link', {
      rel: 'icon',
      href: '/logo.png'
    }],
    [
      'script',
      {
        src: 'https://player.vimeo.com/api/player.js'
      }
    ],
    [
      'script',
      {
        src: 'https://extend.vimeocdn.com/ga/72160148.js',
        defer: 'defer'
      }
    ]
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [{
        text: 'ドキュメント',
        ariaLabel: 'Documentation Menu',
        items: [{
            text: 'ガイド',
            link: '/guide/introduction'
          },
          {
            text: 'スタイルガイド',
            link: '/style-guide/'
          },
          {
            text: 'クックブック',
            link: '/cookbook/'
          },
          {
            text: '例',
            link: '/examples/markdown'
          }
        ]
      },
      {
        text: 'API リファレンス',
        link: '/api/application-config'
      },
      {
        text: 'エコシステム',
        items: [{
            text: 'コミュニティ',
            ariaLabel: 'Community Menu',
            items: [{
                text: 'チーム',
                link: '/community/team/'
              },
              {
                text: 'パートナー',
                link: '/community/partners'
              },
              {
                text: '参加する',
                link: '/community/join/'
              },
              {
                text: 'テーマ',
                link: '/community/themes/'
              }
            ]
          },
          {
            text: '公式プロジェクト',
            items: [{
                text: 'Vue Router',
                link: 'https://router.vuejs.org/'
              },
              {
                text: 'Vuex',
                link: 'https://vuex.vuejs.org/'
              },
              {
                text: 'Vue CLI',
                link: 'https://cli.vuejs.org/'
              },
              {
                text: 'Vue Test Utils',
                link: 'https://vue-test-utils.vuejs.org/'
              },
              {
                text: 'Devtools',
                link: 'https://github.com/vuejs/vue-devtools'
              },
              {
                text: 'ウィークリーニュース',
                link: 'https://news.vuejs.org/'
              }
            ]
          }
        ]
      },
      {
        text: 'Vue を支援する',
        link: '/support-vuejs/',
        items: [{
            text: '1 回きりの支援',
            link: '/support-vuejs/#one-time-donations'
          },
          {
            text: '継続的な支援',
            link: '/support-vuejs/#recurring-pledges'
          },
          {
            text: 'Tシャツショップ',
            link: 'https://vue.threadless.com/'
          }
        ]
      }
    ],
    repo: 'vuejs/docs-next',
    editLinks: false,
    editLinkText: 'GitHub でこのページを編集！',
    lastUpdated: '最終更新日',
    docsDir: 'src',
    sidebarDepth: 2,
    sidebar: {
      collapsable: false,
      '/guide/': sidebar.guide,
      '/community/': sidebar.guide,
      '/cookbook/': sidebar.cookbook,
      '/api/': sidebar.api,
      '/examples/': sidebar.examples
    },
    smoothScroll: false,
    algolia: {
      indexName: 'vuejs-v3',
      apiKey: 'bc6e8acb44ed4179c30d0a45d6140d3f'
    }
  },
  plugins: [
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          '/': {
            message: 'New content is available.',
            buttonText: 'Refresh'
          }
        }
      }
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'info',
        before: info =>
          `<div class="custom-block info"><p class="custom-block-title">${info}</p>`,
        after: '</div>'
      }
    ]
  ],
  markdown: {
    lineNumbers: true,
    /** @param {import('markdown-it')} md */
    extendMarkdown: md => {
      md.options.highlight = require('./markdown/highlight')(
        md.options.highlight
      )
    }
  }
}
