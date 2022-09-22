// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "link",
      label: "Support Discord",
      href: "https://discord.gg/pVH5EMeeEE",
    },
    "README",
    {
      type: "category",
      label: "diskcraft",
      link: {
        type: "doc",
        id: "diskcraft/README",
      },
      items: [
        {
          type: "category",
          label: "Getting Started",
          link: {
            type: "doc",
            id: "diskcraft/getting-started/README",
          },
          items: ["diskcraft/getting-started/README"],
        },
        {
          type: "category",
          label: "Reference",
          items: [
            "diskcraft/reference/diskcraft-global-configuration",
          ],
        },
      ],
    },
    {
    },
  ],
};

module.exports = sidebars;
