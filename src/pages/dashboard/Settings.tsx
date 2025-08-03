import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Save, Download, Upload, Shield, Bell, User, Palette, Sun, Moon, Monitor, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import ThemePreferences from '@/components/ThemePreferences';
import { clearAllLocalData, resetApplicationData, getStorageUsage } from '@/utils/clearLocalData';

const Settings = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Account Settings
    email: 'john.smith@email.com',
    password: '',
    newPassword: '',
    confirmPassword: '',

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    streakReminders: true,
    achievementAlerts: true,
    communityUpdates: false,

    // Privacy Settings
    profileVisibility: 'public',
    showStats: true,
    showAchievements: true,
    allowMessages: true,

    // Preferences
    language: 'en',
    timezone: 'UTC-8',
    difficultyPreference: 'mixed',
    practiceReminders: true,
    dailyChallengeTime: '09:00'
  });

  const [saving, setSaving] = useState<string | null>(null);
  const [dataUsage, setDataUsage] = useState({
    storage: 45, // MB
    maxStorage: 100, // MB
    problems: 143,
    submissions: 287,
    discussions: 12
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleSave = async (section: string) => {
    setSaving(section);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));

      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  const exportData = () => {
    const userData = {
      settings,
      dataUsage,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geniq-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Data exported successfully!');
  };

  const clearCache = () => {
    resetApplicationData();
    toast.success('Cache cleared successfully!');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This will reset the application to a fresh state.')) {
      clearAllLocalData();
      toast.success('All local data cleared successfully!');
      // Refresh the page to show the clean state
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would typically call delete API
      console.log('Account deletion requested');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-glow p-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">⚙️ Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">🔐 Account</TabsTrigger>
          <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
          <TabsTrigger value="privacy">🛡️ Privacy</TabsTrigger>
          <TabsTrigger value="preferences">⚡ Preferences</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="space-y-6">
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <Button
                  onClick={() => handleSave('account')}
                  className="btn-premium"
                  disabled={saving === 'account'}
                >
                  {saving === 'account' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Email
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={settings.password}
                    onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <Input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <Button
                  onClick={() => handleSave('password')}
                  className="btn-premium"
                  disabled={saving === 'password'}
                >
                  {saving === 'password' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="card-elevated p-6 border-destructive/30">
              <h3 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Logout from all devices</p>
                    <p className="text-sm text-muted-foreground">Sign out from all active sessions</p>
                  </div>
                  <Button onClick={handleLogout} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    🚪 Logout All
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button onClick={handleDeleteAccount} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    🗑️ Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="card-elevated p-6">
            <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'weeklyReport', label: 'Weekly Progress Report', description: 'Get weekly summary of your progress' },
                { key: 'streakReminders', label: 'Streak Reminders', description: 'Remind me to maintain my streak' },
                { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'Notify when I earn new achievements' },
                { key: 'communityUpdates', label: 'Community Updates', description: 'Updates from the GENIQ community' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                  />
                </div>
              ))}
              <Button
                onClick={() => handleSave('notifications')}
                className="btn-premium"
                disabled={saving === 'notifications'}
              >
                {saving === 'notifications' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Save Notifications
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card className="card-elevated p-6">
            <h3 className="text-xl font-semibold mb-4">Privacy & Visibility</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                <Select value={settings.profileVisibility} onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}>
                  <SelectTrigger className="input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">🌍 Public - Visible to everyone</SelectItem>
                    <SelectItem value="community">👥 Community - Visible to GENIQ users</SelectItem>
                    <SelectItem value="private">🔒 Private - Only visible to me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {[
                { key: 'showStats', label: 'Show Statistics', description: 'Display my coding stats on profile' },
                { key: 'showAchievements', label: 'Show Achievements', description: 'Display earned badges and achievements' },
                { key: 'allowMessages', label: 'Allow Messages', description: 'Let other users send me messages' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                  />
                </div>
              ))}
              <Button
                onClick={() => handleSave('privacy')}
                className="btn-premium"
                disabled={saving === 'privacy'}
              >
                {saving === 'privacy' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            {/* Theme Preferences */}
            <ThemePreferences />
            
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-4">App Preferences</h3>
              <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="de">🇩🇪 German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Preference</label>
                  <Select value={settings.difficultyPreference} onValueChange={(value) => setSettings({ ...settings, difficultyPreference: value })}>
                    <SelectTrigger className="input-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🔴 Hard</SelectItem>
                      <SelectItem value="mixed">🌈 Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Daily Challenge Time</label>
                  <Input
                    type="time"
                    value={settings.dailyChallengeTime}
                    onChange={(e) => setSettings({ ...settings, dailyChallengeTime: e.target.value })}
                    className="input-premium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Practice Reminders</p>
                  <p className="text-sm text-muted-foreground">Remind me to practice daily</p>
                </div>
                <Switch
                  checked={settings.practiceReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, practiceReminders: checked })}
                />
              </div>

              <Button
                onClick={() => handleSave('preferences')}
                className="btn-premium"
                disabled={saving === 'preferences'}
              >
                {saving === 'preferences' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>

              {/* Data Management Section */}
              <Card className="card-elevated p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Data Management</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span className="text-sm text-muted-foreground">
                        {dataUsage.storage}MB / {dataUsage.maxStorage}MB
                      </span>
                    </div>
                    <Progress value={(dataUsage.storage / dataUsage.maxStorage) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dataUsage.problems}</div>
                      <div className="text-sm text-muted-foreground">Problems Solved</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">{dataUsage.submissions}</div>
                      <div className="text-sm text-muted-foreground">Code Submissions</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-warning">{dataUsage.discussions}</div>
                      <div className="text-sm text-muted-foreground">Discussions</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <Button onClick={exportData} variant="outline" className="btn-premium">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button onClick={clearCache} variant="outline" className="btn-premium">
                      <Upload className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button onClick={clearAllData} variant="outline" className="btn-premium border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;