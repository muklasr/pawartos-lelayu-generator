import { describe, it, expect } from 'vitest';
import { getPasaran, formatWithPasaran, formatStandard } from '../types';

describe('Date Utilities', () => {
  describe('getPasaran', () => {
    it('returns correct pasaran for a known date (2024-08-12 is Senin Pahing)', () => {
      const date = new Date(2024, 7, 12); // August is 7
      expect(getPasaran(date)).toBe('Pahing');
    });

    it('returns correct pasaran for epoch date (2000-01-01 is Sabtu Pahing)', () => {
      const date = new Date(2000, 0, 1);
      expect(getPasaran(date)).toBe('Pahing');
    });
  });

  describe('formatWithPasaran', () => {
    it('formats date correctly in Javanese style', () => {
      const date = new Date(2024, 7, 12); // August 12, 2024 is Senin Pahing
      const result = formatWithPasaran(date);
      expect(result).toContain('Senin');
      expect(result).toContain('Pahing');
      expect(result).toContain('12 Agustus 2024');
    });
  });

  describe('formatStandard', () => {
    it('formats date correctly in standard Indonesian style (no pasaran)', () => {
      const date = new Date(2024, 7, 12);
      const result = formatStandard(date);
      expect(result).toContain('Senin');
      expect(result).not.toContain('Pahing');
      expect(result).toContain('12 Agustus 2024');
    });
  });
});
