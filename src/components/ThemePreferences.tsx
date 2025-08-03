import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemePreferences: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
      preview: 'bg-white border-gray-200 text-gray-900'
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700 text-white'
    },
    {
      value: 'system' as const,
      label: 'System',
      description: 'Follow system preference',
      icon: Monitor,
      preview: actualTheme === 'dark' 
        ? 'bg-gray-900 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Theme Appearance
        </CardTitle>
        <CardDescription>
          Choose your preferred theme for the entire application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.value;
            
            return (
              <div
                key={themeOption.value}
                className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setTheme(themeOption.value)}
              >
                {/* Preview */}
                <div className={`h-24 rounded-t-md border-b ${themeOption.preview} flex items-center justify-center relative overflow-hidden`}>
                  {/* Mock UI elements */}
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-current opacity-20"></div>
                  <div className="absolute top-2 right-2 w-8 h-2 rounded bg-current opacity-20"></div>
                  <div className="absolute bottom-2 left-2 w-12 h-2 rounded bg-current opacity-30"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-2 rounded bg-current opacity-30"></div>
                  
                  <Icon className="h-8 w-8 opacity-60" />
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4" />
                    <h3 className="font-medium">{themeOption.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {themeOption.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Current theme info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Current Theme</p>
              <p className="text-sm text-muted-foreground">
                {theme === 'system' 
                  ? `System (${actualTheme})` 
                  : theme.charAt(0).toUpperCase() + theme.slice(1)
                }
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Toggle between light and dark for quick switching
                const nextTheme = actualTheme === 'light' ? 'dark' : 'light';
                setTheme(nextTheme);
              }}
            >
              Toggle Theme
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemePreferences;