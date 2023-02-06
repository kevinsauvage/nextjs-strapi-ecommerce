/* eslint-disable no-plusplus */
function processHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;

  // remove all style attributes
  const elements = div.getElementsByTagName('*');
  for (let i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('style');
  }

  // remove <br> tags
  const brTags = div.getElementsByTagName('br');
  while (brTags.length > 0) {
    brTags[0].parentNode.removeChild(brTags[0]);
  }

  // remove <img> tags
  const imgTags = div.getElementsByTagName('img');
  while (imgTags.length > 0) {
    imgTags[0].parentNode.removeChild(imgTags[0]);
  }

  // remove comments
  const comments = div.getElementsByTagName('!--');
  while (comments.length > 0) {
    comments[0].parentNode.removeChild(comments[0]);
  }

  // remove scripts
  const scripts = div.getElementsByTagName('script');
  while (scripts.length > 0) {
    scripts[0].parentNode.removeChild(scripts[0]);
  }

  // remove link tags
  const linkTags = div.getElementsByTagName('link');
  while (linkTags.length > 0) {
    linkTags[0].parentNode.removeChild(linkTags[0]);
  }

  return div.innerHTML;
}

export default processHtml;
