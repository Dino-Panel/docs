// @ts-check

const isCI = process.env.CI === "true";
const isPreview = process.env.DEPLOY_PREVIEW === "true";

/** @type {import("@docusaurus/types").Config} */
const base = {
  title: "DiskCraft Documentation",
  tagline: "Documentation for anything DiskCraft.",
  customFields: {
    description:
      "Documentation for all projects under the DiskCraft umbrella, including DiskCraft, Hosting, and WebShare.",
  },
  url: isPreview ? process.env.PREVIEW_URL : "https://docs.diskcraft.xyz",
  baseUrl: isPreview ? process.env.PREVIEW_BASE_URL : "/",
  onBrokenLinks: isCI ? "throw" : "warn",
  onBrokenMarkdownLinks: isCI ? "throw" : "warn",
  onDuplicateRoutes: isCI ? "throw" : "error",
  favicon: "img/favicon.ico",
  organizationName: "DiskCraft",
  projectName: "docs",
  trailingSlash: false,
  noIndex: isPreview,

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        debug: !isCI || isPreview,
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
        docs: {
          editUrl: ({ docPath }) => `#`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarCollapsible: true,
          remarkPlugins: [require("@fec/remark-a11y-emoji")],
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-pwa",
      {
        offlineModeActivationStrategies: ["appInstalled", "standalone", "queryString"],
        pwaHead: [
          {
            tagName: "link",
            rel: "icon",
            href: "img/diskcraft3.png",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "/manifest.json",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "rgb(0, 78, 233)",
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: "img/ccn.png",
      metadata: [
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:image:alt",
          content: "DiskCraft Logo",
        },
      ],
      navbar: {
        title: "DiskCraft Docs",
        logo: {
          alt: "DiskCraft Logo",
          src: "img/diskcraft2.png",
        },
        items: [
          {
            to: "diskcraft",
            label: "DiskCraft",
            position: "left",
          },
          {
            to: "https://downloads.diskcraft.xyz",
            label: "Downloads",
            position: "right",
          },
          {
            href: "https://discord.gg/pVH5EMeeEE",
            className: "header-icon-link header-discord-link",
            position: "right",
          },
          {
            href: "https://github.com/Diskcraft/diskcraft",
            className: "header-icon-link header-github-link",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/xte8RZ2AsS",
              },
            ],
          },
          {
            title: "Other",
            items: [
              {
                label: "Main Site",
                href: "https://diskcraft.xyz",
              },
              {
                label: "GitHub",
                href: "https://github.com/Diskcraft/diskcraft",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} DiskCraft and Contributors`,
      },
      prism: {
        additionalLanguages: [
          "batch",
          "bash",
          "git",
          "java",
          "javastacktrace",
          "kotlin",
          "groovy",
          "log",
          "toml",
          "properties",
        ],
        theme: require("prism-react-renderer/themes/vsDark"),
      },
      algolia: {
        appId: "P1BCDPTG1Q",
        apiKey: "34772712950f27c6e9c714ad2e6c5e16",
        indexName: "docs-papermc",
      },
    }),
};

async function config() {
  return base;
}

module.exports = config;
