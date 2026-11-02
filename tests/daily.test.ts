import { describe, it, expect } from 'vitest';
import { 
  getISTDateString, 
  getISTMidnightCountdown, 
  getDeterministicFallbackChallenge 
} from '../src/services/dailyChallengeService';

describe('Global Daily Challenge Service & Scheduling Rules', () => {
  it('generates consistent YYYY-MM-DD format for IST timezone', () => {
    const istDate = getISTDateString();
    expect(istDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('guarantees identical challenge configuration for the same calendar date', () => {
    const testDate = '2026-11-02';
    const challengeRun1 = getDeterministicFallbackChallenge(testDate);
    const challengeRun2 = getDeterministicFallbackChallenge(testDate);

    expect(challengeRun1.id).toBe(challengeRun2.id);
    expect(challengeRun1.challenge_date).toBe(testDate);
    expect(challengeRun1.game_type).toBe(challengeRun2.game_type);
    expect(challengeRun1.challenge_seed).toBe(challengeRun2.challenge_seed);
    expect(JSON.stringify(challengeRun1.challenge_config)).toBe(JSON.stringify(challengeRun2.challenge_config));
  });

  it('guarantees rollover to a different challenge on consecutive days', () => {
    const day1 = getDeterministicFallbackChallenge('2026-11-02');
    const day2 = getDeterministicFallbackChallenge('2026-11-03');

    expect(day1.challenge_date).not.toBe(day2.challenge_date);
    expect(day1.challenge_seed).not.toBe(day2.challenge_seed);
  });

  it('calculates midnight countdown with positive remaining milliseconds', () => {
    const countdown = getISTMidnightCountdown();
    expect(countdown.diffMs).toBeGreaterThan(0);
    expect(countdown.diffMs).toBeLessThanOrEqual(24 * 60 * 60 * 1000);
    expect(countdown.formatted).toMatch(/^\d{2}h : \d{2}m : \d{2}s$/);
  });
});
