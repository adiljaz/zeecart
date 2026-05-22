import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-bg">
          <div className="text-center">
            <h1 className="text-4xl font-playfair mb-4 text-red-600">Something went wrong</h1>
            <p className="text-gray-600 mb-8">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
