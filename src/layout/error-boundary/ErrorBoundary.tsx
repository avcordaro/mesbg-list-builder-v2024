import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  inCaseOfError: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return this.props.inCaseOfError;
  }
}
