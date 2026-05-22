import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const FantasyHero = () => {
  const containerRef = useRef();
  const canvasRef = useRef();
  const cursorRef = useRef();
  const followerRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle System
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
      colors[i] = Math.random();
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Premium 3D Object
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#10b981') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uTime;
        void main() {
          vUv = uv;
          vNormal = normal;
          vec3 pos = position;
          pos.x += sin(pos.y * 2.0 + uTime) * 0.1;
          pos.y += cos(pos.x * 2.0 + uTime) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform vec3 uColor;
        uniform float uTime;
        void main() {
          float pulse = (sin(uTime * 2.0) + 1.0) * 0.5;
          vec3 finalColor = mix(uColor, vec3(1.0), pulse * 0.3);
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(finalColor + intensity, 1.0);
        }
      `,
    });

    const mainObject = new THREE.Mesh(geometry, material);
    scene.add(mainObject);

    camera.position.z = 5;

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      mainObject.rotation.y = elapsedTime * 0.3;
      particles.rotation.y = elapsedTime * 0.05;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // GSAP Scroll Animation
    gsap.to(mainObject.rotation, {
      x: Math.PI * 2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Custom Cursor Logic (Local to Hero)
    const onMouseMove = (e) => {
      if (cursorRef.current && followerRef.current) {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.3 });
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', onMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[150vh] w-full hero-canvas-container">
      <div className="noise-overlay" />
      <div ref={cursorRef} className="custom-cursor hidden lg:block" />
      <div ref={followerRef} className="cursor-follower hidden lg:block" />
      
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[-1]" />
      
      <div className="relative z-10 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-center px-4">
          <h1 className="text-8xl md:text-9xl font-playfair mb-6 text-shimmer pointer-events-auto leading-tight drop-shadow-2xl">
            Crafted <br/> Excellence
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto pointer-events-auto drop-shadow-lg font-medium">
            Experience the intersection of luxury and technology. 
            Scroll to explore the future of premium fashion.
          </p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="w-6 h-10 border-2 border-accent-green rounded-full flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-accent-green rounded-full"
              />
            </div>
            <span className="text-xs uppercase tracking-widest text-accent-green font-bold animate-pulse">
              Scroll to explore
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FantasyHero;
