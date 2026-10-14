import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Center } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { HeartModel } from './HeartModel';
import { HeartFallback2D } from './HeartFallback2D';
import { PredictionTargetId, TargetPredictionOutput } from '../../types/prediction';
import {
  RotateCcw,
  Play,
  Pause,
  Compass,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
} from 'lucide-react';

interface HeartCanvasProps {
  selectedArtery: PredictionTargetId | 'all';
  onSelectArtery: (artery: PredictionTargetId | 'all') => void;
  targets?: Record<PredictionTargetId, TargetPredictionOutput>;
}

const isWebGLSupported = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};

export const HeartCanvas: React.FC<HeartCanvasProps> = ({
  selectedArtery,
  onSelectArtery,
  targets,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isBeating, setIsBeating] = useState(true);
  const [bpm, setBpm] = useState(72);
  const [show2DFallback, setShow2DFallback] = useState(() => !isWebGLSupported());
  const [webGLError, setWebGLError] = useState(false);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(0, 0.4, 4.4);
      controlsRef.current.update();
    }
  };

  const setView = (x: number, y: number, z: number) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(x, y, z);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  if (webGLError || show2DFallback) {
    return (
      <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-800 bg-[#070b16]">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setShow2DFallback(false)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            Return to 3D View
          </button>
        </div>
        <HeartFallback2D selectedArtery={selectedArtery} onSelectArtery={onSelectArtery} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#080d1c] via-[#091124] to-[#070b16] shadow-2xl flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: View Presets */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl pointer-events-auto text-xs">
          <button
            onClick={() => setView(0, 0.3, 4.2)}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition-colors"
            title="Anterior (Frontal) View"
          >
            Anterior
          </button>
          <button
            onClick={() => setView(0, 0.3, -4.2)}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition-colors"
            title="Posterior (Back) View"
          >
            Posterior
          </button>
          <button
            onClick={() => setView(-4.2, 0.3, 0)}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition-colors"
            title="Left Lateral View"
          >
            Left Lateral
          </button>
          <button
            onClick={() => setView(4.2, 0.3, 0)}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition-colors"
            title="Right Lateral View"
          >
            Right Lateral
          </button>
          <button
            onClick={() => setView(0, 4.4, 0.5)}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition-colors"
            title="Superior View (Arch)"
          >
            Superior
          </button>
        </div>

        {/* Right: Quick Tool Actions */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl pointer-events-auto text-xs">
          {/* Heartbeat toggle */}
          <button
            onClick={() => setIsBeating(!isBeating)}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              isBeating
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle rhythmic cardiac pulsation"
          >
            {isBeating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isBeating ? `${bpm} BPM` : 'Paused'}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset 3D Camera"
            aria-label="Reset Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* 2D Fallback view */}
          <button
            onClick={() => setShow2DFallback(true)}
            className="px-2 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors text-xs font-mono"
            title="Open 2D Schematic Fallback"
          >
            2D Map
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#070b16', 1);
          }}
          onError={() => setWebGLError(true)}
        >
          <PerspectiveCamera makeDefault position={[0, 0.4, 4.4]} fov={45} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[6, 8, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#38bdf8" />
          <pointLight position={[0, 2, 3]} intensity={1.2} distance={8} color="#ffffff" />
          <pointLight position={[0, -2, 2]} intensity={0.8} distance={6} color="#f43f5e" />

          <Suspense fallback={null}>
            <Center>
              <HeartModel
                selectedArtery={selectedArtery}
                onSelectArtery={onSelectArtery}
                targets={targets}
                isBeating={isBeating}
                bpm={bpm}
              />
            </Center>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={2.5}
            maxDistance={8.5}
            maxPolarAngle={Math.PI * 0.9}
            minPolarAngle={Math.PI * 0.05}
          />
        </Canvas>
      </div>

      {/* Bottom overlay: Instructions & BPM Slider */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 pointer-events-auto flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click on <strong>LAD</strong>, <strong>LCX</strong>, or <strong>RCA</strong> meshes to inspect</span>
          <span className="hidden md:inline">• Drag to rotate • Scroll to zoom</span>
        </div>

        {/* BPM rate slider */}
        {isBeating && (
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 pointer-events-auto flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Rhythm:</span>
            <input
              type="range"
              min="50"
              max="120"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              aria-label="Heart rate slider"
            />
            <span className="font-mono text-cyan-300 font-bold w-12 text-right">{bpm} bpm</span>
          </div>
        )}
      </div>
    </div>
  );
};
