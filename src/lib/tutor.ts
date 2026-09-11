import { CellItem, OrganelleItem } from '../types';

export function generateTutorResponse(
  question: string,
  cell: CellItem,
  organelle: OrganelleItem
): string {
  const q = question.toLowerCase();

  // Evolutionary origins
  if (q.includes('evolution') || q.includes('origin') || q.includes('endosymbi')) {
    if (organelle.attributes.evolutionaryOrigin) {
      return `According to the Endosymbiotic Theory (first championed by Lynn Margulis), ${organelle.name} originated from an ancient alphaproteobacterial or cyanobacterial endosymbiont engulfed by an ancestral proto-eukaryotic archaeon ~1.8 billion years ago. It retains vestigial circular double-stranded DNA, bacterial-like 70S ribosomes, and replicates independently via binary fission.`;
    }
    return `The ${organelle.name} is part of the eukaryotic endomembrane system, which arose through ancestral invaginations of the plasma membrane. This compartmentalization allowed thermodynamic specialization, localized microenvironments, and separation of transcription from translation.`;
  }

  // Degradation, failure, disease
  if (q.includes('fail') || q.includes('degrad') || q.includes('disease') || q.includes('break') || q.includes('mutation')) {
    const disease = cell.diseaseStates.find((d) => d.organelleId === organelle.id);
    if (disease) {
      return `When ${organelle.name} undergoes functional failure, cellular homeostasis collapses. In ${disease.diseaseName}, ${disease.pathology}. Ultrastructural examination reveals ${disease.visualChange}. This manifests clinically as ${disease.clinicalImpact}.`;
    }
    return `Failure of ${organelle.name} triggers cellular stress response pathways, including the Unfolded Protein Response (UPR) and selective autophagy (such as mitophagy or crinophagy). If homeostasis cannot be restored within physiological limits, cytochrome c or apoptotic cascades are released to initiate programmed cell death (apoptosis).`;
  }

  // Energy & bioenergetics
  if (q.includes('energy') || q.includes('bioenergetic') || q.includes('atp') || q.includes('respirat') || q.includes('metabol')) {
    if (organelle.id === 'mitochondria') {
      return `The mitochondrion maintains bioenergetic efficiency by establishing a proton electrochemical gradient (Δψm ≈ -180 mV) across the inner mitochondrial membrane via Complexes I-IV of the Electron Transport Chain. Protons drive the rotational catalysis of ATP Synthase (Complex V), yielding ~30-32 moles of ATP per mole of oxidized glucose.`;
    }
    if (organelle.id === 'chloroplast') {
      return `The chloroplast couples photon absorption at Photosystems II and I with photolytic water splitting to generate a trans-thylakoid proton gradient. This powers ATP synthase and generates NADPH, which are subsequently utilized by RuBisCO in the stroma to fix atmospheric CO2 during the Calvin cycle.`;
    }
    return `${organelle.name} functions as a key metabolic consumer or regulator. It relies on ATP-dependent active transport mechanisms, proton-translocating V-ATPases, and motor proteins (kinesin/dynein) to fulfill its biological duties in ${cell.name}.`;
  }

  // Interactions with other structures
  if (q.includes('interact') || q.includes('traffic') || q.includes('signal') || q.includes('connect')) {
    return `${organelle.name} maintains dynamic contact sites with neighboring organelles via tethering protein complexes (e.g., ER-mitochondria encounter structure, or MAMs). Vesicular transport facilitated by COPI, COPII, and clathrin coats allows continuous lipid exchange, calcium signaling, and post-translational cargo delivery throughout ${cell.name}.`;
  }

  // Default deep biological synthesis
  return `In the ${cell.name} (${cell.scientificName}), the ${organelle.name} is classified as ${organelle.subtitle}. Functionally, ${organelle.attributes.function}. It features ${organelle.attributes.membrane}, with an average diameter of ${organelle.attributes.diameter}, and consists predominantly of ${organelle.attributes.composition}. Notable biological fact: "${organelle.fact}".`;
}
