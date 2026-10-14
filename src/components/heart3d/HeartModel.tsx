import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PredictionTargetId, TargetPredictionOutput } from '../../types/prediction';

interface HeartModelProps {
  selectedArtery: PredictionTargetId | 'all';
  onSelectArtery: (artery: PredictionTargetId | 'all') => void;
  targets?: Record<PredictionTargetId, TargetPredictionOutput>;
  isBeating?: boolean;
  bpm?: number;
}

export const HeartModel: React.FC<HeartModelProps> = ({
  selectedArtery,
  onSelectArtery,
  targets,
  isBeating = true,
  bpm = 72,
}) => {
  const heartGroupRef = useRef<THREE.Group>(null);
  const [hoveredArtery, setHoveredArtery] = useState<PredictionTargetId | null>(null);

  // Target highlight colors
  const ladTarget = targets?.LAD;
  const lcxTarget = targets?.LCX;
  const rcaTarget = targets?.RCA;

  const ladColor = ladTarget ? ladTarget.meshHighlightColor : '#38bdf8';
  const lcxColor = lcxTarget ? lcxTarget.meshHighlightColor : '#38bdf8';
  const rcaColor = rcaTarget ? rcaTarget.meshHighlightColor : '#38bdf8';

  // Heartbeat animation frame
  useFrame(({ clock }) => {
    if (!heartGroupRef.current) return;
    if (isBeating) {
      const t = clock.getElapsedTime() * (bpm / 60) * Math.PI * 2;
      // Cardiac cycle: quick systolic contraction followed by diastolic filling
      const systolicPhase = Math.sin(t);
      const beat = systolicPhase > 0.4 ? Math.pow(Math.sin(t), 4) * 0.05 : 0;
      const baseScale = 1.0;
      heartGroupRef.current.scale.set(
        baseScale + beat,
        baseScale - beat * 0.4,
        baseScale + beat * 0.9
      );
    } else {
      heartGroupRef.current.scale.set(1, 1, 1);
    }
  });

  // Procedural Coronary Spline Curves
  // 1. LAD: Anterior Interventricular Sulcus down to apex
  const ladCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.15, 0.45, 0.75), // Left main origin
      new THREE.Vector3(-0.25, 0.25, 0.9),
      new THREE.Vector3(-0.2, 0.0, 1.05),
      new THREE.Vector3(-0.1, -0.35, 1.05),
      new THREE.Vector3(0.05, -0.75, 0.95),
      new THREE.Vector3(0.15, -1.15, 0.8),
      new THREE.Vector3(0.18, -1.35, 0.65), // Apex
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // LAD Diagonal Branch
  const ladDiagonalCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.2, 0.0, 1.05),
      new THREE.Vector3(-0.55, -0.2, 0.9),
      new THREE.Vector3(-0.8, -0.55, 0.7),
      new THREE.Vector3(-0.9, -0.85, 0.4),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // 2. LCX: Circumflex curving in left atrioventricular groove
  const lcxCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.15, 0.45, 0.75), // Left main bifurcation
      new THREE.Vector3(-0.5, 0.4, 0.65),
      new THREE.Vector3(-0.85, 0.25, 0.35),
      new THREE.Vector3(-1.05, 0.1, -0.1),
      new THREE.Vector3(-0.95, -0.15, -0.55),
      new THREE.Vector3(-0.7, -0.4, -0.8),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // LCX Obtuse Marginal Branch
  const lcxMarginalCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.85, 0.25, 0.35),
      new THREE.Vector3(-1.0, -0.2, 0.2),
      new THREE.Vector3(-0.95, -0.65, 0.0),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // 3. RCA: Right Coronary Artery down right AV groove
  const rcaCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0.35, 0.5, 0.7), // Right aortic sinus
      new THREE.Vector3(0.65, 0.35, 0.65),
      new THREE.Vector3(0.85, 0.05, 0.5),
      new THREE.Vector3(0.9, -0.35, 0.3),
      new THREE.Vector3(0.8, -0.7, 0.0),
      new THREE.Vector3(0.5, -0.95, -0.4),
      new THREE.Vector3(0.2, -1.1, -0.55), // Posterior descending artery branch
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // RCA Acute Marginal Branch
  const rcaMarginalCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0.9, -0.35, 0.3),
      new THREE.Vector3(0.75, -0.6, 0.6),
      new THREE.Vector3(0.45, -0.9, 0.65),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Aortic Arch Curve
  const aortaCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0.1, 0.4, 0.3),
      new THREE.Vector3(0.05, 0.9, 0.2),
      new THREE.Vector3(-0.1, 1.4, 0.0),
      new THREE.Vector3(-0.4, 1.5, -0.2),
      new THREE.Vector3(-0.6, 1.1, -0.4),
      new THREE.Vector3(-0.65, 0.3, -0.45),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Pulmonary Trunk Curve
  const pulmonaryCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0.15, 0.2, 0.8),
      new THREE.Vector3(0.0, 0.6, 0.6),
      new THREE.Vector3(-0.15, 0.95, 0.35),
      new THREE.Vector3(-0.4, 1.05, 0.2),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Tube Geometries
  const ladGeo = useMemo(() => new THREE.TubeGeometry(ladCurve, 48, 0.048, 12, false), [ladCurve]);
  const ladDiagGeo = useMemo(() => new THREE.TubeGeometry(ladDiagonalCurve, 28, 0.035, 10, false), [ladDiagonalCurve]);
  const lcxGeo = useMemo(() => new THREE.TubeGeometry(lcxCurve, 48, 0.046, 12, false), [lcxCurve]);
  const lcxMargGeo = useMemo(() => new THREE.TubeGeometry(lcxMarginalCurve, 24, 0.034, 10, false), [lcxMarginalCurve]);
  const rcaGeo = useMemo(() => new THREE.TubeGeometry(rcaCurve, 48, 0.048, 12, false), [rcaCurve]);
  const rcaMargGeo = useMemo(() => new THREE.TubeGeometry(rcaMarginalCurve, 24, 0.035, 10, false), [rcaMarginalCurve]);

  const aortaGeo = useMemo(() => new THREE.TubeGeometry(aortaCurve, 36, 0.24, 16, false), [aortaCurve]);
  const pulmonaryGeo = useMemo(() => new THREE.TubeGeometry(pulmonaryCurve, 28, 0.22, 16, false), [pulmonaryCurve]);

  return (
    <group ref={heartGroupRef} position={[0, 0.1, 0]}>
      {/* ======================================================== */}
      {/* 1. MYOCARDIUM / MAIN CARDIAC MASS */}
      {/* ======================================================== */}
      
      {/* Left Ventricle (Thick apex-forming muscle) */}
      <mesh position={[-0.15, -0.45, 0.15]} rotation={[0.2, 0.15, -0.2]}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial
          color="#9f1239"
          roughness={0.45}
          metalness={0.15}
          bumpScale={0.05}
        />
      </mesh>

      {/* Right Ventricle (Anterior, crescentic) */}
      <mesh position={[0.42, -0.35, 0.35]} rotation={[-0.1, -0.2, 0.3]}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshStandardMaterial
          color="#881337"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Cardiac Apex Conical Cap */}
      <mesh position={[0.1, -1.2, 0.45]} rotation={[0.4, 0.2, -0.3]}>
        <coneGeometry args={[0.55, 0.9, 32]} />
        <meshStandardMaterial
          color="#991b1b"
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Left Atrium & Auricle */}
      <mesh position={[-0.55, 0.45, -0.2]}>
        <sphereGeometry args={[0.62, 28, 28]} />
        <meshStandardMaterial
          color="#7f1d1d"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Right Atrium */}
      <mesh position={[0.65, 0.35, 0.0]}>
        <sphereGeometry args={[0.65, 28, 28]} />
        <meshStandardMaterial
          color="#7f1d1d"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* ======================================================== */}
      {/* 2. GREAT VESSELS */}
      {/* ======================================================== */}

      {/* Aortic Arch */}
      <mesh geometry={aortaGeo}>
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.3}
          metalness={0.25}
        />
      </mesh>

      {/* Brachiocephalic Artery Branch */}
      <mesh position={[-0.12, 1.55, 0.0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.07, 0.08, 0.45, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>

      {/* Left Common Carotid Branch */}
      <mesh position={[-0.26, 1.6, -0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.45, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>

      {/* Left Subclavian Artery Branch */}
      <mesh position={[-0.4, 1.55, -0.18]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.06, 0.07, 0.45, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>

      {/* Pulmonary Trunk */}
      <mesh geometry={pulmonaryGeo}>
        <meshStandardMaterial
          color="#1e3a8a"
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* Superior Vena Cava */}
      <mesh position={[0.7, 1.05, -0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.9, 20]} />
        <meshStandardMaterial color="#1e40af" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Inferior Vena Cava */}
      <mesh position={[0.65, -0.85, -0.2]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.6, 20]} />
        <meshStandardMaterial color="#1e40af" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE CORONARY ARTERY MESHES */}
      {/* ======================================================== */}

      {/* LAD - LEFT ANTERIOR DESCENDING ARTERY */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectArtery('LAD');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredArtery('LAD');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredArtery(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh geometry={ladGeo}>
          <meshStandardMaterial
            color={ladColor}
            emissive={selectedArtery === 'LAD' || hoveredArtery === 'LAD' ? ladColor : '#000000'}
            emissiveIntensity={selectedArtery === 'LAD' ? 0.7 : hoveredArtery === 'LAD' ? 0.4 : 0.1}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        <mesh geometry={ladDiagGeo}>
          <meshStandardMaterial
            color={ladColor}
            emissive={selectedArtery === 'LAD' || hoveredArtery === 'LAD' ? ladColor : '#000000'}
            emissiveIntensity={selectedArtery === 'LAD' ? 0.6 : hoveredArtery === 'LAD' ? 0.3 : 0.1}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>

        {/* 3D Label Anchor */}
        <Html position={[-0.1, -0.2, 1.25]} center distanceFactor={8}>
          <div
            onClick={() => onSelectArtery('LAD')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wider cursor-pointer shadow-lg border transition-all ${
              selectedArtery === 'LAD'
                ? 'bg-cyan-500 text-black border-white ring-2 ring-cyan-400 scale-110'
                : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:scale-105'
            }`}
          >
            LAD
            {ladTarget && (
              <span className="ml-1 opacity-80 font-normal">
                {(ladTarget.simulatedProbability * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </Html>
      </group>

      {/* LCX - LEFT CIRCUMFLEX ARTERY */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectArtery('LCX');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredArtery('LCX');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredArtery(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh geometry={lcxGeo}>
          <meshStandardMaterial
            color={lcxColor}
            emissive={selectedArtery === 'LCX' || hoveredArtery === 'LCX' ? lcxColor : '#000000'}
            emissiveIntensity={selectedArtery === 'LCX' ? 0.7 : hoveredArtery === 'LCX' ? 0.4 : 0.1}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        <mesh geometry={lcxMargGeo}>
          <meshStandardMaterial
            color={lcxColor}
            emissive={selectedArtery === 'LCX' || hoveredArtery === 'LCX' ? lcxColor : '#000000'}
            emissiveIntensity={selectedArtery === 'LCX' ? 0.6 : hoveredArtery === 'LCX' ? 0.3 : 0.1}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>

        <Html position={[-1.0, 0.1, 0.4]} center distanceFactor={8}>
          <div
            onClick={() => onSelectArtery('LCX')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wider cursor-pointer shadow-lg border transition-all ${
              selectedArtery === 'LCX'
                ? 'bg-cyan-500 text-black border-white ring-2 ring-cyan-400 scale-110'
                : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:scale-105'
            }`}
          >
            LCX
            {lcxTarget && (
              <span className="ml-1 opacity-80 font-normal">
                {(lcxTarget.simulatedProbability * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </Html>
      </group>

      {/* RCA - RIGHT CORONARY ARTERY */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectArtery('RCA');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredArtery('RCA');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredArtery(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh geometry={rcaGeo}>
          <meshStandardMaterial
            color={rcaColor}
            emissive={selectedArtery === 'RCA' || hoveredArtery === 'RCA' ? rcaColor : '#000000'}
            emissiveIntensity={selectedArtery === 'RCA' ? 0.7 : hoveredArtery === 'RCA' ? 0.4 : 0.1}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        <mesh geometry={rcaMargGeo}>
          <meshStandardMaterial
            color={rcaColor}
            emissive={selectedArtery === 'RCA' || hoveredArtery === 'RCA' ? rcaColor : '#000000'}
            emissiveIntensity={selectedArtery === 'RCA' ? 0.6 : hoveredArtery === 'RCA' ? 0.3 : 0.1}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>

        <Html position={[0.9, -0.1, 0.65]} center distanceFactor={8}>
          <div
            onClick={() => onSelectArtery('RCA')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wider cursor-pointer shadow-lg border transition-all ${
              selectedArtery === 'RCA'
                ? 'bg-cyan-500 text-black border-white ring-2 ring-cyan-400 scale-110'
                : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:scale-105'
            }`}
          >
            RCA
            {rcaTarget && (
              <span className="ml-1 opacity-80 font-normal">
                {(rcaTarget.simulatedProbability * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
};
