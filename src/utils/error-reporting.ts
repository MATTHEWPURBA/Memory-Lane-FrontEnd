import { Platform } from 'react-native';
import { DeviceInfo } from './PlatformComponents';

class ErrorReporting {
  private static instance: ErrorReporting;
  private errors: Array<{
    error: Error;
    componentStack?: string;
    timestamp: number;
    deviceInfo: any;
  }> = [];

  private constructor() {
    // Initialize error reporting
    this.setupErrorHandlers();
  }

  public static getInstance(): ErrorReporting {
    if (!ErrorReporting.instance) {
      ErrorReporting.instance = new ErrorReporting();
    }
    return ErrorReporting.instance;
  }

  private async getDeviceInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      appVersion: await DeviceInfo.getVersion(),
      buildNumber: await DeviceInfo.getBuildNumber(),
      deviceModel: await DeviceInfo.getModel(),
      systemVersion: await DeviceInfo.getSystemVersion(),
    };
  }

  private setupErrorHandlers() {
    // Handle uncaught JS errors
    ErrorUtils.setGlobalHandler(async (error: Error, isFatal?: boolean) => {
      await this.reportError(error, undefined, isFatal);
    });
  }

  public async reportError(
    error: Error,
    componentStack?: string,
    isFatal: boolean = false
  ) {
    try {
      const deviceInfo = await this.getDeviceInfo();
      const errorReport = {
        error,
        componentStack,
        timestamp: Date.now(),
        deviceInfo,
        isFatal,
      };

      this.errors.push(errorReport);

      // In production, you would send this to your error reporting service
      console.error('Error Report:', {
        message: error.message,
        stack: error.stack,
        componentStack,
        deviceInfo,
        isFatal,
      });

      // Keep only the last 10 errors
      if (this.errors.length > 10) {
        this.errors.shift();
      }
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  }

  public getRecentErrors() {
    return this.errors;
  }

  public clearErrors() {
    this.errors = [];
  }
}

export default ErrorReporting; 