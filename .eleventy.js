const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Static assets pass straight through to the output folder
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Friendly date formatting for newsletter issues, e.g. "August 1, 2026"
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat(
      "LLLL d, yyyy"
    );
  });

  // Collections — these read every markdown file in each content folder,
  // which is exactly what the CMS creates/edits when Morgan & Allie hit "Save."
  // All the filtering/grouping lives here (plain JavaScript) rather than in
  // the templates, since Nunjucks doesn't have Jinja-style selectattr/map filters.
  eleventyConfig.addCollection("restaurants", (api) =>
    api.getFilteredByGlob("src/restaurants/*.md").sort((a, b) => {
      return (a.data.title || "").localeCompare(b.data.title || "");
    })
  );

  eleventyConfig.addCollection("featuredRestaurants", (api) => {
    const all = api.getFilteredByGlob("src/restaurants/*.md");
    const featured = all.filter((r) => r.data.featured);
    return (featured.length ? featured : all).slice(0, 3);
  });

  eleventyConfig.addCollection("dedicatedChicagoRestaurants", (api) =>
    api
      .getFilteredByGlob("src/restaurants/*.md")
      .filter((r) => r.data.category === "Dedicated" && r.data.region === "chicago")
  );

  eleventyConfig.addCollection("friendlyChicagoRestaurants", (api) =>
    api
      .getFilteredByGlob("src/restaurants/*.md")
      .filter((r) => r.data.category === "Friendly" && r.data.region === "chicago")
  );

  eleventyConfig.addCollection("suburbRestaurants", (api) =>
    api.getFilteredByGlob("src/restaurants/*.md").filter((r) => r.data.region === "suburbs")
  );

  eleventyConfig.addCollection("recipes", (api) =>
    api.getFilteredByGlob("src/recipes/*.md")
  );

  eleventyConfig.addCollection("products", (api) =>
    api.getFilteredByGlob("src/products/*.md")
  );

  eleventyConfig.addCollection("productsByCategory", (api) => {
    const all = api.getFilteredByGlob("src/products/*.md");
    const grouped = {};
    all.forEach((p) => {
      const cat = p.data.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
    return grouped;
  });

  eleventyConfig.addCollection("newsletterIssues", (api) =>
    api
      .getFilteredByGlob("src/newsletter/*.md")
      .sort((a, b) => (b.data.issue_number || 0) - (a.data.issue_number || 0))
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
