import React from 'react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // You can log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl mb-4">😵</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          <details className="text-left bg-gray-50 rounded-lg p-4 mb-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={resetError} variant="default">
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Query Error Boundary - Specialized for data fetching errors
 */
export function QueryErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback || QueryErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}

function QueryErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-6">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-4xl mb-2">🔌</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load data
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            We couldn&apos;t fetch the latest data. This might be due to network issues or server problems.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={resetError} variant="default" size="sm">
            Retry
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Component Error Boundary - For individual component errors
 */
export function ComponentErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback || ComponentErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}

function ComponentErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[120px] p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center space-y-3 max-w-xs">
        <div className="text-2xl">⚠️</div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Component Error
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            This component encountered an error and couldn&apos;t render properly.
          </p>
        </div>
        <Button onClick={resetError} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    </div>
  );
}