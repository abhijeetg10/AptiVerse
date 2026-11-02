import { describe, it, expect } from 'vitest';
import { ALL_INFOSYS_MOCK_TESTS } from '../src/data/infosysMockTests';
import { TECHNICAL_INTERVIEW_PROMPTS, HR_INTERVIEW_PROMPTS } from '../src/data/infosysPrepData';

describe('Infosys Mock Test Integrity', () => {
  it('has valid mock test bundles', () => {
    expect(ALL_INFOSYS_MOCK_TESTS.length).toBeGreaterThan(0);
    ALL_INFOSYS_MOCK_TESTS.forEach(bundle => {
      expect(bundle.id).toBeDefined();
      expect(bundle.sectionsConfig).toBeInstanceOf(Array);
      expect(bundle.sectionsConfig.length).toBeGreaterThan(0);
      expect(bundle.questions).toBeInstanceOf(Array);
      expect(bundle.questions.length).toBeGreaterThan(0);

      bundle.sectionsConfig.forEach(sec => {
        const secQs = bundle.questions.filter(q => q.section === sec.name);
        expect(secQs.length).toBeGreaterThan(0);
      });

      bundle.questions.forEach((q, idx) => {
        expect(q.id, `question ${idx} in ${bundle.id} missing id`).toBeDefined();
        expect(q.options, `question ${idx} in ${bundle.id} missing options`).toBeInstanceOf(Array);
        expect(q.options.length, `question ${idx} options should be > 0`).toBeGreaterThan(0);
        expect(q.correctAnswer).toBeTypeOf('number');
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThan(q.options.length);
      });
    });
  });

  it('has valid interview questions with expectedPoints', () => {
    const allPrompts = [...TECHNICAL_INTERVIEW_PROMPTS, ...HR_INTERVIEW_PROMPTS];
    expect(allPrompts.length).toBeGreaterThan(0);
    allPrompts.forEach((q, idx) => {
      expect(q.expectedPoints, `interview question ${idx} (${q.id}) missing expectedPoints`).toBeInstanceOf(Array);
      expect(q.expectedPoints.length).toBeGreaterThan(0);
    });

    ALL_INFOSYS_MOCK_TESTS.forEach(bundle => {
      expect(bundle.technicalPrompts).toBeInstanceOf(Array);
      bundle.technicalPrompts.forEach((p, idx) => {
        expect(p.expectedPoints, `tech prompt ${idx} in ${bundle.id} missing expectedPoints`).toBeInstanceOf(Array);
      });
      expect(bundle.hrPrompts).toBeInstanceOf(Array);
      bundle.hrPrompts.forEach((p, idx) => {
        expect(p.expectedPoints, `hr prompt ${idx} in ${bundle.id} missing expectedPoints`).toBeInstanceOf(Array);
      });
    });
  });
});

