import React, { useEffect, useRef } from 'react';

/**
 * TumblePanel — a Lusion-style tumbling 3D shapes panel for the
 * homepage, offered as the alternative to RouteFlow (the owner picks
 * one; both occupy the same slot between the hero and Collections).
 *
 * Modelled on Lusion's current homepage, verified by a live look on
 * 2026-11-05: a light page, a headline, and below it a CONTAINED dark
 * rounded-rectangle panel holding a pile of tumbling 3D jack/plus
 * objects (royal blue, glossy black, matte light grey) — with all
 * text and controls OUTSIDE the panel. Here the same composition is
 * adapted to SwitchRoute's brand palette (blue / cyan / violet, plus
 * glossy black and matte grey pieces) and the panel sits in its own
 * dedicated space — nothing overlaps any page element.
 *
 * Implementation: three.js (loaded lazily via dynamic import, so the
 * library ships as an async chunk used only by this panel). Each jack
 * is one merged geometry (3 crossed cylinders + 6 end caps). Motion
 * is a small custom physics loop: slow drift + tumble, soft wall
 * bounces, and soft pairwise separation so pieces mostly brush past
 * each other instead of interpenetrating, plus a gentle spring that
 * keeps the pile composed around the centre. A very subtle camera
 * parallax follows the pointer. DPR capped, paused off-screen,
 * prefers-reduced-motion renders one settled frame. If WebGL is
 * unavailable the panel degrades to its dark gradient alone.
 */
interface Piece {
  mesh: import('three').Mesh;
  vel: import('three').Vector3;
  angVel: import('three').Vector3;
  radius: number;
}

const PALETTE: Array<{ color: number; roughness: number; metalness: number; weight: number }> = [
  { color: 0x2563eb, roughness: 0.34, metalness: 0.08, weight: 4 }, // royal blue (Lusion's lead, in brand family)
  { color: 0x22d3ee, roughness: 0.3, metalness: 0.08, weight: 3 }, // brand cyan
  { color: 0x8b5cf6, roughness: 0.36, metalness: 0.08, weight: 2 }, // brand violet
  { color: 0x0d1117, roughness: 0.16, metalness: 0.25, weight: 2 }, // glossy black
  { color: 0xb8c0cc, roughness: 0.62, metalness: 0.02, weight: 2 }, // matte light grey
];

export const TumblePanel: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    if (!wrap || !panel) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const THREE = await import('three');
      const { mergeGeometries } = await import('three/addons/utils/BufferGeometryUtils.js');
      if (disposed) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return; // WebGL unavailable: the dark gradient panel remains.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
      panel.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      const CAM_Z = 26;
      camera.position.set(0, 0, CAM_Z);

      scene.add(new THREE.HemisphereLight(0xbdd3ff, 0x0a0c14, 0.85));
      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(6, 10, 9);
      scene.add(key);
      const rimCyan = new THREE.DirectionalLight(0x22d3ee, 1.15);
      rimCyan.position.set(-9, -3, 6);
      scene.add(rimCyan);
      const rimViolet = new THREE.DirectionalLight(0x8b5cf6, 0.9);
      rimViolet.position.set(8, -6, -4);
      scene.add(rimViolet);

      // One jack: three crossed cylinders with a wider disc cap at
      // each end (Lusion's pieces have flat circular end faces).
      const parts: import('three').BufferGeometry[] = [];
      const arm = (rotate: (g: import('three').BufferGeometry) => void) => {
        const cyl = new THREE.CylinderGeometry(0.17, 0.17, 1.74, 20);
        rotate(cyl);
        parts.push(cyl);
        for (const sign of [1, -1]) {
          const cap = new THREE.CylinderGeometry(0.34, 0.34, 0.18, 24);
          rotate(cap);
          const axis = new THREE.Vector3(0, 1, 0);
          if (rotate === rotX) axis.set(0, 0, 1);
          if (rotate === rotZ) axis.set(1, 0, 0);
          cap.translate(axis.x * 0.87 * sign, axis.y * 0.87 * sign, axis.z * 0.87 * sign);
          parts.push(cap);
        }
      };
      const rotX = (g: import('three').BufferGeometry) => g.rotateX(Math.PI / 2);
      const rotZ = (g: import('three').BufferGeometry) => g.rotateZ(Math.PI / 2);
      const identity = (g: import('three').BufferGeometry) => g;
      arm(identity);
      arm(rotZ);
      arm(rotX);
      const jackGeo = mergeGeometries(parts);
      parts.forEach((g) => g.dispose());
      if (!jackGeo) return;

      const materials = PALETTE.map(
        (p) => new THREE.MeshStandardMaterial({ color: p.color, roughness: p.roughness, metalness: p.metalness }),
      );
      const weighted: number[] = [];
      PALETTE.forEach((p, i) => {
        for (let k = 0; k < p.weight; k += 1) weighted.push(i);
      });

      let halfW = 10;
      let halfH = 6;
      const pieces: Piece[] = [];
      const COUNT = 20;
      for (let i = 0; i < COUNT; i += 1) {
        const scale = 0.78 + Math.random() * 0.6;
        const mesh = new THREE.Mesh(jackGeo, materials[weighted[Math.floor(Math.random() * weighted.length)]]);
        mesh.scale.setScalar(scale);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        scene.add(mesh);
        pieces.push({
          mesh,
          vel: new THREE.Vector3(),
          angVel: new THREE.Vector3(
            (Math.random() - 0.5) * 1.1,
            (Math.random() - 0.5) * 1.1,
            (Math.random() - 0.5) * 1.1,
          ),
          radius: 1.04 * scale,
        });
      }

      const place = () => {
        for (const p of pieces) {
          p.mesh.position.set(
            (Math.random() * 2 - 1) * (halfW - p.radius) * 0.92,
            (Math.random() * 2 - 1) * (halfH - p.radius) * 0.92,
            (Math.random() * 2 - 1) * 2.1,
          );
          p.vel.set((Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.24);
        }
      };

      const tmp = new THREE.Vector3();
      const stepPhysics = (dt: number) => {
        for (const p of pieces) {
          const pos = p.mesh.position;
          // Gentle spring keeps the pile composed around the centre.
          // Very weak centring + a slow global swirl, so the pile keeps
          // drifting and breathing instead of collapsing to the middle.
          p.vel.addScaledVector(pos, -0.012 * dt);
          p.vel.x += -pos.y * 0.016 * dt;
          p.vel.y += pos.x * 0.016 * dt;
          p.vel.multiplyScalar(Math.max(0, 1 - 0.12 * dt));
          pos.addScaledVector(p.vel, dt);
          p.mesh.rotation.x += p.angVel.x * dt;
          p.mesh.rotation.y += p.angVel.y * dt;
          p.mesh.rotation.z += p.angVel.z * dt;
          // Soft wall bounces.
          if (pos.x > halfW - p.radius) { pos.x = halfW - p.radius; p.vel.x = -Math.abs(p.vel.x) * 0.9; }
          if (pos.x < -halfW + p.radius) { pos.x = -halfW + p.radius; p.vel.x = Math.abs(p.vel.x) * 0.9; }
          if (pos.y > halfH - p.radius) { pos.y = halfH - p.radius; p.vel.y = -Math.abs(p.vel.y) * 0.9; }
          if (pos.y < -halfH + p.radius) { pos.y = -halfH + p.radius; p.vel.y = Math.abs(p.vel.y) * 0.9; }
          if (pos.z > 2.4) { pos.z = 2.4; p.vel.z = -Math.abs(p.vel.z) * 0.9; }
          if (pos.z < -2.4) { pos.z = -2.4; p.vel.z = Math.abs(p.vel.z) * 0.9; }
        }
        // Soft pairwise separation: pieces mostly brush past each
        // other instead of sinking into one another.
        for (let i = 0; i < pieces.length; i += 1) {
          for (let j = i + 1; j < pieces.length; j += 1) {
            const a = pieces[i];
            const b = pieces[j];
            tmp.subVectors(b.mesh.position, a.mesh.position);
            const minDist = (a.radius + b.radius) * 0.94;
            const d2 = tmp.lengthSq();
            const nearDist = minDist * 1.45;
            if (d2 > 1e-6 && d2 < nearDist * nearDist) {
              const d = Math.sqrt(d2);
              // Personal-space force starts before contact, so the
              // composition stays spread out and airy.
              if (d >= minDist) {
                tmp.multiplyScalar(1 / d);
                const f = ((nearDist - d) / nearDist) * 0.55 * dt;
                a.vel.addScaledVector(tmp, -f);
                b.vel.addScaledVector(tmp, f);
                continue;
              }
              const push = ((minDist - d) / 2) * 0.8;
              tmp.multiplyScalar(1 / d);
              a.mesh.position.addScaledVector(tmp, -push);
              b.mesh.position.addScaledVector(tmp, push);
              a.vel.addScaledVector(tmp, -push * 0.7);
              b.vel.addScaledVector(tmp, push * 0.7);
            }
          }
        }
      };

      const resize = () => {
        const rect = panel.getBoundingClientRect();
        const wpx = Math.max(280, Math.floor(rect.width));
        const hpx = Math.max(200, Math.floor(rect.height));
        renderer.setSize(wpx, hpx, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        camera.aspect = wpx / hpx;
        camera.updateProjectionMatrix();
        halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * CAM_Z;
        halfW = halfH * camera.aspect;
      };
      resize();
      place();
      for (let i = 0; i < 42; i += 1) stepPhysics(1 / 30);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pointer = { x: 0, y: 0 };
      const onPointerMove = (e: PointerEvent) => {
        const rect = panel.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      };

      let raf = 0;
      let inView = true;
      let last = performance.now();
      const loop = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (inView) {
          stepPhysics(dt);
          camera.position.x += (pointer.x * 1.35 - camera.position.x) * 0.045;
          camera.position.y += (-pointer.y * 0.85 - camera.position.y) * 0.045;
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
        }
        raf = window.requestAnimationFrame(loop);
      };

      if (reduced) {
        renderer.render(scene, camera);
      } else {
        raf = window.requestAnimationFrame(loop);
        wrap.addEventListener('pointermove', onPointerMove);
      }
      const observer = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? true;
        },
        { rootMargin: '120px' },
      );
      observer.observe(wrap);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(panel);

      cleanup = () => {
        window.cancelAnimationFrame(raf);
        observer.disconnect();
        resizeObserver.disconnect();
        wrap.removeEventListener('pointermove', onPointerMove);
        pieces.forEach((p) => scene.remove(p.mesh));
        jackGeo.dispose();
        materials.forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    void init();
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <section ref={wrapRef} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12" aria-label="Interactive animation: tumbling 3D shapes in a panel">
      <div ref={panelRef} className="tumble-panel" aria-hidden="true" />
    </section>
  );
};
