import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Mettre à jour l'état pour que le prochain rendu affiche l'UI de secours
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // On peut également enregistrer l'erreur dans un service de reporting
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Appeler le callback onError si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // On peut rendre n'importe quelle UI de secours
      return (
        this.props.fallback || (
          <div style={{ padding: "1rem", color: "red" }}>
            Une erreur s'est produite lors du chargement du composant.
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
