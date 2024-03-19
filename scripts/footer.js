function createFooter () {
  const footer = document.querySelector("footer");
  const githubLink = "https://github.com/catmajor/staticAPJavaTests";
  const linkText = "By Nikita Ostapenko, Thanks to Mrs. Uptegrove for Hosting";
  footer.innerHTML = `<a href=${githubLink}>${linkText}</a>`;
}
createFooter();
