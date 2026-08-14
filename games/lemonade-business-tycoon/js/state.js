const SAVE_KEY = 'mkg.lbt.rebuild.save.v1';
const SAVE_VERSION = 1;

export const DEFAULT_BUSINESS_NAME = 'Sunny Squeeze';

export function createNewState(name = DEFAULT_BUSINESS_NAME) {
  const businessName = String(name || '').trim().slice(0, 28) || DEFAULT_BUSINESS_NAME;
  return {
    saveVersion: SAVE_VERSION,
    gameVersion: '0.2.0-foundation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    business: {
      name: businessName,
      ownerAvatar: 'owner-builder-b',
      day: 1,
      cash: 40,
      reputation: 50,
      level: 1
    },
    progression: {
      phase: 'first-stand',
      region: 'home',
      headquartersUnlocked: false
    },
    settings: {
      sound: true,
      animations: true,
      reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false
    },
    meta: {
      lastScreen: 'home'
    }
  };
}

function migrate(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.saveVersion === SAVE_VERSION) return raw;
  return null;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveState(state) {
  if (!state || typeof state !== 'object') return false;
  try {
    state.saveVersion = SAVE_VERSION;
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function hasState() {
  return Boolean(loadState());
}

export const saveInfo = Object.freeze({
  key: SAVE_KEY,
  version: SAVE_VERSION
});
