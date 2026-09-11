import * as THREE from 'three';
import { MaterialMode } from '../types';

export function createOrganelleMaterial({
  color,
  isSelected,
  isDimmed,
  materialMode = 'native',
  clippingPlane = null,
  isTranslucent = false,
}: {
  color: string;
  isSelected: boolean;
  isDimmed: boolean;
  materialMode?: MaterialMode;
  clippingPlane?: THREE.Plane | null;
  isTranslucent?: boolean;
}): THREE.Material {
  const baseColor = new THREE.Color(color);

  const clippingPlanes = clippingPlane ? [clippingPlane] : [];

  if (materialMode === 'solid') {
    return new THREE.MeshStandardMaterial({
      color: isDimmed ? baseColor.clone().multiplyScalar(0.4) : baseColor,
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true,
      clippingPlanes,
      clipShadows: true,
      transparent: isDimmed || isTranslucent,
      opacity: isDimmed ? 0.18 : isTranslucent ? 0.45 : 1.0,
      emissive: isSelected ? baseColor.clone().multiplyScalar(0.6) : new THREE.Color(0x000000),
      depthWrite: !isDimmed,
    });
  }

  if (materialMode === 'studio') {
    return new THREE.MeshStandardMaterial({
      color: isDimmed ? baseColor.clone().multiplyScalar(0.3) : baseColor.clone().lerp(new THREE.Color('#ffffff'), 0.15),
      roughness: 0.35,
      metalness: 0.1,
      clippingPlanes,
      clipShadows: true,
      transparent: isDimmed || isTranslucent,
      opacity: isDimmed ? 0.18 : isTranslucent ? 0.4 : 1.0,
      emissive: isSelected ? baseColor.clone().multiplyScalar(0.8) : new THREE.Color(0x111111),
      depthWrite: !isDimmed,
    });
  }

  // Native material mode with rich biological characteristics
  if (isTranslucent) {
    return new THREE.MeshPhysicalMaterial({
      color: isDimmed ? baseColor.clone().multiplyScalar(0.35) : baseColor,
      roughness: 0.25,
      metalness: 0.05,
      transmission: 0.65,
      thickness: 0.6,
      ior: 1.33,
      transparent: true,
      opacity: isDimmed ? 0.18 : 0.45,
      clippingPlanes,
      clipShadows: true,
      emissive: isSelected ? baseColor.clone().multiplyScalar(0.5) : new THREE.Color(0x000000),
      depthWrite: false,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color: isDimmed ? baseColor.clone().multiplyScalar(0.3) : baseColor,
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 0.2,
    clearcoatRoughness: 0.2,
    clippingPlanes,
    clipShadows: true,
    transparent: isDimmed,
    opacity: isDimmed ? 0.18 : 1.0,
    emissive: isSelected ? baseColor.clone().multiplyScalar(0.85) : new THREE.Color(0x000000),
    depthWrite: !isDimmed,
  });
}
