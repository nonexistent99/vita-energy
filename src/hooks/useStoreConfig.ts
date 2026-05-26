import { useCallback, useEffect, useState } from 'react';
import {
  clearStoreConfig,
  getStoreConfig,
  normalizeStoreConfig,
  saveStoreConfig,
  STORE_CONFIG_EVENT,
  STORE_CONFIG_KEY,
  type StoreConfig,
} from '../utils/storeConfig';

type ConfigUpdater = StoreConfig | ((current: StoreConfig) => StoreConfig);

export function useStoreConfig() {
  const [config, setConfigState] = useState<StoreConfig>(() => getStoreConfig());

  useEffect(() => {
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === STORE_CONFIG_KEY) {
        setConfigState(getStoreConfig());
      }
    };

    const syncFromCustomEvent = (event: Event) => {
      const detail = (event as CustomEvent<StoreConfig>).detail;
      setConfigState(normalizeStoreConfig(detail));
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener(STORE_CONFIG_EVENT, syncFromCustomEvent);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener(STORE_CONFIG_EVENT, syncFromCustomEvent);
    };
  }, []);

  const setConfig = useCallback((next: ConfigUpdater) => {
    setConfigState((current) => {
      const nextConfig = typeof next === 'function' ? next(current) : next;
      return saveStoreConfig(nextConfig);
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(clearStoreConfig());
  }, []);

  return { config, setConfig, resetConfig };
}
