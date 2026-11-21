/**
 * Standardizes and merges college names across AptiVerse
 * Handles spelling variations, abbreviations, typos, and merges multi-campus/foundation names.
 */
export const normalizeCollege = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') return '-';
  const raw = name.trim();
  const lower = raw
    .toLowerCase()
    .replace(/[\.,\-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!lower || lower === '-' || lower === 'none' || lower === 'null' || lower === 'undefined') {
    return '-';
  }

  // JECRC / JSRC Foundation, College of Engineering, & University
  if (
    lower.includes('jecrc') ||
    lower.includes('jsrc') ||
    lower.includes('jaipur engineering college and research') ||
    lower.includes('jaipur engineering college & research')
  ) {
    return 'JECRC University & Foundation, Jaipur';
  }

  // VSB Engineering College
  if (lower.includes('vsb') || lower.includes('v s b')) {
    return 'VSB Engineering College, Karur';
  }

  // Chennai Institute of Technology (CIT)
  if (lower === 'cit' || lower.includes('chennai institute of technology')) {
    return 'Chennai Institute of Technology (CIT), Chennai';
  }

  // Rajarambapu Institute of Technology (RIT)
  if (lower === 'rit' || lower.includes('rajarambapu institute of technology')) {
    return 'Rajarambapu Institute of Technology (RIT), Sangli';
  }

  // KG College of Arts and Science / KGCAS
  if (
    lower === 'kgcas' ||
    lower.includes('kg college') ||
    lower.includes('kgcas') ||
    lower.includes('kg college of arys')
  ) {
    return 'KG College of Arts and Science (KGCAS), Coimbatore';
  }

  // KGiSL Institute of Technology
  if (lower.includes('kgisl')) {
    return 'KGiSL Institute of Technology, Coimbatore';
  }

  // SKN Sinhagad College of Engineering
  if (lower.includes('sinhagad') || lower.includes('sinhgad')) {
    return 'SKN Sinhagad College of Engineering, Solapur';
  }

  // Parul University / Institute
  if (lower.includes('parul')) {
    return 'Parul University, Vadodara';
  }

  // Latthe Education Society
  if (lower.includes('latthe')) {
    return 'Latthe Education Society Polytechnic, Sangli';
  }

  // Anurag University / Group
  if (lower.includes('anurag')) {
    return 'Anurag University, Hyderabad';
  }

  // Veer Surendra Sai University of Technology (VSSUT)
  if (lower.includes('veer surendra sai') || lower.includes('vssut')) {
    return 'Veer Surendra Sai University of Technology (VSSUT), Burla';
  }

  // Vellore Institute of Technology (VIT)
  if (lower === 'vit' || lower.includes('vellore institute of technology')) {
    return 'Vellore Institute of Technology (VIT), Vellore';
  }

  // Default: capitalize words cleanly
  return raw
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};
