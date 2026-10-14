import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  HeartPulse,
  Sparkles,
  ClipboardPlus,
  ChevronDown,
  UserCheck,
  RotateCcw,
  LogOut,
  User,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';
import { useAuth } from '../../context/AuthContext';

interface TopNavProps {
  onOpenMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentAssessment, currentResult, loadPreset, resetCurrentAssessment } = useAssessment();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Derive current title
  const getPageTitle = (path: string) => {
    if (path.startsWith('/reports/')) {
      return { title: 'Clinical Assessment Report', subtitle: 'Persistent Model Predictions & Anatomical Territory Mapping' };
    }
    switch (path) {
      case '/':
        return { title: 'Overview & Mission', subtitle: 'IIT Mandi Multimodal AI Hackathon 2026' };
      case '/dashboard':
        return { title: 'Clinician Dashboard', subtitle: 'Personalized Cohort Overview & Model Readiness' };
      case '/assessment':
        return { title: 'New Clinical Assessment', subtitle: 'Structured Patient Physiological Data Input' };
      case '/predictions':
        return { title: 'Prediction Dashboard', subtitle: 'Multi-Target CAD & Coronary Artery Outcomes' };
      case '/heart-3d':
        return { title: 'Interactive 3D Heart Explorer', subtitle: 'Anatomical Coronary Arterial Mesh Mapping' };
      case '/explainability':
        return { title: 'Explainable AI Interface', subtitle: 'Local & Global Feature Attributions (XAI)' };
      case '/model-performance':
        return { title: 'Model Performance & Evaluation', subtitle: 'Diagnostic Metrics & Honest Validation Status' };
      case '/history':
        return { title: 'Assessment History & Case Logs', subtitle: 'Persistent Clinical Records' };
      case '/about':
        return { title: 'About & Documentation', subtitle: 'System Architecture, Specifications & Future Work' };
      case '/login':
        return { title: 'Clinician Sign In', subtitle: 'Secure Account Authentication' };
      case '/register':
        return { title: 'Create Clinical Account', subtitle: 'New User Registration' };
      default:
        return { title: 'Cardiac Health', subtitle: 'Cardiovascular Risk Visualization & 3D Explorer' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Hamburger & Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <span className="text-[11px] text-slate-400 hidden sm:inline truncate max-w-md">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right: User Menu, Presets, Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Load Preset Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all"
            aria-expanded={presetDropdownOpen}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Load Demo Preset</span>
            <span className="sm:hidden">Presets</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {presetDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setPresetDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Select Synthetic Patient Profile
              </div>

              <button
                onClick={() => {
                  loadPreset(0);
                  setPresetDropdownOpen(false);
                  navigate('/predictions');
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200"
              >
                <div>
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Patient Alpha (High Risk)
                  </div>
                  <div className="text-[11px] text-slate-400">Age 63, Smoker, ST-T Abnormality</div>
                </div>
              </button>

              <button
                onClick={() => {
                  loadPreset(1);
                  setPresetDropdownOpen(false);
                  navigate('/predictions');
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200"
              >
                <div>
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Patient Beta (Moderate LAD)
                  </div>
                  <div className="text-[11px] text-slate-400">Age 54, Ex-smoker, Exertional Angina</div>
                </div>
              </button>

              <button
                onClick={() => {
                  loadPreset(2);
                  setPresetDropdownOpen(false);
                  navigate('/predictions');
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200"
              >
                <div>
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Patient Gamma (Low Risk)
                  </div>
                  <div className="text-[11px] text-slate-400">Age 38, Active, Normal Biomarkers</div>
                </div>
              </button>

              <div className="border-t border-slate-800 mt-1 pt-1 px-3">
                <button
                  onClick={() => {
                    resetCurrentAssessment();
                    setPresetDropdownOpen(false);
                  }}
                  className="w-full text-left py-1 text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  Clear Assessment State
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Nav to Assessment */}
        <button
          onClick={() => navigate('/assessment')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm"
        >
          <ClipboardPlus className="w-3.5 h-3.5" />
          <span>New Assessment</span>
        </button>

        {/* User Account / Auth Section */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-xs text-white transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-[11px]">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="font-semibold hidden lg:inline truncate max-w-[120px]">
                {user.full_name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="font-bold text-xs text-white truncate">{user.full_name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Assessment History
                </Link>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
