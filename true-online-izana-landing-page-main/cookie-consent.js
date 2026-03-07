(() => {
  const COOKIE_KEY = "cookie_consent_v1";
  const MOUNT_ID = "cookie-consent-mount";

  const mount = document.getElementById(MOUNT_ID);
  if (!mount) return;

  const cookieBar = () => document.getElementById("cookieBar");
  const modal = () => document.getElementById("cookieModal");

  const showCookieBarIfNeeded = () => {
    const saved = localStorage.getItem(COOKIE_KEY);
    const bar = cookieBar();
    if (!bar) return;
    if (!saved) bar.classList.remove("hidden");
    else bar.classList.add("hidden");
  };

  const hideCookieBar = () => {
    const bar = cookieBar();
    if (bar) bar.classList.add("hidden");
  };

  const openModal = () => {
    const m = modal();
    const analyticsEl = document.getElementById("cookieAnalytics");
    const marketingEl = document.getElementById("cookieMarketing");

    const saved = localStorage.getItem(COOKIE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (analyticsEl) analyticsEl.checked = !!data.analytics;
        if (marketingEl) marketingEl.checked = !!data.marketing;
      } catch (_) {}
    } else {
      if (analyticsEl) analyticsEl.checked = false;
      if (marketingEl) marketingEl.checked = false;
    }

    if (m) m.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    const m = modal();
    if (m) m.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  const saveConsent = (consent) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    closeModal();
    hideCookieBar();
  };

  const bindEvents = () => {
    const acceptBtn = document.getElementById("cookieAcceptBtn");
    const settingsBtn = document.getElementById("cookieSettingsBtn");
    const closeModalBtn = document.getElementById("cookieCloseModal");
    const saveBtn = document.getElementById("cookieSaveBtn");
    const rejectBtn = document.getElementById("cookieRejectBtn");

    acceptBtn?.addEventListener("click", () => {
      saveConsent({ necessary: true, analytics: true, marketing: true, ts: Date.now() });
    });

    settingsBtn?.addEventListener("click", openModal);
    closeModalBtn?.addEventListener("click", closeModal);

    modal()?.addEventListener("click", (e) => {
      if (e.target === modal() || e.target.classList.contains("bg-black/40")) closeModal();
    });

    saveBtn?.addEventListener("click", () => {
      const analyticsEl = document.getElementById("cookieAnalytics");
      const marketingEl = document.getElementById("cookieMarketing");
      saveConsent({
        necessary: true,
        analytics: !!analyticsEl?.checked,
        marketing: !!marketingEl?.checked,
        ts: Date.now(),
      });
    });

    rejectBtn?.addEventListener("click", () => {
      saveConsent({ necessary: true, analytics: false, marketing: false, ts: Date.now() });
    });
  };

  const init = async () => {
    const res = await fetch("/cookie-consent.html", { cache: "no-store" });
    const html = await res.text();
    mount.innerHTML = html;
    bindEvents();
    showCookieBarIfNeeded();
  };

  init().catch(() => {});
})();
