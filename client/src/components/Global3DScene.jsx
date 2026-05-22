import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Global3DScene = () => {
  const canvasRef = useRef();

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

    // Abstract Background Elements
    const geometry = new THREE.IcosahedronGeometry(10, 2);
    const material = new THREE.MeshPhongMaterial({
      color: '#10b981',
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    
    const backgroundMesh = new THREE.Mesh(geometry, material);
    scene.add(backgroundMesh);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    camera.position.z = 15;

    const animate = () => {
      backgroundMesh.rotation.y += 0.001;
      backgroundMesh.rotation.x += 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-40" 
    />
  );
};

export default Global3DScene;
