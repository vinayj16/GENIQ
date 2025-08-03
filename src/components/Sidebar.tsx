import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/ui/logo';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const isActive = (path: string) => location.pathname === path;

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      section: 'Dashboard',
      items: [
        { name: 'Overview', path: '/dashboard', icon: '📊', badge: null },
        { name: 'Analytics', path: '/dashboard/analytics', icon: '📈', badge: 'New' },
      ]
    },
    {
      section: 'Practice',
      items: [
        { name: 'Coding Problems', path: '/dashboard/coding', icon: '💻', badge: null },
        { name: 'MCQs', path: '/dashboard/mcqs', icon: '📝', badge: null },
        { name: 'Mock Interviews', path: '/dashboard/face-to-face', icon: '🎤', badge: 'Pro' },
      ]
    },
    {
      section: 'Preparation',
      items: [
        { name: 'Resume Builder', path: '/dashboard/resume', icon: '📄', badge: 'AI' },
        { name: 'Reviews', path: '/dashboard/reviews', icon: '⭐', badge: null },
        { name: 'Roadmap', path: '/dashboard/roadmap', icon: '🗺️', badge: null },
      ]
    },
    {
      section: 'Community',
      items: [
        { name: 'Discussions', path: '/dashboard/discussions', icon: '💬', badge: null },
        { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: '🏆', badge: null },
      ]
    },
    {
      section: 'Account',
      items: [
        { name: 'Profile', path: '/dashboard/profile', icon: '👤', badge: null },
        { name: 'Settings', path: '/dashboard/settings', icon: '⚙️', badge: null },
      ]
    }
  ];

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'New': return 'bg-success/20 text-success border-success/30';
      case 'Pro': return 'bg-warning/20 text-warning border-warning/30';
      case 'AI': return 'bg-primary/20 text-primary border-primary/30';
      case 'Beta': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return '';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background border border-border"
        onClick={toggleMobile}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div className={`
        h-full bg-card border-r border-border transition-all duration-300 flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}
        md:relative fixed z-50
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between h-16">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!collapsed ? (
              <Logo size="md" variant="full" />
            ) : (
              <div className="w-full flex justify-center">
                <Logo size="md" variant="icon" />
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex h-8 w-8"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex h-8 w-8 absolute -right-3 top-1/2 -translate-y-1/2 bg-background border border-border rounded-full"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3">
        <nav className="space-y-6">
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-2">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      isActive(item.path) 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.name}</span>}
                    {item.badge && !collapsed && (
                      <Badge variant="outline" className="ml-auto text-xs shrink-0">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        {!collapsed && (
          <div className="mt-8 p-4 bg-gradient-card border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">Pro Member</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span>Problems Solved:</span>
                <span className="text-success font-medium">143</span>
              </div>
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="text-warning font-medium">7 days</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Weekly Goal:</span>
                  <span className="text-primary font-medium">65%</span>
                </div>
                <Progress value={65} className="h-1" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Sidebar;