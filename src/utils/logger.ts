import { Platform } from 'react-native';

interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
}

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
  deviceInfo?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  static readonly LEVELS: LogLevel = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
  };

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async getDeviceInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      isPad: Platform.isPad,
      isTV: Platform.isTV,
      constants: Platform.constants,
    };
  }

  private async log(level: string, message: string, data?: any, context?: string) {
    try {
      const deviceInfo = await this.getDeviceInfo();
      
      const logEntry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
        data,
        deviceInfo,
      };

      this.logs.push(logEntry);

      // Keep only the last MAX_LOGS entries
      if (this.logs.length > this.MAX_LOGS) {
        this.logs = this.logs.slice(-this.MAX_LOGS);
      }

      // Console output for development
      if (__DEV__) {
        const logMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
        console[logMethod](`[${level.toUpperCase()}] ${message}`, data || '');
      }

      // In production, you might want to send logs to a service
      if (!__DEV__ && level === 'error') {
        // Send error logs to your analytics service
        // await this.sendToAnalytics(logEntry);
      }
    } catch (error) {
      console.error('Logger error:', error);
    }
  }

  async logDebug(message: string, data?: any, context?: string) {
    await this.log(Logger.LEVELS.DEBUG, message, data, context);
  }

  async logInfo(message: string, data?: any, context?: string) {
    await this.log(Logger.LEVELS.INFO, message, data, context);
  }

  async logWarn(message: string, data?: any, context?: string) {
    await this.log(Logger.LEVELS.WARN, message, data, context);
  }

  async logError(error: any, data?: any, context?: string) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorData = {
      ...data,
      error: {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      },
    };
    await this.log(Logger.LEVELS.ERROR, errorMessage, errorData, context);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  async exportLogs(): Promise<string> {
    try {
      const deviceInfo = await this.getDeviceInfo();
      const exportData = {
        logs: this.logs,
        exportTimestamp: new Date().toISOString(),
        deviceInfo,
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export logs:', error);
      return JSON.stringify({ error: 'Failed to export logs' });
    }
  }

  async logPerformance(operation: string, duration: number, data?: any) {
    await this.logInfo(`Performance: ${operation} took ${duration}ms`, data, 'performance');
  }

  async logNavigation(from: string, to: string, data?: any) {
    await this.logInfo(`Navigation: ${from} → ${to}`, data, 'navigation');
  }

  async logUserAction(action: string, data?: any) {
    await this.logInfo(`User Action: ${action}`, data, 'user-action');
  }

  async logApiCall(endpoint: string, method: string, status: number, duration: number, data?: any) {
    const deviceInfo = await this.getDeviceInfo();
    await this.logInfo(`API Call: ${method} ${endpoint} (${status}) - ${duration}ms`, {
      ...data,
      endpoint,
      method,
      status,
      duration,
      deviceInfo,
    }, 'api');
  }
}

export default Logger.getInstance(); 