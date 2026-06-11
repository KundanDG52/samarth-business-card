import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

/* ─── Tokens ─────────────────────────────────────────────── */
const BG = "#000000";
const SILVER = "#A8A6A2";
const SILVER_LT = "#C8C6C2";

/* ─── Card face texture ───────────────────────────────────── */
function buildTexture() {
  const W = 2048,
    H = 1170;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d");

  /* white card base */
  c.fillStyle = "#FFFFFF";
  c.fillRect(0, 0, W, H);

  /* silver left bar */
  c.fillStyle = "#A8A6A2";
  c.fillRect(0, 36, 46, H - 72);
  /* light silver thin accent */
  c.fillStyle = "#D0CECC";
  c.fillRect(48, 36, 9, H - 72);
  /* right bar */
  c.fillStyle = "#A8A6A2";
  c.fillRect(W - 34, 36, 34, H - 72);

  /* silver hairlines */
  c.fillStyle = "rgba(168,166,162,0.8)";
  c.fillRect(68, 10, W - 106, 4);
  c.fillRect(68, H - 14, W - 106, 4);

  const cx = W / 2;

  /* FINE SILVER JEWELLERY */
  c.fillStyle = "#4A4846";
  c.font = "500 42px 'Georgia', serif";
  c.textAlign = "center";
  c.letterSpacing = "14px";
  c.fillText("FINE SILVER JEWELLERY", cx, 215);

  /* SAMARTH SILVER — dark silver */
  c.fillStyle = "#4A4846";
  c.font = "bold 120px 'Georgia', serif";
  c.letterSpacing = "8px";
  c.fillText("SAMARTH SILVER", cx, 390);

  /* tagline */
  c.fillStyle = "#8A8880";
  c.font = "36px 'Georgia', serif";
  c.letterSpacing = "5px";
  c.fillText("VILE PARLE EAST · MUMBAI", cx, 480);

  /* silver divider */
  // c.fillStyle = "rgba(168,166,162,0.6)";
  // c.fillRect(cx - 660, 520, 1320, 3);

  /* Dilip Gahalot */
  c.fillStyle = "#4A4846";
  c.font = "italic 82px 'Georgia', serif";
  c.letterSpacing = "3px";
  c.fillText("Dilip Gahalot", cx, 645);

  /* PROPRIETOR */
  c.fillStyle = "#8A8880";
  c.font = "36px 'Arial', sans-serif";
  c.letterSpacing = "16px";
  c.fillText("PROPRIETOR", cx, 720);

  /* thin silver divider */
  // c.fillStyle = "rgba(168,166,162,0.45)";
  // c.fillRect(cx - 510, 758, 1020, 2);

  /* phone */
  c.fillStyle = "#5A5856";
  c.font = "44px 'Arial', sans-serif";
  c.letterSpacing = "2px";
  c.textAlign = "left";
  c.fillText("+91 99300 71426", cx - 610, 864);

  /* GST */
  c.fillStyle = "#000";
  c.font = "29px 'Arial', sans-serif";
  c.letterSpacing = "1px";
  c.textAlign = "right";
  c.fillText("GST: 27AABPG2689J1ZI", cx + 640, 864);

  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

/* ─── Twinkling Stars ─────────────────────────────────────── */
function TwinklingStars({ count = 280 }) {
  const ref = useRef();

  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 2] = -8 - Math.random() * 25;
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.4 + Math.random() * 2.8;
    }
    return [pos, ph, sp];
  }, [count]);

  const initColors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    arr.fill(1);
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const col = ref.current.geometry.attributes.color;
    for (let i = 0; i < count; i++) {
      const v =
        0.25 +
        0.75 * Math.pow(Math.abs(Math.sin(t * speeds[i] + phases[i])), 2.2);
      col.setXYZ(i, v * 0.88 + 0.12, v * 0.9 + 0.1, v);
    }
    col.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={initColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.95}
      />
    </points>
  );
}

/* ─── Galaxy ─────────────────────────────────────────────── */
function Galaxy() {
  const ref  = useRef();
  const N    = 2800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const arm    = i % 2;
      const armOff = arm * Math.PI;
      const r      = 1.2 + Math.pow(Math.random(), 0.5) * 22;
      const theta  = armOff + r * 0.28 + (Math.random() - 0.5) * 1.1;
      const sc     = (Math.random() - 0.5) * (r * 0.18 + 0.5);
      pos[i*3]     = Math.cos(theta) * r + sc;
      pos[i*3+1]   = Math.sin(theta) * r + sc;
      pos[i*3+2]   = -16 - Math.random() * 6;
      const d      = r / 22;
      col[i*3]     = 0.72 + d * 0.28;
      col[i*3+1]   = 0.80 + d * 0.15;
      col[i*3+2]   = 1.0;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.022;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={N} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.036} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

/* ─── Nebula Dust ─────────────────────────────────────────── */
function NebulaDust() {
  const ref = useRef();
  const N   = 320;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const pal = [
      [0.55, 0.30, 1.00],   // violet
      [0.25, 0.55, 1.00],   // blue
      [0.35, 1.00, 0.80],   // teal
      [1.00, 0.45, 0.75],   // pink
    ];
    for (let i = 0; i < N; i++) {
      const a      = Math.random() * Math.PI * 2;
      const r      = 2 + Math.random() * 17;
      pos[i*3]     = Math.cos(a) * r;
      pos[i*3+1]   = Math.sin(a) * r * 0.55;
      pos[i*3+2]   = -13 - Math.random() * 7;
      const [rv, g, b] = pal[Math.floor(Math.random() * pal.length)];
      col[i*3] = rv; col[i*3+1] = g; col[i*3+2] = b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.014;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={N} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.28} sizeAttenuation transparent opacity={0.10} />
    </points>
  );
}

/* ─── Shared silver material ─────────────────────────────── */
const JM = { color: "#C8C6C2", metalness: 0.92, roughness: 0.08 };

/* ─── Ring (finger ring with stone) ─────────────────────── */
function Ring({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.55;
    ref.current.rotation.z = Math.sin(t * 0.38) * 0.18;
  });
  const R = 0.36;
  return (
    <group ref={ref} position={position} scale={0.72}>
      {/* band */}
      <mesh>
        <torusGeometry args={[R, 0.052, 16, 56]} />
        <meshStandardMaterial {...JM} />
      </mesh>
      {/* setting base */}
      <mesh position={[0, R, 0]}>
        <cylinderGeometry args={[0.082, 0.072, 0.038, 16]} />
        <meshStandardMaterial {...JM} />
      </mesh>
      {/* four prongs */}
      {Array.from({ length: 4 }, (_, i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.068, R + 0.052, Math.sin(a) * 0.068]}
          >
            <cylinderGeometry args={[0.007, 0.007, 0.1, 6]} />
            <meshStandardMaterial {...JM} />
          </mesh>
        );
      })}
      {/* gemstone */}
      <mesh position={[0, R + 0.072, 0]}>
        <octahedronGeometry args={[0.062, 0]} />
        <meshStandardMaterial
          color="#d8eeff"
          metalness={0.05}
          roughness={0}
          transparent
          opacity={0.82}
        />
      </mesh>
    </group>
  );
}

/* ─── Payal (anklet with bells) ──────────────────────────── */
function Payal({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.5;
    ref.current.rotation.y = Math.sin(t * 0.32) * 0.2;
  });
  return (
    <group ref={ref} position={position} scale={0.65}>
      <mesh>
        <torusGeometry args={[0.44, 0.038, 12, 56]} />
        <meshStandardMaterial {...JM} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 0.44, Math.sin(a) * 0.44, 0]}>
            <mesh position={[0, 0, -0.06]}>
              <sphereGeometry args={[0.042, 8, 8]} />
              <meshStandardMaterial {...JM} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ─── Kada (thick bangle) ────────────────────────────────── */
function Kada({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.65;
    ref.current.rotation.x = Math.sin(t * 0.44) * 0.22;
  });
  return (
    <group ref={ref} position={position} scale={0.7}>
      <mesh>
        <torusGeometry args={[0.4, 0.115, 20, 64]} />
        <meshStandardMaterial {...JM} />
      </mesh>
      {/* engraved edge rings */}
      {[-0.08, 0.08].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <torusGeometry args={[0.4, 0.006, 8, 64]} />
          <meshStandardMaterial
            color="#9A9896"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Kadli (paired bangle) ──────────────────────────────── */
function Kadli({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.5;
    ref.current.rotation.z = Math.sin(t * 0.42) * 0.18;
  });
  return (
    <group ref={ref} position={position} scale={0.65}>
      {[-0.1, 0.1].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <torusGeometry args={[0.4, 0.065, 16, 56]} />
          <meshStandardMaterial {...JM} />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0]}
            rotation={[Math.PI / 2, 0, a]}
          >
            <cylinderGeometry args={[0.013, 0.013, 0.2, 6]} />
            <meshStandardMaterial {...JM} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Business Card ──────────────────────────────────────── */
function BusinessCard() {
  const groupRef = useRef();
  const { mouse } = useThree();
  const [hovered, setHovered] = useState(false);
  const introReady = useRef(false);

  const drag = useRef({ active: false, startX: 0, startY: 0 });
  const rotTarget = useRef({ x: 0, y: 0 });
  const rotCurrent = useRef({ x: 0, y: 0 });

  const W = 3.5,
    H = 2.0,
    D = 0.072;
  const texture = useMemo(() => buildTexture(), []);

  /* GSAP intro */
  useEffect(() => {
    const g = groupRef.current;
    g.scale.setScalar(0.01);
    g.rotation.y = Math.PI * 1.2;
    g.position.y = -1.8;

    gsap
      .timeline({
        onComplete: () => {
          introReady.current = true;
        },
      })
      .to(g.position, { y: 0, duration: 1.0, ease: "power3.out" }, 0)
      .to(
        g.scale,
        { x: 1, y: 1, z: 1, duration: 1.0, ease: "back.out(1.4)" },
        0.08,
      )
      .to(g.rotation, { y: 0, duration: 1.3, ease: "power3.out" }, 0.1);
  }, []);

  /* GSAP hover */
  useEffect(() => {
    if (!introReady.current) return;
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.04 : 1,
      y: hovered ? 1.04 : 1,
      z: hovered ? 1.04 : 1,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [hovered]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = groupRef.current;
    if (introReady.current) {
      g.position.y = Math.sin(t * 0.7) * 0.06;
    }
    if (!drag.current.active) {
      rotTarget.current.x = mouse.y * -0.22;
      rotTarget.current.y = mouse.x * 0.28;
    }
    rotCurrent.current.x = THREE.MathUtils.lerp(
      rotCurrent.current.x,
      rotTarget.current.x,
      0.07,
    );
    rotCurrent.current.y = THREE.MathUtils.lerp(
      rotCurrent.current.y,
      rotTarget.current.y,
      0.07,
    );
    g.rotation.x = rotCurrent.current.x;
    g.rotation.y += (rotCurrent.current.y - g.rotation.y) * 0.07;
  });

  function onPointerDown(e) {
    e.stopPropagation();
    drag.current.active = true;
    drag.current.startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    drag.current.startY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
  }
  function onPointerMove(e) {
    if (!drag.current.active) return;
    const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    rotTarget.current.y = (cx - drag.current.startX) * 0.007;
    rotTarget.current.x = -(cy - drag.current.startY) * 0.005;
  }
  function onPointerUp() {
    drag.current.active = false;
  }

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* card body */}
      <RoundedBox args={[W, H, D]} radius={0.02} smoothness={8}>
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={0.06}
          roughness={0.4}
        />
      </RoundedBox>

      {/* printed face */}
      <mesh position={[0, 0, D / 2 + 0.0012]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={texture} metalness={0.1} roughness={0.35} />
      </mesh>
    </group>
  );
}

/* ─── Scene ──────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <color attach="background" args={[BG]} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={1.0} color="#e8eaf0" />
      <pointLight position={[0, -1, 3]} intensity={0.5} color={SILVER_LT} />
      <pointLight position={[0, 0, -4]} intensity={0.4} color="#9090b8" />

      <TwinklingStars count={520} />
      <Galaxy />
      <NebulaDust />

      {/* jewelry corners */}
      <Ring position={[-2.95, 1.1, -0.5]} />
      <Payal position={[2.95, 1.1, -0.5]} />
      <Kada position={[-2.95, -1.1, -0.5]} />
      <Kadli position={[2.95, -1.1, -0.5]} />

      <BusinessCard />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
    </>
  );
}

/* ─── HUD ────────────────────────────────────────────────── */
function HUD() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 22,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#444",
        fontSize: 11,
        letterSpacing: "0.16em",
        fontFamily: "sans-serif",
        textTransform: "uppercase",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      Drag to rotate · Pinch to zoom
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────── */
export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: BG,
        position: "relative",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Scene />
      </Canvas>
      <HUD />
    </div>
  );
}
