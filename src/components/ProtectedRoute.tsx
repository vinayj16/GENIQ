import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center">
        <Card className="card-glow p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Checking your authentication status</p>
        </Card>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center p-4">
        <Card className="card-glow p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4 text-gradient">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access the dashboard and its features.
          </p>
          <div className="space-y-3">
            <Link to="/auth" state={{ from: location.pathname }}>
              <Button className="w-full btn-hero">
                🚀 Sign In to Continue
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full btn-premium">
                🏠 Back to Home
              </Button>
            </Link>
          </div>
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>New to GENIQ?</strong> Create your free account to access:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• 🧠 AI-powered coding practice</li>
              <li>• 📊 Detailed analytics & progress tracking</li>
              <li>• 🎯 Company-specific interview prep</li>
              <li>• 💬 Community discussions & support</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;