/**
 * HTML processing utilities
 * Pure utility functions for HTML manipulation
 */

/* eslint-disable no-param-reassign */
function processHtml(html: string) {
  // remove all style attributes
  if (!html) return '';

  html = html.replace(/style="[^"]*"/g, '');

  // remove <br> tags
  html = html.replace(/<br[^>]*>/g, '');

  // remove <img> tags
  html = html.replace(/<img[^>]*>/g, '');

  // remove comments
  html = html.replace(/<!--[^>]*-->/g, '');

  // remove scripts
  html = html.replace(/<script[^>]*>[^<]*<\/script>/g, '');

  // remove link tags
  return html.replace(/<link[^>]*>/g, '');
}

export default processHtml;

