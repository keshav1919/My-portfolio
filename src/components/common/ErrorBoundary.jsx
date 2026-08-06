import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error('Unexpected render error:', error); }
  render() {
    if (this.state.hasError) {
      return <main className="fatal-error"><h1>Something went wrong</h1><p>Please reload the app. Your saved theme preference is safe.</p><button className="button button--primary" onClick={() => window.location.reload()}>Reload app</button></main>;
    }
    return this.props.children;
  }
}
