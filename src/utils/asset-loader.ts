import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Logger from './logger';

class AssetLoader {
  private static instance: AssetLoader;
  private loadedAssets: Map<string, boolean> = new Map();

  private constructor() {}

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  public async preloadAssets() {
    try {
      // No local assets to preload since we're using vector icons
      await Logger.logInfo('No local assets to preload - using vector icons');
    } catch (error) {
      await Logger.logError(error, { context: 'Asset Preloading' });
      await Logger.logInfo('Continuing app initialization despite asset loading errors');
    }
  }

  public async cacheAssets() {
    try {
      // No local assets to cache since we're using vector icons
      await Logger.logInfo('No local assets to cache - using vector icons');
    } catch (error) {
      await Logger.logError(error, { context: 'Asset Cache Initialization' });
      await Logger.logInfo('Continuing despite caching errors');
    }
  }

  public async clearAssetCache() {
    try {
      const cacheDirectory = `${FileSystem.cacheDirectory}assets/`;
      await FileSystem.deleteAsync(cacheDirectory, { idempotent: true });
      this.loadedAssets.clear();
      await Logger.logInfo('Asset cache cleared successfully');
    } catch (error) {
      await Logger.logError(error, { context: 'Clear Asset Cache' });
    }
  }
}

export default AssetLoader.getInstance(); 