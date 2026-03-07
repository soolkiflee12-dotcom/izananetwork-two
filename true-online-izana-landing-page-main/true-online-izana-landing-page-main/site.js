(() => {
  const mountHeader = async () => {
    const el = document.getElementById("site-header");
    if (!el) return;
    const res = await fetch("/header.html", { cache: "no-store" });
    el.innerHTML = await res.text();

    const icon = document.getElementById("themeIcon");
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      if (icon) icon.textContent = "☀️";
    } else {
      if (icon) icon.textContent = "🌙";
    }
  };

  window.toggleDark = function () {
    const html = document.documentElement;
    const icon = document.getElementById("themeIcon");
    html.classList.toggle("dark");
    if (html.classList.contains("dark")) {
      localStorage.theme = "dark";
      if (icon) icon.textContent = "☀️";
    } else {
      localStorage.theme = "light";
      if (icon) icon.textContent = "🌙";
    }
  };

  mountHeader().catch(() => {});
})();
