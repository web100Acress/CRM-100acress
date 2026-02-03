import React from 'react';
import { twMerge } from 'tailwind-merge';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (import.meta.env?.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Log error to service in production
    if (import.meta.env?.PROD) {
      // You can integrate with error logging services like Sentry, LogRocket, etc.
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Implement error logging service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
    console.error('Error logged to service:', error, errorInfo);
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom error fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          reset: this.handleReset
        });
      }

      return (
        <div className={twMerge('min-h-screen flex items-center justify-center bg-gray-50', this.props.className)}>
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Error Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h2>

              {/* Error Description */}
              <p className="text-gray-600 mb-6">
                {this.props.message || 'An unexpected error occurred. Please try again later.'}
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env?.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details
                  </summary>
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs text-gray-800 overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Error:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reload Page
                </button>
              </div>

              {/* Support Info */}
              {this.props.showSupport && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    If the problem persists, please contact our support team.
                  </p>
                  <a
                    href="mailto:support@company.com"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    support@company.com
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Boundary with specific error types
export class NetworkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg
                className="h-8 w-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Network Error
            </h2>
            
            <p className="text-gray-600 mb-6">
              Unable to connect to the server. Please check your internet connection and try again.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with ErrorBoundary
export const withErrorBoundary = (Component, fallbackProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...fallbackProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;
