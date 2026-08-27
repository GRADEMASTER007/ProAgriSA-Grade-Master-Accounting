import React from 'react';
import {
  Sprout,
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Receipt,
  Truck,
  Sparkles,
  BookOpen,
  Settings,
  Search,
  LogIn,
  LogOut,
  UserCheck,
  RotateCcw,
  Building,
  Layers,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { useApp } from '../lib/store';

export type NavSection =
  | 'dashboard'
  | 'clients'
  | 'products'
  | 'quotes'
  | 'invoices'
  | 'shipping'
  | 'ai-assistant'
  | 'whatsapp-inbox' | 'email-inbox'
  | 'knowledge'
  | 'company-settings'
  | 'settings';

interface NavbarProps {
  activeSection: NavSection;
  onSelectSection?: (section: NavSection) => void;
  onNavigate?: (section: NavSection) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  onNavigate,
  onOpenSearch,
}) => {
  const { companySettings, user, signInWithGoogle, logout, resetToDefaults, clients, products, quotes, invoices, shippingRates } = useApp();

  const handleNavigate = (sec: NavSection) => {
    // Normalize settings alias
    const target = sec === 'settings' ? 'company-settings' : sec;
    if (onNavigate) {
      onNavigate(target);
    }
    if (onSelectSection) {
      onSelectSection(target);
    }
  };

  const navItems: Array<{
    id: NavSection;
    label: string;
    icon: any;
    count?: number;
    highlight?: boolean;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users, count: clients.length },
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'quotes', label: 'Quotes', icon: FileText, count: quotes.length },
    { id: 'invoices', label: 'Invoices', icon: Receipt, count: invoices.length },
    { id: 'shipping', label: 'Shipping', icon: Truck, count: shippingRates.length },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, highlight: true },
    { id: 'whatsapp-inbox', label: 'WhatsApp Inbox', icon: MessageSquare },
    { id: 'email-inbox', label: 'Email Inbox', icon: Mail },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'company-settings', label: 'Company Settings', icon: Settings },
  ];

  const isCurrentActive = (itemId: NavSection) => {
    if (itemId === 'company-settings' || itemId === 'settings') {
      return activeSection === 'company-settings' || activeSection === 'settings';
    }
    return activeSection === itemId;
  };

  return (
    <header className="bg-[#0E1118] text-[#F3F4F6] border-b border-[#1F2430] sticky top-0 z-40 shadow-xl shadow-black/50">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Interactive Home Button */}
          <div
            id="brand-header-logo"
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
            title="Return to Executive Dashboard"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#11141D] flex items-center justify-center border border-[#EAB308]/40 shadow-[0_0_12px_rgba(234,179,8,0.2)] group-hover:border-[#EAB308] group-hover:shadow-[0_0_16px_rgba(234,179,8,0.35)] transition-all overflow-hidden p-1">
              {companySettings.logoUrl ? (
                <img
                  src={companySettings.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Sprout className="w-5 h-5 text-[#EAB308]" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white font-mono group-hover:text-yellow-200 transition-colors">
                  {companySettings.companyName || 'Healthy Fields Business Hub'}
                </span>
                <span className="text-[9px] bg-gradient-to-r from-yellow-950 to-yellow-900 text-[#EAB308] border border-#EAB308/50 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider hidden sm:inline-block">
                  PRO v2.5
                </span>
              </div>
              <p className="text-[10px] text-[#9CA3AF] font-mono tracking-wide hidden sm:block">
                Healthy Fields & ProAgriSA Multi-Entity Agricultural Hub
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Spotlight Search Launcher */}
            <button
              id="nav-search-button"
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs bg-[#151924] hover:bg-[#1E2536] text-[#9CA3AF] hover:text-[#D1D5DB] border border-[#252D3D] transition-colors shadow-sm"
              title="Search database (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#EAB308]" />
              <span className="hidden md:inline font-mono text-[11px]">Quick Search</span>
              <kbd className="hidden md:inline bg-[#0A0B0E] text-[#9CA3AF] px-1.5 py-0.2 rounded text-[9px] font-mono border border-[#252D3D]">
                ⌘K
              </kbd>
            </button>

            {/* AI Assistant Quick Launcher */}
            <button
              id="nav-ask-ai-quick-btn"
              onClick={() => handleNavigate('ai-assistant')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                activeSection === 'ai-assistant'
                  ? 'bg-[#EAB308] text-black border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                  : 'bg-yellow-950/70 hover:bg-yellow-950/90 text-[#EAB308] border-yellow-700/60 shadow-sm'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-current" />
              <span className="hidden xs:inline">AI Copilot</span>
            </button>

            {/* Owner Authentication Status */}
            {user ? (
              <div className="flex items-center space-x-2 bg-[#151924] px-2.5 py-1.5 rounded-lg border border-[#252D3D]">
                <UserCheck className="w-3.5 h-3.5 text-[#EAB308]" />
                <span className="text-[11px] font-mono text-[#D1D5DB] hidden lg:inline truncate max-w-[120px]">
                  {user.email || 'Owner'}
                </span>
                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  className="text-xs text-[#9CA3AF] hover:text-white ml-1 p-0.5 rounded hover:bg-[#1F2937]"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="nav-signin-google-btn"
                onClick={signInWithGoogle}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#151924] hover:bg-[#1E2536] text-[#D1D5DB] border border-[#252D3D] transition-colors font-mono"
                title="Sync with Firebase Cloud Firestore"
              >
                <LogIn className="w-3.5 h-3.5 text-[#EAB308]" />
                <span className="hidden md:inline">Sync Cloud</span>
              </button>
            )}

            {/* Reset Data Button */}
            <button
              id="nav-reset-data-btn"
              onClick={resetToDefaults}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1E2536] border border-[#252D3D] transition-colors"
              title="Reset System to Factory Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Sub-bar */}
      <div className="bg-[#0A0B0E] border-t border-[#191F2D] overflow-x-auto scrollbar-none">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6">
          <nav className="flex space-x-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentActive(item.id);

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                    isActive
                      ? item.highlight
                        ? 'bg-[#EAB308] text-black font-bold border-yellow-200 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                        : 'bg-[#182030] text-white font-bold border-[#EAB308]/50 shadow-sm'
                      : item.highlight
                      ? 'text-[#EAB308] hover:text-yellow-200 hover:bg-[#151924] border-yellow-800/40 bg-yellow-950/30'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#131722] border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive && item.highlight
                        ? 'text-black'
                        : item.highlight
                        ? 'text-[#EAB308]'
                        : isActive
                        ? 'text-[#EAB308]'
                        : 'text-[#6B7280]'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-yellow-950/80 text-[#EAB308] border border-yellow-800/50'
                          : 'bg-[#151924] text-[#6B7280] border border-[#222938]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
