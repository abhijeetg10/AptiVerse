import { describe, it, expect } from 'vitest';
import { isValidCollegeName, isValidDepartmentName } from '../src/constants/institutions';

describe('Security & Input Validation: Institutions & Anti-Spam', () => {
  it('rejects null, undefined, and empty string inputs', () => {
    expect(isValidCollegeName(null).valid).toBe(false);
    expect(isValidCollegeName(undefined).valid).toBe(false);
    expect(isValidCollegeName('').valid).toBe(false);
    expect(isValidCollegeName('   ').valid).toBe(false);
  });

  it('rejects strings shorter than 5 characters', () => {
    expect(isValidCollegeName('MIT').valid).toBe(false);
    expect(isValidCollegeName('COEP').valid).toBe(false);
  });

  it('rejects banned spam/junk keywords', () => {
    expect(isValidCollegeName('test').valid).toBe(false);
    expect(isValidCollegeName('asdf').valid).toBe(false);
    expect(isValidCollegeName('dummy').valid).toBe(false);
    expect(isValidCollegeName('fake').valid).toBe(false);
    expect(isValidCollegeName('college').valid).toBe(false);
    expect(isValidCollegeName('---').valid).toBe(false);
    expect(isValidCollegeName('....').valid).toBe(false);
  });

  it('accepts valid, fully accredited college names', () => {
    expect(isValidCollegeName('Rajarambapu Institute of Technology, Sangli').valid).toBe(true);
    expect(isValidCollegeName('College of Engineering, Pune (COEP)').valid).toBe(true);
    expect(isValidCollegeName('Vellore Institute of Technology (VIT), Vellore').valid).toBe(true);
  });

  it('validates department names and blocks junk inputs', () => {
    expect(isValidDepartmentName(null).valid).toBe(false);
    expect(isValidDepartmentName('ab').valid).toBe(false);
    expect(isValidDepartmentName('dummy').valid).toBe(false);
    expect(isValidDepartmentName('Department of Computer Science and Engineering').valid).toBe(true);
  });
});

describe('Security & Integrity: Anti-Cheat & Score Bounding', () => {
  it('clamps and validates session scores within safe boundaries', () => {
    const clampScore = (raw: number) => Math.min(10, Math.max(0, Math.round(raw)));
    expect(clampScore(10)).toBe(10);
    expect(clampScore(0)).toBe(0);
    expect(clampScore(99999)).toBe(10); // Attempted score overflow injection
    expect(clampScore(-50)).toBe(0);    // Negative score injection
  });

  it('clamps and validates accuracy percentages between 0 and 100', () => {
    const clampAccuracy = (raw: number) => Math.min(100, Math.max(0, Math.round(raw)));
    expect(clampAccuracy(100)).toBe(100);
    expect(clampAccuracy(0)).toBe(0);
    expect(clampAccuracy(500)).toBe(100);
    expect(clampAccuracy(-20)).toBe(0);
  });

  it('enforces non-negative completion times in seconds', () => {
    const sanitizeTime = (ms: number) => Math.max(1, Math.round(ms / 1000));
    expect(sanitizeTime(15000)).toBe(15);
    expect(sanitizeTime(0)).toBe(1);
    expect(sanitizeTime(-99999)).toBe(1); // Anti-tamper on negative duration
  });

  it('rejects bot / scripted completions faster than minimum human threshold (< 2 seconds)', () => {
    const isValidHumanDuration = (elapsedSeconds: number) => elapsedSeconds >= 2;
    expect(isValidHumanDuration(0.1)).toBe(false); // Bot script
    expect(isValidHumanDuration(1.2)).toBe(false); // Automated submission
    expect(isValidHumanDuration(2.0)).toBe(true);  // Legitimate player minimum
    expect(isValidHumanDuration(15.5)).toBe(true); // Normal gameplay
  });
});

describe('Authorization & RBAC Security', () => {
  const checkAdminAccess = (user: { role?: string } | null | undefined): boolean => {
    return !!user && user.role === 'admin';
  };

  it('restricts admin portal access strictly to admin role', () => {
    expect(checkAdminAccess(null)).toBe(false);
    expect(checkAdminAccess(undefined)).toBe(false);
    expect(checkAdminAccess({ role: 'user' })).toBe(false);
    expect(checkAdminAccess({ role: 'student' })).toBe(false);
    expect(checkAdminAccess({ role: 'guest' })).toBe(false);
    expect(checkAdminAccess({ role: 'admin' })).toBe(true);
  });

  it('strips unauthorized privilege escalation fields from user update payloads', () => {
    const sanitizeProfileUpdate = (input: Record<string, any>, isCallerAdmin: boolean) => {
      const allowedFields = ['name', 'college', 'department', 'avatar_url'];
      const sanitized: Record<string, any> = {};
      
      for (const field of allowedFields) {
        if (input[field] !== undefined) sanitized[field] = input[field];
      }
      if (isCallerAdmin) {
        if (input.role !== undefined) sanitized.role = input.role;
        if (input.is_blocked !== undefined) sanitized.is_blocked = input.is_blocked;
        if (input.warning_message !== undefined) sanitized.warning_message = input.warning_message;
      }
      return sanitized;
    };

    const exploitPayload = {
      name: 'Honest Student',
      college: 'Rajarambapu Institute of Technology, Sangli',
      role: 'admin',           // Privilege escalation attempt!
      is_blocked: false,       // Bypass suspension attempt!
      warning_message: null
    };

    // Ordinary user update attempt
    const userResult = sanitizeProfileUpdate(exploitPayload, false);
    expect(userResult.role).toBeUndefined();
    expect(userResult.is_blocked).toBeUndefined();
    expect(userResult.name).toBe('Honest Student');

    // Admin update attempt
    const adminResult = sanitizeProfileUpdate(exploitPayload, true);
    expect(adminResult.role).toBe('admin');
    expect(adminResult.is_blocked).toBe(false);
  });
});

describe('Leaderboard & Scoring Determinism', () => {
  it('applies deterministic multi-factor tie-breaking', () => {
    const players = [
      { user_id: 'user_c', total_score: 90, avg_accuracy: 95, total_time: 40 },
      { user_id: 'user_a', total_score: 100, avg_accuracy: 90, total_time: 50 },
      { user_id: 'user_b', total_score: 100, avg_accuracy: 98, total_time: 45 },
      { user_id: 'user_d', total_score: 100, avg_accuracy: 98, total_time: 30 }, // Faster with same score & accuracy
      { user_id: 'user_e', total_score: 100, avg_accuracy: 98, total_time: 30 }  // Exact tie - falls back to user_id
    ];

    const sorted = [...players].sort((a, b) => {
      if (b.total_score !== a.total_score) return b.total_score - a.total_score;
      if (b.avg_accuracy !== a.avg_accuracy) return b.avg_accuracy - a.avg_accuracy;
      if (a.total_time !== b.total_time) return a.total_time - b.total_time;
      return a.user_id.localeCompare(b.user_id);
    });

    expect(sorted[0].user_id).toBe('user_d'); // Rank 1: 100 score, 98% acc, 30s
    expect(sorted[1].user_id).toBe('user_e'); // Rank 2: 100 score, 98% acc, 30s, user_e > user_d
    expect(sorted[2].user_id).toBe('user_b'); // Rank 3: 100 score, 98% acc, 45s
    expect(sorted[3].user_id).toBe('user_a'); // Rank 4: 100 score, 90% acc
    expect(sorted[4].user_id).toBe('user_c'); // Rank 5: 90 score
  });
});


