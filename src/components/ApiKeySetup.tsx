import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';

interface ApiKeySetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSuccess, onCancel }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Check if there's a stored API key on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('apiKey');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    try {
      setIsValidating(true);
      // Test the API key by making a simple request
      await api.getDashboardStats();
      return true;
    } catch (err) {
      console.error('API key validation failed:', err);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    setIsLoading(true);
    
    try {
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        // Save the API key
        api.setApiKey(apiKey);
        if (onSuccess) onSuccess();
      } else {
        setError('Invalid API key. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to validate API key. Please check your connection and try again.');
      console.error('API key validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">API Key Setup</h2>
      <p className="text-sm text-muted-foreground mb-6">
        To use all features of the application, please enter your API key below.
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
            API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            disabled={isLoading || isValidating}
            className="w-full"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Your API key is stored locally in your browser.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading || isValidating}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={!apiKey.trim() || isLoading || isValidating}
          >
            {isValidating ? 'Validating...' : 'Save API Key'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-muted/30 rounded-md">
        <h3 className="font-medium text-sm mb-2 flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          How to get an API key
        </h3>
        <ol className="text-xs text-muted-foreground list-decimal pl-5 space-y-1">
          <li>Log in to your account on our platform</li>
          <li>Navigate to the API Keys section in your account settings</li>
          <li>Generate a new API key or copy an existing one</li>
          <li>Paste the key in the field above</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiKeySetup;
