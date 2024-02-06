const htmlmin = require('html-minifier');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const dateFilter = require('./src/filters/date-filter.js');
const w3cDateFilter = require('./src/filters/w3c-date-filter.js');
const navLinks = require('./src/filters/navLinks.js');
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLayoutAlias('main', 'layouts/main.njk');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addFilter('dateFilter', dateFilter);
  eleventyConfig.addFilter('w3cDateFilter', w3cDateFilter);
  eleventyConfig.addFilter('navLinks', navLinks);

  // Rename the shortcode to "responsiveImage"
  eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async (src, alt) => {
    let options = {
      widths: [320, 640, 768, 992, 1200, null], // Use the original image width
      formats: ["webp", "jpeg"], // Specify formats
      urlPath: "/images/",
      outputDir: "./_site/images/",
      // ... other options
    };

    // Generate images
    let metadata = await Image(`./src/${src}`, options);

    let imageAttributes = {
      alt,
      sizes: "(min-width: 1200px) 1200px, (min-width: 992px) 992px, (min-width: 768px) 768px, 100vw",
      loading: "lazy",
      decoding: "async",
    };

    // Return the image HTML
    return Image.generateHTML(metadata, imageAttributes);
  });

  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: './src'
    },
    passthroughFileCopy: true
  };
};
