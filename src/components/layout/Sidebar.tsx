import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  LayoutDashboard,
  ClipboardPlus,
  Activity,
  HeartPulse,
  BrainCircuit,
  Gauge,
  History,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  X,
  LogIn,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { to: '/', label: 'Overview', icon: Home, badge: 'Home' },
    ...(isAuthenticated
      ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Private' }]
      : []),
    { to: '/assessment', label: 'New Assessment', icon: ClipboardPlus, badge: 'Clinical' },
    { to: '/predictions', label: 'Prediction Results', icon: Activity, badge: 'Multi-Target' },
    { to: '/heart-3d', label: '3D Heart Explorer', icon: HeartPulse, badge: 'Interactive' },
    { to: '/explainability', label: 'Explainable AI', icon: BrainCircuit, badge: 'XAI' },
    { to: '/model-performance', label: 'Model Performance', icon: Gauge, badge: 'UCI #411' },
    { to: '/history', label: 'Assessment Reports', icon: History, badge: 'Database' },
    { to: '/about', label: 'Documentation', icon: Info, badge: 'Docs' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b101d] border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#090d18]">
          <NavLink
            to="/"
            className="flex items-center gap-3 overflow-hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <HeartPulse className="w-6 h-6 text-white animate-heartbeat" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  Cardiac Health
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  Understand. Explore.
                </span>
              </div>
            )}
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            {!collapsed ? 'Clinical Navigation' : 'Nav'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wide ${
                          isActive
                            ? 'bg-cyan-500/30 text-cyan-200'
                            : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip on collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-slate-200 text-xs font-semibold rounded-md shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Hackathon Track Tag */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1 text-[11px]">
              <Stethoscope className="w-3.5 h-3.5" />
              IIT Mandi Hackathon 2026
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Track A: Cardiovascular Risk Visualization & Interactive 3D Heart
            </p>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-slate-800/80 bg-[#090d18]">
          {!collapsed && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-semibold text-slate-300">FastAPI ML Active</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors ${
              collapsed ? 'mx-auto' : ''
            }`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
