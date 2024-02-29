import React, { ReactNode } from "react";
import Link from "../shared/Link";

type ErrorBoundaryProps = {
  children?: ReactNode;
  fallback?: ReactNode;
};
type ErrorBoundaryStateType = {
  hasError: boolean;
  error?: Error;
  stackVisible: boolean;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryStateType
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined, stackVisible: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryStateType {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, stackVisible: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  resetState() {
    this.setState({ hasError: false, error: undefined, stackVisible: false });
  }

  getDefaultErrorComponent(): ReactNode {
    return (
      <div className="border-red-500 border-[10px] text-sm rounded-md p-4 text-red-500 bg-pink-200 m-4">
        <h3 className="font-semibold">
          There was an error while loading the application:
        </h3>
        {this.state.error!.message}
        {!this.state.stackVisible && (
          <a
            className="py-2  block underline"
            href="#"
            onClick={() =>
              this.setState(() => ({
                ...this.state,
                stackVisible: !this.state.stackVisible,
              }))
            }>
            View stack
          </a>
        )}
        {this.state.stackVisible && (
          <div className="py-2 text-xs">{this.state.error?.stack}</div>
        )}
        <Link to="/" onClick={() => this.resetState()}>
          Back
        </Link>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || this.getDefaultErrorComponent();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
