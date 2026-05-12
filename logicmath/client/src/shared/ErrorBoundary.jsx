import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-red-900/20 border border-red-500/40 text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-red-400 font-bold mb-1">Помилка рендерингу задачі</p>
          <p className="text-slate-400 text-sm font-mono">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg"
          >
            Спробувати знову
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
