export interface ClinicalTrial {
  nctId: string;
  title: string;
  cancerType: string;
  description: string;
  studyUrl?: string;
  statusLabel: string;
  contactName?: string;
  phone?: string;
  email?: string;
  pdfUrl?: string;
  pdfAssetUrl?: string;
  pdfLabel?: string;
  sortOrder?: number;
}

// Preserve addresses used by the previous site's category links.
const legacyCategoryIds: Record<string, string> = {
  'all-comers': 'all-comers', 'breast cancer': 'breast', colorectal: 'colorectal',
  'extensive stage small cell lung cancer': 'es-sclc', 'gastrointestinal stromal tumors': 'gist',
  'head & neck': 'head-neck', 'hr+/her2- breast cancer': 'hr-positive-breast',
  'lung – non-small cell': 'lung-rmc', 'metastatic castration-resistant prostate cancer': 'prostate',
  'metastatic colorectal cancer': 'metastatic-colorectal', 'metastatic pancreatic adenocarcinoma': 'metastatic-pancreatic',
  'multiple myeloma': 'myeloma', 'observational / lab': 'observational', 'ovarian cancer': 'ovarian', 'pancreatic cancer': 'pancreatic',
};

export function groupTrials(trials: ClinicalTrial[]) {
  const groups = new Map<string, {id: string; title: string; trials: ClinicalTrial[]}>();
  for (const trial of trials) {
    const title = trial.cancerType.trim();
    const key = title.toLowerCase();
    // Encoding keeps custom category IDs unique, even when punctuation differs.
    const id = legacyCategoryIds[key] || `category-${encodeURIComponent(key)}`;
    if (!groups.has(key)) groups.set(key, {id, title, trials: []});
    groups.get(key)!.trials.push(trial);
  }
  return [...groups.values()].sort((a, b) => a.title.localeCompare(b.title)).map(group => ({
    ...group,
    trials: [...group.trials].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.title.localeCompare(b.title)),
  }));
}
