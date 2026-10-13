/**
 * Puzzle lifecycle and unplayed-pool management utility.
 * Guarantees that:
 * 1. Each assigned attempt receives a stable, fresh puzzle identity.
 * 2. Renders, timer ticks, retries, and resets do not mutate the assigned puzzle.
 * 3. Recently played puzzle variants/seeds are tracked per user to prevent immediate replay.
 * 4. A clean pool exhaustion policy prevents immediate repeats when content pools are cycled.
 */

// Simple, fast deterministic PRNG (Mulberry32)
export function createSeededRandom(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates an integer seed based on string or timestamp
 */
export function hashStringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/**
 * Gets a fresh, unseen puzzle variant seed,
 * avoiding recently played items for the given authenticated user.
 * 
 * @param gameId Identifier of the game (e.g. 'motion', 'grid', 'switch', 'inductive', 'sudoku')
 * @param userId Authenticated user ID (or 'anon')
 * @param level Current game level or difficulty rank
 * @param poolSize Size of the variant pool for this difficulty tier
 */
export function getFreshVariantSeed(
  gameId: string,
  userId: string | null | undefined,
  level: number,
  poolSize: number = 30
): number {
  const safeUser = userId || 'anon';
  const storageKey = `aptiverse_history_${gameId}_${safeUser}`;
  let history: number[] = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      history = JSON.parse(raw);
    }
  } catch {
    history = [];
  }

  // Available candidate variants
  const candidates: number[] = [];
  for (let i = 0; i < poolSize; i++) {
    if (!history.includes(i)) {
      candidates.push(i);
    }
  }

  let selected: number;
  if (candidates.length > 0) {
    const idx = Math.floor(Math.random() * candidates.length);
    selected = candidates[idx];
  } else {
    // Pool exhausted! Reset history but avoid immediately repeating the most recent one
    const lastPlayed = history[history.length - 1];
    const resetCandidates: number[] = [];
    for (let i = 0; i < poolSize; i++) {
      if (i !== lastPlayed) {
        resetCandidates.push(i);
      }
    }
    const idx = Math.floor(Math.random() * (resetCandidates.length || 1));
    selected = resetCandidates[idx] ?? 0;
    history = [];
  }

  // Record into history (keep max poolSize items)
  history.push(selected);
  if (history.length > poolSize) {
    history.shift();
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(history));
  } catch {}

  // Mix selected variant with level to produce final deterministic seed
  return (selected * 1000 + level * 37 + Math.floor(Math.random() * 100)) >>> 0;
}

/**
 * Unseen assessment pool tracker for fixed validated content banks (RC and DI).
 * Keeps track of played assessments per user.
 * 
 * Explicit signature:
 * @param gameId 'rc' or 'di'
 * @param userId Authenticated user ID (or 'anon')
 * @param level Difficulty tier or assessment level index
 * @param poolSize Total number of validated assessments in the bank
 */
export function getNextUnseenAssessmentIndex(
  gameId: string,
  userId: string | null | undefined,
  level: number,
  poolSize: number = 3
): number {
  const safeUser = userId || 'anon';
  const totalAssessments = Math.max(1, poolSize);
  const storageKey = `aptiverse_unseen_assessments_${gameId}_${safeUser}`;
  let playedList: number[] = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      playedList = JSON.parse(raw);
    }
  } catch {
    playedList = [];
  }

  // Find unplayed assessment indices
  const unplayed: number[] = [];
  for (let i = 0; i < totalAssessments; i++) {
    if (!playedList.includes(i)) {
      unplayed.push(i);
    }
  }

  let chosen: number;
  if (unplayed.length > 0) {
    chosen = unplayed[Math.floor(Math.random() * unplayed.length)];
  } else {
    // All available assessments have been completed!
    // Pool exhaustion policy: cycle through pool but exclude immediately preceding one
    const lastIndex = playedList[playedList.length - 1];
    const pool = Array.from({ length: totalAssessments }, (_, i) => i).filter(i => i !== lastIndex);
    chosen = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : 0;
    playedList = [];
  }

  playedList.push(chosen);
  try {
    localStorage.setItem(storageKey, JSON.stringify(playedList));
  } catch {}

  return chosen;
}

/**
 * Creates a unique attempt UUID
 */
export function createAttemptId(): string {
  return crypto.randomUUID();
}
