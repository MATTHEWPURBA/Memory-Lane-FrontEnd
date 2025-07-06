import { Platform } from 'react-native';
import { DeviceInfo } from '@/utils/PlatformComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  deviceInfo?: any;
  metadata?: any;
  error?: Error;
  networkInfo?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;
  private isDebugMode = __DEV__;

  private constructor() {
    this.setupGlobalErrorHandler();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async getDeviceInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      appVersion: await DeviceInfo.getVersion(),
      buildNumber: await DeviceInfo.getBuildNumber(),
      deviceModel: await DeviceInfo.getModel(),
      systemVersion: await DeviceInfo.getSystemVersion(),
      deviceId: await DeviceInfo.getUniqueId(),
      manufacturer: await DeviceInfo.getManufacturer(),
      brand: await DeviceInfo.getBrand(),
      memoryUsage: await DeviceInfo.getUsedMemory(),
      totalMemory: await DeviceInfo.getTotalMemory(),
      freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
      batteryLevel: await DeviceInfo.getBatteryLevel(),
    };
  }

  private async getNetworkInfo() {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
      details: state.details,
    };
  }

  private setupGlobalErrorHandler() {
    ErrorUtils.setGlobalHandler(async (error: Error, isFatal?: boolean) => {
      await this.logError(error, { isFatal });
    });
  }

  private async persistLogs() {
    try {
      await AsyncStorage.setItem('app_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to persist logs:', error);
    }
  }

  public async loadPersistedLogs() {
    try {
      const persistedLogs = await AsyncStorage.getItem('app_logs');
      if (persistedLogs) {
        this.logs = JSON.parse(persistedLogs);
      }
    } catch (error) {
      console.error('Failed to load persisted logs:', error);
    }
  }

  private async addLogEntry(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }
    await this.persistLogs();

    // In development, also log to console
    if (this.isDebugMode) {
      switch (entry.level) {
        case 'debug':
          console.debug(entry.message, entry.metadata);
          break;
        case 'info':
          console.info(entry.message, entry.metadata);
          break;
        case 'warn':
          console.warn(entry.message, entry.metadata);
          break;
        case 'error':
        case 'fatal':
          console.error(entry.message, entry.error, entry.metadata);
          break;
      }
    }
  }

  public async logDebug(message: string, metadata?: any) {
    await this.addLogEntry({
      level: 'debug',
      message,
      timestamp: Date.now(),
      metadata,
    });
  }

  public async logInfo(message: string, metadata?: any) {
    await this.addLogEntry({
      level: 'info',
      message,
      timestamp: Date.now(),
      metadata,
    });
  }

  public async logWarning(message: string, metadata?: any) {
    await this.addLogEntry({
      level: 'warn',
      message,
      timestamp: Date.now(),
      metadata,
    });
  }

  public async logError(error: Error, metadata?: any) {
    const deviceInfo = await this.getDeviceInfo();
    const networkInfo = await this.getNetworkInfo();

    await this.addLogEntry({
      level: 'error',
      message: error.message,
      timestamp: Date.now(),
      deviceInfo,
      networkInfo,
      error,
      metadata,
    });
  }

  public async logFatal(error: Error, metadata?: any) {
    const deviceInfo = await this.getDeviceInfo();
    const networkInfo = await this.getNetworkInfo();

    await this.addLogEntry({
      level: 'fatal',
      message: error.message,
      timestamp: Date.now(),
      deviceInfo,
      networkInfo,
      error,
      metadata,
    });
  }

  public async logNavigationEvent(screenName: string, params?: any) {
    await this.logInfo(`Navigation: ${screenName}`, { screen: screenName, params });
  }

  public async logApiRequest(endpoint: string, method: string, status?: number, error?: Error) {
    const metadata = {
      endpoint,
      method,
      status,
      timestamp: new Date().toISOString(),
    };

    if (error) {
      await this.logError(error, metadata);
    } else {
      await this.logInfo(`API ${method} ${endpoint}`, metadata);
    }
  }

  public async logAppStart() {
    const deviceInfo = await this.getDeviceInfo();
    const networkInfo = await this.getNetworkInfo();

    await this.logInfo('App started', {
      deviceInfo,
      networkInfo,
      timestamp: new Date().toISOString(),
    });
  }

  public async logAppError(error: Error, componentStack?: string) {
    const deviceInfo = await this.getDeviceInfo();
    const networkInfo = await this.getNetworkInfo();

    await this.logError(error, {
      componentStack,
      deviceInfo,
      networkInfo,
      timestamp: new Date().toISOString(),
    });
  }

  public getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = level ? this.logs.filter(log => log.level === level) : this.logs;
    return limit ? filteredLogs.slice(-limit) : filteredLogs;
  }

  public async clearLogs() {
    this.logs = [];
    await AsyncStorage.removeItem('app_logs');
  }

  public setDebugMode(enabled: boolean) {
    this.isDebugMode = enabled;
  }
}

export default Logger.getInstance(); 