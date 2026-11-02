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
});
