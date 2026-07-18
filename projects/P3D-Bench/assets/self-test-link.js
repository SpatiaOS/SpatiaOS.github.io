const install = () => {
  const links = document.querySelector(".nav > div");
  if (!links || links.querySelector('[data-public-self-test="true"]')) return false;
  const link = document.createElement("a");
  link.href = "./self-test/";
  link.textContent = "Self-test";
  link.dataset.publicSelfTest = "true";
  links.append(link);
  return true;
};

if (!install()) {
  const observer = new MutationObserver(() => {
    if (install()) observer.disconnect();
  });
  observer.observe(document.getElementById("root"), { childList: true, subtree: true });
}
