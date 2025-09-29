import React, { useState } from 'react';
import { Search, Settings, User, Home, Library, Sprout, Vault, Brain, FileText, Menu, X, Plus, BarChart3, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NotificationBadge } from './NotificationBadge';
import { AddContentModal } from './AddContentModal';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import elephantLogo from 'figma:asset/ff2a61072b843a1228443925a58bf83eddcf7e51.png';

interface HeaderProps {
  currentView?: string;
  onNavigateToHome?: () => void;
  onNavigateToLibrary?: () => void;
  onNavigateToMyContent?: () => void;
  onNavigateToConceptVault?: () => void;
  onNavigateToStats?: () => void;
}

export function Header({ currentView, onNavigateToHome, onNavigateToLibrary, onNavigateToMyContent, onNavigateToConceptVault, onNavigateToStats }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      onClick: onNavigateToHome, 
      active: currentView === 'home' 
    },
    { 
      id: 'library', 
      label: 'Library', 
      icon: Library, 
      onClick: onNavigateToMyContent, // Default to My Content
      active: currentView === 'my-content' || currentView === 'concept-vault' 
    },
    { 
      id: 'stats', 
      label: 'Stats', 
      icon: BarChart3, 
      onClick: onNavigateToStats, 
      active: currentView === 'stats' 
    },

  ];

  const handleMobileNavClick = (onClick?: () => void) => {
    if (onClick) onClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#2050B3' }}>
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={elephantLogo} alt="Learn Better" className="w-12 h-12" />
            <h1 className="text-2xl tracking-tight text-white">Learn Better</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              
              // Special handling for Library item with dropdown
              if (item.id === 'library') {
                return (
                  <HoverCard key={item.id} openDelay={150} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={item.onClick}
                        className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-200 text-white/90 hover:text-white hover:bg-white/10 ${
                          item.active 
                            ? 'bg-white/20 text-white shadow-sm' 
                            : ''
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent 
                      className="w-56 p-2 bg-white shadow-lg border border-border/20" 
                      side="bottom" 
                      align="start"
                      sideOffset={8}
                    >
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          onClick={onNavigateToMyContent}
                          className={`w-full justify-start text-left rounded-lg hover:bg-muted/50 transition-colors ${
                            currentView === 'my-content' ? 'bg-muted text-primary' : ''
                          }`}
                        >
                          <BookOpen className="w-4 h-4 mr-3" />
                          My Content
                          <span className="text-xs text-muted-foreground ml-auto">⌘L</span>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={onNavigateToConceptVault}
                          className={`w-full justify-start text-left rounded-lg hover:bg-muted/50 transition-colors ${
                            currentView === 'concept-vault' ? 'bg-muted text-primary' : ''
                          }`}
                        >
                          <Lightbulb className="w-4 h-4 mr-3" />
                          My Concept Vault
                          <span className="text-xs text-muted-foreground ml-auto">⌘⇧R</span>
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              }
              
              // Regular navigation items
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={item.onClick}
                  className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-200 text-white/90 hover:text-white hover:bg-white/10 ${
                    item.active 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Add Content */}
            <div className="hidden lg:block">
              <AddContentModal />
            </div>

            {/* Notifications */}
            <NotificationBadge />

            {/* Settings - Desktop */}
            <Button variant="ghost" size="sm" className="hidden lg:flex rounded-xl hover:bg-white/10 text-white/90 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Avatar */}
            <Avatar className="h-9 w-9 ring-2 ring-white/20">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-white/10 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden rounded-xl text-white/90 hover:text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 space-y-3">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    
                    // Special handling for Library item in mobile
                    if (item.id === 'library') {
                      return (
                        <div key={item.id} className="space-y-2">
                          <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                            Library
                          </div>
                          <div className="space-y-1 pl-3">
                            <Button
                              variant={currentView === 'my-content' ? 'default' : 'ghost'}
                              className="w-full justify-start flex items-center space-x-3 rounded-xl h-10"
                              onClick={() => handleMobileNavClick(onNavigateToMyContent)}
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>My Content</span>
                            </Button>
                            <Button
                              variant={currentView === 'concept-vault' ? 'default' : 'ghost'}
                              className="w-full justify-start flex items-center space-x-3 rounded-xl h-10"
                              onClick={() => handleMobileNavClick(onNavigateToConceptVault)}
                            >
                              <Lightbulb className="w-4 h-4" />
                              <span>My Concept Vault</span>
                            </Button>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <Button
                        key={item.id}
                        variant={item.active ? 'default' : 'ghost'}
                        className="w-full justify-start flex items-center space-x-3 rounded-xl h-12"
                        onClick={() => handleMobileNavClick(item.onClick)}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Button>
                    );
                  })}
                  
                  {/* Mobile-only items */}
                  <div className="pt-4 space-y-3 border-t border-slate-200">
                    <AddContentModal />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}