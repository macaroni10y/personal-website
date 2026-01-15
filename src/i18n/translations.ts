export type Locale = "ja" | "en";

export const translations = {
  ja: {
    nav: {
      about: "About",
      projects: "Projects",
      links: "Links",
      career: "Career",
      menuToggle: "メニュー",
    },
    seeMore: "もっと見る",
    blog: {
      title: "Tech Blog",
      backToTop: "トップに戻る",
    },
    hero: {
      name: "macaroni10y",
      tagline: "Software Engineer",
      subtitle: "at Kyoto",
    },
    about: {
      content: `macaroni10y(28)

日本のエンターテインメント企業にて、自社プロダクトの設計・開発・運用に従事。
`,
    },
    projects: [
      {
        title: "macaroni poker",
        url: "https://macaroni-poker1.vercel.app/",
        description: "A planning poker application",
        icon: "portfolio",
      },
      {
        title: "8番ニュース",
        url: "https://exit8-news-website.vercel.app/",
        description: "A web-based game for GitHub Hackathon (For The Love of Code) inspired by 8番出口",
        icon: "portfolio",
      },
      {
        title: "placeholder-craft-cli",
        url: "https://www.npmjs.com/package/placeholder-craft-cli",
        description: "A simple CLI tool to generate placeholder images",
        icon: "portfolio",
      },
      {
        title: "transparent-visualizer-cli",
        url: "https://www.npmjs.com/package/transparent-visualizer-cli",
        description: "A CLI tool to visualize transparent pixels in PNG",
        icon: "portfolio",
      },
    ],
    links: [
      {
        title: "GitHub",
        url: "https://github.com/macaroni10y",
        description: "GitHub",
        icon: "github",
      },
      {
        title: "Qiita",
        url: "https://qiita.com/macaroni_",
        description: "Qiita",
        icon: "article",
      },
      {
        title: "Tech Blog",
        url: "/ja/blog",
        description: "所属企業ブログに寄稿した技術記事",
        icon: "blog",
      },
    ],
    footer: "© 2026 macaroni10y. All rights reserved.",
    meta: {
      title: "macaroni10y | Software Engineer",
      description:
        "macaroni10y | 日本を拠点に活動するソフトウェアエンジニア",
    },
  },
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      links: "Links",
      career: "Career",
      menuToggle: "Menu",
    },
    seeMore: "See more",
    blog: {
      title: "Tech Blog",
      backToTop: "Back to top",
    },
    hero: {
      name: "macaroni10y",
      tagline: "Software Engineer",
      subtitle: "at Kyoto",
    },
    about: {
      content: `macaroni10y (28)

A software engineer at a Japanese entertainment company, designing, developing, and operating in-house products.
`,
    },
    projects: [
      {
        title: "macaroni poker",
        url: "https://macaroni-poker1.vercel.app/",
        description: "A planning poker application",
        icon: "portfolio",
      },
      {
        title: "8番ニュース",
        url: "https://exit8-news-website.vercel.app/",
        description: "A web-based game for GitHub Hackathon (For The Love of Code) inspired by 8番出口",
        icon: "portfolio",
      },
      {
        title: "placeholder-craft-cli",
        url: "https://www.npmjs.com/package/placeholder-craft-cli",
        description: "A simple CLI tool to generate placeholder images",
        icon: "portfolio",
      },
      {
        title: "transparent-visualizer-cli",
        url: "https://www.npmjs.com/package/transparent-visualizer-cli",
        description: "A CLI tool to visualize transparent pixels in PNG",
        icon: "portfolio",
      },
    ],
    links: [
      {
        title: "GitHub",
        url: "https://github.com/macaroni10y",
        description: "GitHub",
        icon: "github",
      },
      {
        title: "Qiita",
        url: "https://qiita.com/macaroni_",
        description: "Technical articles in Japanese",
        icon: "article",
      },
      {
        title: "Tech Blog",
        url: "/en/blog",
        description: "Technical articles contributed to company blog",
        icon: "blog",
      },
    ],
    footer: "© 2026 macaroni10y. All rights reserved.",
    meta: {
      title: "macaroni10y | Software Engineer",
      description:
        "macaroni10y | Software Engineer based in Japan.",
    },
  },
} as const;

export function t(locale: Locale) {
  return translations[locale];
}
