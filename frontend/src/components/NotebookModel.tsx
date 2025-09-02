import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function NotebookScene() {
  const meshRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  // Load the GLTF model
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/models/scene.gltf', (gltf) => {
      console.log('Model loaded successfully:', gltf);
      setModel(gltf.scene);
    }, (progress) => {
      console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    }, (error) => {
      console.error('Error loading model:', error);
    });
  }, []);

  // Animate the model
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!model) return null;

  return (
    <primitive 
      ref={meshRef}
      object={model} 
      scale={[10,10,10]} 
      position={[0, 0.5, 0]}
      rotation={[Math.PI / 1.5,0,-5.2]}
    />
  );
}

function NotebookModel() {
  return (
    <div className="w-full h-48 mb-4">
      <Canvas camera={{ position: [0, 4, 2], fov: 80 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        <NotebookScene />
      </Canvas>
    </div>
  );    
}

export default NotebookModel;
