import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { DemoBanner } from './DemoBanner';
import { HeartPulse, ExternalLink, ShieldAlert } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            collapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Navigation */}
          <TopNav onOpenMobileMenu={() => setMobileOpen(true)} />

          {/* Page Outlet */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-800/80 bg-[#080d1a] py-6 px-4 sm:px-8 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">
                    Cardiac Health — Cardiovascular Risk Visualization & 3D Explorer
                  </div>
                  <div className="text-[11px] text-slate-400">
                    IIT Mandi Multimodal AI Hackathon 2026 • Track A: Cardiovascular Risk Visualization
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
                <Link to="/about" className="hover:text-cyan-300 transition-colors">
                  System Architecture
                </Link>
                <span>•</span>
                <Link to="/model-performance" className="hover:text-cyan-300 transition-colors">
                  Model Status
                </Link>
                <span>•</span>
                <Link to="/explainability" className="hover:text-cyan-300 transition-colors">
                  Explainability (XAI)
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Frontend Simulation Only
                </span>
              </div>
            </div>

            <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-400">
              CardioVision AI is an educational research demonstration interface. Not for clinical diagnostic use. Built purely with React, TypeScript, Three.js, React Three Fiber, Recharts & Tailwind CSS.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
