import { Component, type ErrorInfo, type ReactNode } from "react";
import { Home, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServerErrorPageProps {
  onRetry?: () => void;
}

export function ServerErrorPage({ onRetry }: ServerErrorPageProps) {
  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <Zap className="h-10 w-10 text-amber-500 dark:text-amber-400" />

      <h1 className="mt-6 text-8xl leading-none font-black tracking-tighter text-amber-500 dark:text-amber-400">
        5<span className="inline-block -rotate-6 opacity-70">0</span>0
      </h1>

      <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Something went wrong
      </h2>

      <p className="mt-2 max-w-sm text-center text-gray-500 dark:text-gray-400">
        It's not you, it's us. Our servers hit a snag. Please try again in a
        moment.
      </p>

      <div className="mt-8 flex gap-3">
        <Button
          variant="default"
          size="lg"
          className="gap-2"
          onClick={handleRetry}
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <a href="/">
          <Button variant="outline" size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </a>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ServerErrorPage onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
