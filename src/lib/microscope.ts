export interface MicroscopeLens {
  power: number;
  label: string;
  fieldDiameterUm: number;
  depthOfFieldUm: number;
  numericalAperture: number;
  immersion: 'air' | 'water' | 'oil';
}

export const MICROSCOPE_LENSES: Record<string, MicroscopeLens> = {
  '4x': {
    power: 4,
    label: '4x Scanning Lens',
    fieldDiameterUm: 4500,
    depthOfFieldUm: 50,
    numericalAperture: 0.1,
    immersion: 'air',
  },
  '10x': {
    power: 10,
    label: '10x Low Power',
    fieldDiameterUm: 1800,
    depthOfFieldUm: 8.5,
    numericalAperture: 0.25,
    immersion: 'air',
  },
  '40x': {
    power: 40,
    label: '40x High Dry',
    fieldDiameterUm: 450,
    depthOfFieldUm: 1.0,
    numericalAperture: 0.65,
    immersion: 'air',
  },
  '100x': {
    power: 100,
    label: '100x Oil Immersion',
    fieldDiameterUm: 180,
    depthOfFieldUm: 0.2,
    numericalAperture: 1.25,
    immersion: 'oil',
  },
};

export type StainingTechnique = 'brightfield' | 'he' | 'dapi' | 'tem';

export interface StainProfile {
  id: StainingTechnique;
  name: string;
  description: string;
  tintRgba: string;
  filterEffect: string;
}

export const MICROSCOPE_PRESETS = [
  {
    id: 'brightfield-4x',
    name: 'Overview Scan',
    objective: 4 as const,
    technique: 'brightfield' as StainingTechnique,
    description: 'Scanning power overview of cellular colony morphology.',
  },
  {
    id: 'he-10x',
    name: 'Standard Histology',
    objective: 10 as const,
    technique: 'he' as StainingTechnique,
    description: 'Classic histology tissue section identification.',
  },
  {
    id: 'dapi-40x',
    name: 'High Magnification Fluorescence',
    objective: 40 as const,
    technique: 'dapi' as StainingTechnique,
    description: 'Organelle-resolved immunofluorescence probing.',
  },
  {
    id: 'tem-100x',
    name: 'Ultrastructural TEM',
    objective: 100 as const,
    technique: 'tem' as StainingTechnique,
    description: 'Membrane bilayer and ribosomal lattice visualization.',
  },
];

export function calculateScaleBarMicrons(objectivePower: number): number {
  switch (objectivePower) {
    case 4:
      return 500;
    case 10:
      return 100;
    case 40:
      return 25;
    case 100:
      return 10;
    default:
      return 50;
  }
}
