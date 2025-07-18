'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call the optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fantasy-themed error UI
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-[400px] flex items-center justify-center p-8"
        >
          <div className="fantasy-card fantasy-starfield w-full max-w-2xl mx-auto text-center">
            <div className="space-y-6">
              {/* Magical Error Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl mb-4"
              >
                🔮💥
              </motion.div>

              {/* Error Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="fantasy-heading text-2xl md:text-3xl text-red-300 mb-4"
              >
                A Magical Disturbance Has Occurred!
              </motion.h2>

              {/* Error Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="fantasy-body text-amber-200 mb-6"
              >
                The mystical energies have become unstable. Fear not, brave adventurer - 
                this is but a temporary setback in your quest!
              </motion.p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.details
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-left bg-slate-800/50 rounded-lg p-4 border border-slate-600/30"
                >
                  <summary className="cursor-pointer text-amber-300 font-medium mb-2">
                    🔍 Magical Diagnostic Information
                  </summary>
                  <div className="text-xs text-slate-300 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 overflow-auto text-xs bg-slate-900/50 p-2 rounded">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 overflow-auto text-xs bg-slate-900/50 p-2 rounded">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.details>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleReset}
                  className="
                    fantasy-button-primary px-6 py-3 rounded-lg font-medium
                    bg-gradient-to-r from-amber-600 to-yellow-600
                    hover:from-amber-500 hover:to-yellow-500
                    text-slate-900 shadow-lg
                    transition-all duration-300
                  "
                >
                  🔄 Restore Magical Balance
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="
                    fantasy-button-secondary px-6 py-3 rounded-lg font-medium
                    border-2 border-amber-600 text-amber-200
                    hover:bg-amber-600/10
                    transition-all duration-300
                  "
                >
                  🏠 Return to Sanctuary
                </motion.button>
              </motion.div>

              {/* Magical Divider */}
              <div className="fantasy-divider"></div>

              {/* Helpful Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="fantasy-secondary text-sm italic"
              >
                If this disturbance persists, the realm&apos;s guardians have been notified 
                and will investigate the magical anomaly.
              </motion.p>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}