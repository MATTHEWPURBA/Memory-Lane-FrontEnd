import { Platform } from 'react-native';

interface ErrorReport {
  error: {
    message: string;
    stack?: string;
    name?: string;
  };
  timestamp: string;
  context?: string;
  deviceInfo: any;
  userInfo?: any;
  additionalData?: any;
}

class ErrorReporter {
  private static instance: ErrorReporter;

  private constructor() {}

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
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

  async reportError(
    error: Error,
    context?: string,
    userInfo?: any,
    additionalData?: any
  ): Promise<void> {
    try {
      const deviceInfo = await this.getDeviceInfo();
      
      const errorReport: ErrorReport = {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        timestamp: new Date().toISOString(),
        context,
        deviceInfo,
        userInfo,
        additionalData,
      };

      // In development, log to console
      if (__DEV__) {
        console.error('Error Report:', errorReport);
      }

      // In production, send to your error reporting service
      if (!__DEV__) {
        // await this.sendToErrorService(errorReport);
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  async reportWarning(
    message: string,
    context?: string,
    userInfo?: any,
    additionalData?: any
  ): Promise<void> {
    try {
      const deviceInfo = await this.getDeviceInfo();
      
      const warningReport: ErrorReport = {
        error: {
          message,
          name: 'Warning',
        },
        timestamp: new Date().toISOString(),
        context,
        deviceInfo,
        userInfo,
        additionalData,
      };

      // In development, log to console
      if (__DEV__) {
        console.warn('Warning Report:', warningReport);
      }

      // In production, send to your error reporting service
      if (!__DEV__) {
        // await this.sendToErrorService(warningReport);
      }
    } catch (reportingError) {
      console.error('Failed to report warning:', reportingError);
    }
  }

  setupGlobalErrorHandler(): void {
    if (typeof ErrorUtils !== 'undefined') {
      ErrorUtils.setGlobalHandler(async (error: Error, isFatal?: boolean) => {
        await this.reportError(error, 'Global Error Handler', { isFatal });
      });
    }
  }
}

export default ErrorReporter.getInstance(); 