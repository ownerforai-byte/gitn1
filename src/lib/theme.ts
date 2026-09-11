export interface ThemeDefinition {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  ring: string;
  glow: string;
}

export const ACCENT_THEMES: ThemeDefinition[] = [
  {
    id: 'blue',
    name: 'Cobalt Bio',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    ring: 'rgba(37, 99, 235, 0.4)',
    glow: 'rgba(59, 130, 246, 0.25)',
  },
  {
    id: 'emerald',
    name: 'Botanical Emerald',
    primary: '#059669',
    primaryHover: '#047857',
    ring: 'rgba(5, 150, 105, 0.4)',
    glow: 'rgba(16, 185, 129, 0.25)',
  },
  {
    id: 'violet',
    name: 'Deep Histology',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    ring: 'rgba(124, 58, 237, 0.4)',
    glow: 'rgba(139, 92, 246, 0.25)',
  },
  {
    id: 'amber',
    name: 'Neural Amber',
    primary: '#d97706',
    primaryHover: '#b45309',
    ring: 'rgba(217, 119, 6, 0.4)',
    glow: 'rgba(245, 158, 11, 0.25)',
  },
  {
    id: 'rose',
    name: 'Gram Rose',
    primary: '#e11d48',
    primaryHover: '#be123c',
    ring: 'rgba(225, 29, 72, 0.4)',
    glow: 'rgba(244, 63, 94, 0.25)',
  },
  {
    id: 'cyan',
    name: 'Cryo-EM Cyan',
    primary: '#0891b2',
    primaryHover: '#0e7490',
    ring: 'rgba(8, 145, 178, 0.4)',
    glow: 'rgba(6, 182, 212, 0.25)',
  },
];
