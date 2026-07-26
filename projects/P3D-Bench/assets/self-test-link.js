const install = () => {
  const actions = document.querySelector(".actions");
  if (!actions || actions.querySelector('[data-public-self-test="true"]')) return false;

  const link = document.createElement("a");
  link.href = "/projects/P3D-Bench/self-test/";
  link.textContent = "Self-evaluation";
  link.dataset.publicSelfTest = "true";
  actions.append(link);
  return true;
};

if (!install()) {
  const observer = new MutationObserver(() => {
    if (install()) observer.disconnect();
  });
  observer.observe(document.getElementById("root"), { childList: true, subtree: true });
}
