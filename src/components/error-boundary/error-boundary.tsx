"use client";

import { ReactNode, Component } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { error: false };
  }

  public componentDidCatch() {
    this.setState({ error: true });
  }

  public render() {
    const { error } = this.state;
    const { children } = this.props;

    return error ? (
      <div>
        <h1 className="text-center"> Oops...Something went wrong.</h1>
      </div>
    ) : (
      <>{children} </>
    );
  }
}
