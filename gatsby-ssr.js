// Gatsby advises implementing the same things in gatsby-ssr.js and
// gatsby-browser.js even for sites that aren't implementing server-side rendering,
// to avoid hydration mismatches.
// See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/#:~:text=The%20file%20gatsby%2Dssr.,being%20hydrated%20in%20the%20browser.
const { wrapRootElement, wrapPageElement } = require("./gatsby-browser");

exports.wrapRootElement = wrapRootElement;
exports.wrapPageElement = wrapPageElement;
