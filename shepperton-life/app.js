(() => {
  "use strict";

  const screens = [...document.querySelectorAll("[data-screen]")];
  const settingsDialog = document.querySelector("#settings-dialog");
  const toast = document.querySelector(".toast");
  const playerName = document.querySelector("#player-name");
  const preferenceKey = "sheppertonLifePreferencesV1";
  let toastTimer;

  const showScreen = (screenName) => {
    screens.forEach((screen) => {
      const isTarget = screen.dataset.screen === screenName;
      screen.hidden = !isTarget;
      screen.classList.toggle("is-active", isTarget);
    });

    document.title = screenName === "title" ? "Shepperton Life" : `${screenName.replaceAll("-", " ")} · Shepperton Life`;
    document.querySelector(`[data-screen="${screenName}"]`)?.focus({ preventScroll: true });
  };

  const showToast = (message) => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  };

  const readPreferences = () => {
    try {
      return JSON.parse(localStorage.getItem(preferenceKey)) ?? {};
    } catch {
      return {};
    }
  };

  const applyPreferences = (preferences) => {
    document.body.classList.toggle("large-text", Boolean(preferences.largeText));
    document.body.classList.toggle("high-contrast", Boolean(preferences.highContrast));
    document.body.classList.toggle("reduced-motion", Boolean(preferences.reducedMotion));

    document.querySelectorAll("[data-setting]").forEach((control) => {
      control.checked = Boolean(preferences[control.dataset.setting]);
    });
  };

  const savePreferences = () => {
    const preferences = {};
    document.querySelectorAll("[data-setting]").forEach((control) => {
      preferences[control.dataset.setting] = control.checked;
    });

    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    applyPreferences(preferences);
  };

  document.addEventListener("click", (event) => {
    const navigation = event.target.closest("[data-go]");
    const settingsButton = event.target.closest("[data-open-settings]");
    const startButton = event.target.closest("[data-start-preview]");

    if (navigation) {
      showScreen(navigation.dataset.go);
    }

    if (settingsButton) {
      settingsDialog.showModal();
    }

    if (startButton) {
      const name = playerName.value.trim();
      if (!name) {
        playerName.focus();
        showToast("Please enter a name first");
        return;
      }

      showScreen("game-preview");
      showToast(`Welcome to Marlowe Mews, ${name}`);
    }
  });

  document.querySelectorAll("[data-setting]").forEach((control) => {
    control.addEventListener("change", savePreferences);
  });

  settingsDialog.addEventListener("close", () => showToast("Settings saved"));
  applyPreferences(readPreferences());
})();
